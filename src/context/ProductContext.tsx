import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Coupon, Variant } from '../models/types';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { collection, onSnapshot, setDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  coupons: Coupon[];
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSortBy: (sort: string) => void;
  createProduct: (product: Omit<Product, 'variants'> & { variants: Omit<Variant, 'stock'>[] }) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  createCoupon: (coupon: Coupon) => Promise<void>;
  toggleCoupon: (code: string) => Promise<void>;
  clearAllProductsAndInventory: () => Promise<void>;
  bootstrapCatalog: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Filtering / Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Products Real-time Snapshot
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Product);
      });
      setProducts(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsub();
  }, []);

  // Coupons Real-time Snapshot
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const items: Coupon[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Coupon);
      });
      setCoupons(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
    });
    return () => unsub();
  }, []);

  const createProduct = async (p: Omit<Product, 'variants'> & { variants: Omit<Variant, 'stock'>[] }) => {
    const newProduct: Product = {
      ...p,
      rating: 5.0,
      reviewsCount: 1,
      variants: p.variants.map(v => ({
        ...v,
        stock: 0,
        variantId: v.variantId || v.id,
        attributes: v.attributes || {},
        mrp: v.mrp || 0,
        sellingPrice: v.sellingPrice || 0,
        costPrice: v.costPrice || 0
      })) as Variant[]
    } as unknown as Product;

    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${newProduct.id}`);
    }
  };

  const editProduct = async (p: Product) => {
    try {
      await setDoc(doc(db, 'products', p.id), p);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${p.id}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      
      const batchesSnap = await getDocs(collection(db, 'batches'));
      batchesSnap.forEach(async (batchDoc) => {
        const batchData = batchDoc.data();
        if (batchData.productId === productId) {
          await deleteDoc(doc(db, 'batches', batchDoc.id));
        }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  const createCoupon = async (c: Coupon) => {
    try {
      await setDoc(doc(db, 'coupons', c.code), c);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `coupons/${c.code}`);
    }
  };

  const toggleCoupon = async (code: string) => {
    const c = coupons.find(cp => cp.code === code);
    if (!c) return;
    try {
      await setDoc(doc(db, 'coupons', code), { ...c, isActive: !c.isActive });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `coupons/${code}`);
    }
  };

  const clearAllProductsAndInventory = async () => {
    try {
      console.log("Preparing database cleanup operations...");

      // 1. Delete all products
      const pSnap = await getDocs(collection(db, 'products'));
      for (const pDoc of pSnap.docs) {
        await deleteDoc(doc(db, 'products', pDoc.id));
      }

      // 2. Delete all batches
      const bSnap = await getDocs(collection(db, 'batches'));
      for (const bDoc of bSnap.docs) {
        await deleteDoc(doc(db, 'batches', bDoc.id));
      }

      // 3. Delete all coupons
      const cSnap = await getDocs(collection(db, 'coupons'));
      for (const cDoc of cSnap.docs) {
        await deleteDoc(doc(db, 'coupons', cDoc.id));
      }

      console.log("Catalog database wiped cleanly.");
    } catch (err) {
      console.error("Purging records error:", err);
    }
  };

  const bootstrapCatalog = async () => {
    try {
      console.log("Starting full Firestore database bootstrap with initial seed packs...");
      const { INITIAL_PRODUCTS, INITIAL_BATCHES, INITIAL_COUPONS } = await import('../inventory/initialData');

      // 1. Write Products
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }

      // 2. Write Batches
      for (const b of INITIAL_BATCHES) {
        await setDoc(doc(db, 'batches', b.id), b);
      }

      // 3. Write Coupons
      for (const c of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', c.code), c);
      }

      console.log("Database successfully seeded with reference products, batches, and launch coupons.");
    } catch (e) {
      console.error("Bootstrapping database failed: ", e);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      coupons,
      searchQuery,
      selectedCategory,
      sortBy,
      setSearchQuery,
      setSelectedCategory,
      setSortBy,
      createProduct,
      editProduct,
      deleteProduct,
      createCoupon,
      toggleCoupon,
      clearAllProductsAndInventory,
      bootstrapCatalog
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within ProductProvider');
  return context;
}
