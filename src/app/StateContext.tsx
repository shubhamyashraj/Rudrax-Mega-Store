import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Batch, Order, ReturnRequest, Coupon, CartItem, SystemSettings, OrderStatus, ReturnStatus, ReturnInventoryAction, ShippingAddress, Variant } from '../models/types';
import { INITIAL_PRODUCTS, INITIAL_BATCHES, INITIAL_COUPONS, INITIAL_SETTINGS } from '../inventory/initialData';
import { db, auth, handleFirestoreError, OperationType } from '../firebase/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

interface StateContextType {
  products: Product[];
  batches: Batch[];
  orders: Order[];
  returns: ReturnRequest[];
  coupons: Coupon[];
  cart: CartItem[];
  settings: SystemSettings;
  currentRole: 'Customer' | 'Admin';
  currentUser: { email: string; name: string; phone: string; loyaltyPoints: number; photoURL?: string };
  addresses: ShippingAddress[];
  activePage: string; // "home", "catalog", "product-detail", "cart", "checkout", "orders", "profile"
  activeProductDetailId: string | null;
  activeAdminTab: string; // "dashboard", "products", "inventory", "orders", "returns", "customers", "coupons", "settings"
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  
  // Actions
  setRole: (role: 'Customer' | 'Admin') => void;
  setActivePage: (page: string) => void;
  setActiveProductDetailId: (id: string | null) => void;
  setActiveAdminTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSortBy: (sort: string) => void;
  
  // Cart Actions
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateCartQty: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  
  // Checkout & Order Actions
  placeOrder: (
    address: ShippingAddress, 
    deliveryOption: string, 
    paymentMethod: Order['paymentMethod'], 
    couponCode?: string
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note: string) => Promise<void>;
  requestReturn: (orderId: string, productId: string, variantId: string, quantity: number, reason: string) => Promise<void>;
  processReturnRequest: (returnId: string, status: ReturnStatus, invAction: ReturnInventoryAction) => Promise<void>;
  
  // Create / Edit Actions - Firestore Write-through
  createProduct: (product: Omit<Product, 'variants'> & { variants: Omit<Variant, 'stock'>[] }) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addBatch: (batch: Omit<Batch, 'isActive'>) => Promise<void>;
  deleteBatch: (batchId: string) => Promise<void>;
  createCoupon: (coupon: Coupon) => Promise<void>;
  toggleCoupon: (code: string) => Promise<void>;
  updateSettings: (newSettings: SystemSettings) => Promise<void>;
  addAddress: (address: ShippingAddress) => void;

  // Real auth operations
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: React.ReactNode }) {
  // Navigation / Page States
  const [currentRole, setRole] = useState<'Customer' | 'Admin'>('Customer');
  const [activePage, setActivePage] = useState<string>('home');
  const [activeProductDetailId, setActiveProductDetailId] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Firebase Real-time Synchronized States
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(350); // Welcome bonus

  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      fullName: "Shubham Yashraj",
      addressLine1: "Apartment 4B, Emerald Heights",
      addressLine2: "DLF Phase 4, Lane 12",
      city: "Gurugram",
      state: "Haryana",
      zipCode: "122002",
      phone: "+91 98765 43210"
    },
    {
      fullName: "Shubham Home",
      addressLine1: "C-12, Green Park Extension",
      addressLine2: "Near Metro Gate 3",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110016",
      phone: "+91 98765 43210"
    }
  ]);

  // Auth Subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Google Login popup tool
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Google Sign-in failed: ', e);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Google Sign-out failed: ', e);
    }
  };

  // Synchronizers of Firebase Real-time snapshots
  // Seeding occurs dynamically if collection is completely empty.

  // 1. Products Sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Product);
      });
      if (items.length > 0) {
        setProducts(items);
      } else {
        // Seed initial products only if current user is admin
        const userIsAdmin = fbUser && fbUser.email === 'shubhamyashraj@gmail.com';
        if (userIsAdmin) {
          INITIAL_PRODUCTS.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'products', p.id), p);
            } catch(e) {
              console.error('Seeding product error: ', e);
            }
          });
        }
        setProducts(INITIAL_PRODUCTS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsub();
  }, [fbUser]);

  // 2. Batches Sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'batches'), (snapshot) => {
      const items: Batch[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Batch);
      });
      if (items.length > 0) {
        setBatches(items);
      } else {
        // Seed initial batches only if current user is admin
        const userIsAdmin = fbUser && fbUser.email === 'shubhamyashraj@gmail.com';
        if (userIsAdmin) {
          INITIAL_BATCHES.forEach(async (b) => {
            try {
              await setDoc(doc(db, 'batches', b.id), b);
            } catch(e) {
              console.error('Seeding batch error: ', e);
            }
          });
        }
        setBatches(INITIAL_BATCHES);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'batches');
    });
    return () => unsub();
  }, [fbUser]);

  // 3. Coupons Sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const items: Coupon[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Coupon);
      });
      if (items.length > 0) {
        setCoupons(items);
      } else {
        // Seed initial coupons only if current user is admin
        const userIsAdmin = fbUser && fbUser.email === 'shubhamyashraj@gmail.com';
        if (userIsAdmin) {
          INITIAL_COUPONS.forEach(async (c) => {
            try {
              await setDoc(doc(db, 'coupons', c.code), c);
            } catch(e) {
              console.error('Seeding coupon error: ', e);
            }
          });
        }
        setCoupons(INITIAL_COUPONS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
    });
    return () => unsub();
  }, [fbUser]);

  // 4. Settings Sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snapshot) => {
      let configObj: SystemSettings | null = null;
      snapshot.forEach(docSnap => {
        if (docSnap.id === 'config') {
          configObj = docSnap.data() as SystemSettings;
        }
      });
      if (configObj) {
        setSettings(configObj);
      } else {
        // Seed initial settings only if current user is admin
        const userIsAdmin = fbUser && fbUser.email === 'shubhamyashraj@gmail.com';
        if (userIsAdmin) {
          setDoc(doc(db, 'settings', 'config'), INITIAL_SETTINGS).catch(e => {
            console.error('Seeding settings error: ', e);
          });
        }
        setSettings(INITIAL_SETTINGS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'settings');
    });
    return () => unsub();
  }, [fbUser]);

  // 5. Orders Sync
  useEffect(() => {
    if (!fbUser) {
      setOrders([]);
      return;
    }

    const isAdminUser = fbUser.email === 'shubhamyashraj@gmail.com';
    const ordersQuery = isAdminUser 
      ? collection(db, 'orders')
      : query(collection(db, 'orders'), where('customerEmail', '==', fbUser.email));

    const unsub = onSnapshot(ordersQuery, (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Order);
      });
      items.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (items.length > 0) {
        setOrders(items);
      } else {
        // Seed historic order
        const historic: Order = {
          id: "RDX-34201",
          customerEmail: fbUser.email || "shubhamyashraj@gmail.com",
          customerName: fbUser.displayName || "Shubham Yashraj",
          customerPhone: "+91 98765 43210",
          shippingAddress: {
            fullName: "Shubham Yashraj",
            addressLine1: "Apartment 4B, Emerald Heights",
            addressLine2: "DLF Phase 4, Lane 12",
            city: "Gurugram",
            state: "Haryana",
            zipCode: "122002",
            phone: "+91 98765 43210"
          },
          deliveryOption: "Standard",
          items: [
            {
              productId: "prod-1",
              variantId: "var-1a",
              quantity: 2,
              purchasePrice: 120,
              batchId: "BAT-BR-001"
            },
            {
              productId: "prod-4",
              variantId: "var-4a",
              quantity: 3,
              purchasePrice: 28,
              batchId: "BAT-MK-001"
            }
          ],
          subtotal: 324,
          tax: 16.20,
          shippingFee: 40,
          discount: 0,
          total: 380.20,
          paymentMethod: "UPI",
          status: "Delivered",
          timeline: [
            { status: "Pending", timestamp: "2026-05-25T14:30:00Z", note: "Order placed" },
            { status: "Confirmed", timestamp: "2026-05-25T14:45:00Z", note: "Order accepted by store operators" },
            { status: "Packed", timestamp: "2026-05-25T15:30:00Z", note: "Packed under strict hygiene" },
            { status: "Shipped", timestamp: "2026-05-25T16:15:00Z", note: "Handed to courier team" },
            { status: "Out For Delivery", timestamp: "2026-05-25T18:00:00Z", note: "Delivery agent on the way" },
            { status: "Delivered", timestamp: "2026-05-25T18:35:00Z", note: "Delivered package safely" }
          ],
          createdAt: "2026-05-25T14:30:00Z"
        };
        setDoc(doc(db, 'orders', historic.id), historic).then(() => {
          setOrders([historic]);
        }).catch(e => {
          console.error('Seeding historic order error: ', e);
          setOrders([historic]);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });
    return () => unsub();
  }, [fbUser]);

  // 6. Returns Sync
  useEffect(() => {
    if (!fbUser) {
      setReturns([]);
      return;
    }

    const isAdminUser = fbUser.email === 'shubhamyashraj@gmail.com';
    const returnsQuery = isAdminUser 
      ? collection(db, 'returns')
      : query(collection(db, 'returns'), where('customerEmail', '==', fbUser.email));

    const unsub = onSnapshot(returnsQuery, (snapshot) => {
      const items: ReturnRequest[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as ReturnRequest);
      });
      items.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReturns(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'returns');
    });
    return () => unsub();
  }, [fbUser]);

  // 7. Cart & Profile Loading from localStorage
  useEffect(() => {
    const localCart = localStorage.getItem('rdx_cart_v1');
    const localPoints = localStorage.getItem('rdx_points_v1');
    const localAddrs = localStorage.getItem('rdx_addrs_v1');

    if (localCart) setCart(JSON.parse(localCart));
    if (localPoints) setLoyaltyPoints(Number(localPoints));
    if (localAddrs) setAddresses(JSON.parse(localAddrs));
  }, []);

  const saveCart = (ct: CartItem[]) => {
    setCart(ct);
    localStorage.setItem('rdx_cart_v1', JSON.stringify(ct));
  };

  // Sync aggregate stock client-side to prevent infinite update writes
  useEffect(() => {
    if (products.length === 0 || batches.length === 0) return;

    const updated = products.map(prod => {
      const updatedVariants = prod.variants.map(v => {
        const total = batches
          .filter(b => b.productId === prod.id && b.variantId === v.id)
          .reduce((sum, b) => sum + b.quantity, 0);

        return { ...v, stock: total };
      });

      const isDifferent = JSON.stringify(prod.variants) !== JSON.stringify(updatedVariants);
      if (isDifferent) {
        return { ...prod, variants: updatedVariants };
      }
      return prod;
    });

    const isCatalogDifferent = JSON.stringify(products) !== JSON.stringify(updated);
    if (isCatalogDifferent) {
      setProducts(updated);
    }
  }, [batches]);

  // FIFO Selling Batch Indicator (Firestore write active flag)
  useEffect(() => {
    if (batches.length === 0) return;

    const grouped: Record<string, Batch[]> = {};
    batches.forEach(b => {
      const key = `${b.productId}_${b.variantId}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(b);
    });

    batches.forEach(b => {
      const key = `${b.productId}_${b.variantId}`;
      const sortedActiveGroup = [...grouped[key]]
        .filter(bg => bg.quantity > 0)
        .sort((x, y) => new Date(x.mfgDate).getTime() - new Date(y.mfgDate).getTime());

      const isFirstActive = sortedActiveGroup.length > 0 && sortedActiveGroup[0].id === b.id;
      const isActive = sortedActiveGroup.length > 0 ? isFirstActive : (grouped[key].sort((x, y) => new Date(x.mfgDate).getTime() - new Date(y.mfgDate).getTime())[0]?.id === b.id);

      if (b.isActive !== isActive) {
        const userIsAdmin = fbUser && fbUser.email === 'shubhamyashraj@gmail.com';
        if (userIsAdmin) {
          updateDoc(doc(db, 'batches', b.id), { isActive }).catch(e => {
            console.error('Error updating batch active status: ', e);
          });
        }
      }
    });
  }, [products, orders, fbUser]);

  // Cart Operations
  const addToCart = (productId: string, variantId: string, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
    let nextCart = [...cart];
    if (existingIndex > -1) {
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        quantity: nextCart[existingIndex].quantity + quantity
      };
    } else {
      nextCart.push({ productId, variantId, quantity });
    }
    saveCart(nextCart);
  };

  const updateCartQty = (productId: string, variantId: string, quantity: number) => {
    let nextCart = [...cart];
    const index = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
    if (index > -1) {
      if (quantity <= 0) {
        nextCart.splice(index, 1);
      } else {
        nextCart[index] = { ...nextCart[index], quantity };
      }
      saveCart(nextCart);
    }
  };

  const removeFromCart = (productId: string, variantId: string) => {
    const nextCart = cart.filter(item => !(item.productId === productId && item.variantId === variantId));
    saveCart(nextCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Place Order transaction flow on Firestore (write-through)
  const placeOrder = async (
    address: ShippingAddress, 
    deliveryOption: string, 
    paymentMethod: Order['paymentMethod'], 
    couponCode?: string
  ) => {
    // 1. Verify Stock for all items in Cart
    for (const item of cart) {
      const prod = products.find(p => p.id === item.productId);
      const vr = prod?.variants.find(v => v.id === item.variantId);
      const totalAvailable = batches
        .filter(b => b.productId === item.productId && b.variantId === item.variantId)
        .reduce((sum, b) => sum + b.quantity, 0);

      if (!prod || !vr || totalAvailable < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for SKU: ${vr?.sku || item.variantId}. Available: ${totalAvailable}, Requested: ${item.quantity}`
        };
      }
    }

    // 2. FIFO Stock deduction & build order items records
    const orderItems: Order['items'] = [];
    const modifiedBatches = [...batches];
    let subtotal = 0;
    
    for (const item of cart) {
      let remainingToDeduct = item.quantity;
      const itemBatches = modifiedBatches
        .filter(b => b.productId === item.productId && b.variantId === item.variantId && b.quantity > 0)
        .sort((a, b) => new Date(a.mfgDate).getTime() - new Date(b.mfgDate).getTime());

      for (const batch of itemBatches) {
        if (remainingToDeduct <= 0) break;
        const batchIndexInMain = modifiedBatches.findIndex(mb => mb.id === batch.id);

        if (batch.quantity >= remainingToDeduct) {
          modifiedBatches[batchIndexInMain] = {
            ...batch,
            quantity: batch.quantity - remainingToDeduct
          };
          
          orderItems.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: remainingToDeduct,
            purchasePrice: batch.sellingPrice,
            batchId: batch.id
          });

          subtotal += remainingToDeduct * batch.sellingPrice;
          remainingToDeduct = 0;
        } else {
          const quantityTaken = batch.quantity;
          modifiedBatches[batchIndexInMain] = {
            ...batch,
            quantity: 0
          };

          orderItems.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: quantityTaken,
            purchasePrice: batch.sellingPrice,
            batchId: batch.id
          });

          subtotal += quantityTaken * batch.sellingPrice;
          remainingToDeduct -= quantityTaken;
        }
      }
    }

    // 3. Calculators
    const taxRate = settings.defaultTaxRate;
    const calculatedTax = parseFloat(((subtotal * taxRate) / 100).toFixed(2));
    
    let discount = 0;
    if (couponCode) {
      const activeCoupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
      if (activeCoupon && subtotal >= activeCoupon.minOrderValue) {
        discount = parseFloat(((subtotal * activeCoupon.discountPercent) / 100).toFixed(2));
      }
    }

    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const finalTotal = parseFloat((subtotal + calculatedTax + shippingFee - discount).toFixed(2));

    // 4. Record new Order
    const newOrderId = `RDX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: newOrderId,
      customerEmail: fbUser?.email || "shubhamyashraj@gmail.com",
      customerName: fbUser?.displayName || "Shubham Yashraj",
      customerPhone: "+91 98765 43210",
      shippingAddress: address,
      deliveryOption,
      items: orderItems,
      subtotal,
      tax: calculatedTax,
      shippingFee,
      discount,
      total: finalTotal,
      paymentMethod,
      status: "Pending",
      timeline: [
        { status: "Pending", timestamp: new Date().toISOString(), note: "Invoice generated successfully. Awaiting operator confirmation." }
      ],
      createdAt: new Date().toISOString(),
      couponUsed: couponCode
    };

    try {
      // Deduct stock in Firestore
      for (const mb of modifiedBatches) {
        const orig = batches.find(o => o.id === mb.id);
        if (orig && orig.quantity !== mb.quantity) {
          await setDoc(doc(db, 'batches', mb.id), mb);
        }
      }
      // Save order to Firestore
      await setDoc(doc(db, 'orders', newOrderId), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${newOrderId}`);
      return { success: false, error: "Firebase transaction failed. Try again." };
    }
    
    // Add loyalty points
    const earnedPoints = Math.floor(finalTotal * (settings.loyaltyPointsPerDollar / 100));
    const nextPoints = loyaltyPoints + earnedPoints;
    setLoyaltyPoints(nextPoints);
    localStorage.setItem('rdx_points_v1', String(nextPoints));

    clearCart();
    return { success: true, orderId: newOrderId };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return;
    const updated = {
      ...ord,
      status,
      timeline: [...ord.timeline, { status, timestamp: new Date().toISOString(), note }]
    };
    try {
      await setDoc(doc(db, 'orders', orderId), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Return Process Flows
  const requestReturn = async (orderId: string, productId: string, variantId: string, quantity: number, reason: string) => {
    const exists = returns.some(r => r.orderId === orderId && r.productId === productId && r.variantId === variantId);
    if (exists) return;

    const orderRef = orders.find(o => o.id === orderId);
    if (!orderRef) return;

    const matchItem = orderRef.items.find(i => i.productId === productId && i.variantId === variantId);
    if (!matchItem) return;

    const refundAmount = parseFloat((matchItem.purchasePrice * quantity).toFixed(2));

    const newRequest: ReturnRequest = {
      id: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId,
      productId,
      variantId,
      quantity,
      reason,
      status: "Pending",
      inventoryAction: "None",
      refundAmount,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'returns', newRequest.id), newRequest);
      // update order return flag
      await setDoc(doc(db, 'orders', orderId), { ...orderRef, returnRequested: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `returns/${newRequest.id}`);
    }
  };

  const processReturnRequest = async (returnId: string, status: ReturnStatus, invAction: ReturnInventoryAction) => {
    const itemTarget = returns.find(r => r.id === returnId);
    if (!itemTarget) return;

    const updatedRet = {
      ...itemTarget,
      status,
      inventoryAction: invAction,
      processedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'returns', returnId), updatedRet);

      if (status === "Closed" && invAction !== "None") {
        if (invAction === "Restored") {
          const batchTarget = batches.find(b => b.productId === itemTarget.productId && b.variantId === itemTarget.variantId && b.isActive);
          if (batchTarget) {
            await setDoc(doc(db, 'batches', batchTarget.id), {
              ...batchTarget,
              quantity: batchTarget.quantity + itemTarget.quantity
            });
          } else {
            const firstAvailableIndex = batches.findIndex(b => b.productId === itemTarget.productId && b.variantId === itemTarget.variantId);
            if (firstAvailableIndex > -1) {
              const b = batches[firstAvailableIndex];
              await setDoc(doc(db, 'batches', b.id), {
                ...b,
                quantity: b.quantity + itemTarget.quantity
              });
            }
          }
        }
        await updateOrderStatus(itemTarget.orderId, 'Returned', `Return approved. Refund of ₹${itemTarget.refundAmount} initialized via original payment mode.`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `returns/${returnId}`);
    }
  };

  // Management Operations - Firestore sync integration
  const createProduct = async (p: Omit<Product, 'variants'> & { variants: Omit<Variant, 'stock'>[] }) => {
    const newProduct: Product = {
      ...p,
      rating: 5.0,
      reviewsCount: 1,
      variants: p.variants.map(v => ({ ...v, stock: 0 }))
    };
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

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      const associated = batches.filter(b => b.productId === id);
      for (const b of associated) {
        await deleteDoc(doc(db, 'batches', b.id));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const addBatch = async (b: Omit<Batch, 'isActive'>) => {
    const newBatch: Batch = {
      ...b,
      isActive: false
    };
    try {
      await setDoc(doc(db, 'batches', newBatch.id), newBatch);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `batches/${newBatch.id}`);
    }
  };

  const deleteBatch = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'batches', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `batches/${id}`);
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

  const updateSettings = async (newSettings: SystemSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'config'), newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/config');
    }
  };

  const addAddress = (addr: ShippingAddress) => {
    const updated = [addr, ...addresses];
    setAddresses(updated);
    localStorage.setItem('rdx_addrs_v1', JSON.stringify(updated));
  };

  const currentUser = {
    email: fbUser?.email || "shubhamyashraj@gmail.com",
    name: fbUser?.displayName || "Shubham Yashraj",
    phone: fbUser?.phoneNumber || "+91 98765 43210",
    loyaltyPoints,
    photoURL: fbUser?.photoURL || undefined
  };

  return (
    <StateContext.Provider value={{
      products,
      batches,
      orders,
      returns,
      coupons,
      cart,
      settings,
      currentRole,
      currentUser,
      addresses,
      activePage,
      activeProductDetailId,
      activeAdminTab,
      searchQuery,
      selectedCategory,
      sortBy,
      setRole,
      setActivePage,
      setActiveProductDetailId,
      setActiveAdminTab,
      setSearchQuery,
      setSelectedCategory,
      setSortBy,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      requestReturn,
      processReturnRequest,
      createProduct,
      editProduct,
      deleteProduct,
      addBatch,
      deleteBatch,
      createCoupon,
      toggleCoupon,
      updateSettings,
      addAddress,
      signInWithGoogle,
      signOutUser
    }}>
      {children}
    </StateContext.Provider>
  );
}

export function useRudrax() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useRudrax must be used within a StateProvider');
  }
  return context;
}
