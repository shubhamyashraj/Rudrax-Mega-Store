import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './SettingsContext';
import { AuthProvider, useAuth } from './AuthContext';
import { ProductProvider, useProduct } from './ProductContext';
import { InventoryProvider, useInventory } from './InventoryContext';
import { CartProvider, useCart } from './CartContext';
import { CustomerProvider, useCustomer } from './CustomerContext';
import { OrderProvider, useOrder } from './OrderContext';
import { Batch } from '../models/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Composed State Provider Stack
export function StateProvider({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ProductProvider>
          <InventoryProvider>
            <CartProvider>
              <CustomerProvider>
                <OrderProvider>
                  <StateSyncer />
                  {children}
                </OrderProvider>
              </CustomerProvider>
            </CartProvider>
          </InventoryProvider>
        </ProductProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

// StateSyncer handles low-level synchronizations (like FIFO queue indications on Firestore)
function StateSyncer() {
  const { batches } = useInventory();
  const { currentUser } = useAuth();

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
        const userIsAdmin = currentUser && (
          currentUser.role === 'Admin' || 
          currentUser.role === 'SuperAdmin' || 
          currentUser.role === 'InventoryManager' ||
          currentUser.role === 'Staff'
        );
        if (userIsAdmin) {
          updateDoc(doc(db, 'batches', b.id), { isActive }).catch(e => {
            console.error('Error updating batch active status: ', e);
          });
        }
      }
    });
  }, [batches, currentUser]);

  return null;
}

// Unified state hook for 100% backwards compatibility and clean Router-integrated architecture
export function useRudrax() {
  const navigate = useNavigate();
  const location = useLocation();

  const settingsCtx = useSettings();
  const authCtx = useAuth();
  const prodCtx = useProduct();
  const invCtx = useInventory();
  const cartCtx = useCart();
  const custCtx = useCustomer();
  const orderCtx = useOrder();

  // 1. Single Source of Truth Router Navigation Derivations (Phase 2 & 3)
  const currentRole = location.pathname.startsWith('/admin') ? 'Admin' : 'Customer';
  const setRole = (role: 'Customer' | 'Admin') => {
    if (role === 'Admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  const getActivePage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home' || path === '') return 'home';
    if (path === '/catalog') return 'catalog';
    if (path.startsWith('/product/')) return 'product-detail';
    if (path === '/cart') return 'cart';
    if (path === '/checkout') return 'checkout';
    if (path === '/orders') return 'orders';
    if (path === '/profile') return 'profile';
    return 'home';
  };
  const activePage = getActivePage();

  const setActivePage = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'catalog') navigate('/catalog');
    else if (page === 'cart') navigate('/cart');
    else if (page === 'checkout') navigate('/checkout');
    else if (page === 'orders') navigate('/orders');
    else if (page === 'profile') navigate('/profile');
  };

  const getActiveAdminTab = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/')) {
      return path.substring(7); // characters after '/admin/'
    }
    return 'dashboard';
  };
  const activeAdminTab = getActiveAdminTab();

  const setActiveAdminTab = (tab: string) => {
    navigate(`/admin/${tab}`);
  };

  const getActiveProductDetailId = () => {
    const path = location.pathname;
    const match = path.match(/^\/product\/([^/]+)/);
    return match ? match[1] : null;
  };
  const activeProductDetailId = getActiveProductDetailId();

  const setActiveProductDetailId = (id: string | null) => {
    if (id) navigate(`/product/${id}`);
    else navigate('/catalog');
  };

  // 2. Render-time dynamic aggregate stock sync (resolving Phase 3 & 4 loops)
  const syncedProducts = prodCtx.products.map(prod => {
    const updatedVariants = prod.variants.map(v => {
      const total = invCtx.batches
        .filter(b => b.productId === prod.id && b.variantId === v.id)
        .reduce((sum, b) => sum + b.quantity, 0);

      return { 
        ...v, 
        stock: total,
        totalStock: total,
        stockStatus: total === 0 ? 'Out Of Stock' : (total < 5 ? 'Low Stock' : 'In Stock')
      };
    });
    return { ...prod, variants: updatedVariants };
  });

  return {
    // Systems
    settings: settingsCtx.settings,
    updateSettings: settingsCtx.updateSettings,

    // Auth
    currentRole,
    setRole,
    currentUser: authCtx.currentUser,
    authLoading: authCtx.authLoading,
    signInWithGoogle: authCtx.signInWithGoogle,
    signInWithEmail: authCtx.signInWithEmail,
    signUpWithEmail: authCtx.signUpWithEmail,
    resetPasswordLink: authCtx.resetPasswordLink,
    signOutUser: authCtx.signOutUser,
    updateUserProfile: authCtx.updateUserProfile,

    // Product & Search
    products: syncedProducts, // Upgraded dynamic sync
    coupons: prodCtx.coupons,
    searchQuery: prodCtx.searchQuery,
    selectedCategory: prodCtx.selectedCategory,
    sortBy: prodCtx.sortBy,
    setSearchQuery: prodCtx.setSearchQuery,
    setSelectedCategory: prodCtx.setSelectedCategory,
    setSortBy: prodCtx.setSortBy,
    createProduct: prodCtx.createProduct,
    editProduct: prodCtx.editProduct,
    deleteProduct: prodCtx.deleteProduct,
    createCoupon: prodCtx.createCoupon,
    toggleCoupon: prodCtx.toggleCoupon,
    clearAllProductsAndInventory: prodCtx.clearAllProductsAndInventory,
    bootstrapCatalog: prodCtx.bootstrapCatalog,

    // Inventory
    batches: invCtx.batches,
    addBatch: invCtx.addBatch,
    deleteBatch: invCtx.deleteBatch,

    // Cart
    cart: cartCtx.cart,
    wishlist: cartCtx.wishlist,
    recentlyViewed: cartCtx.recentlyViewed,
    addToCart: cartCtx.addToCart,
    updateCartQty: cartCtx.updateCartQty,
    removeFromCart: cartCtx.removeFromCart,
    clearCart: cartCtx.clearCart,
    toggleWishlist: cartCtx.toggleWishlist,
    addToRecentlyViewed: cartCtx.addToRecentlyViewed,
    clearRecentlyViewed: cartCtx.clearRecentlyViewed,

    // Customer Profiles & Addresses
    allUsers: custCtx.allUsers,
    addresses: custCtx.addresses,
    loyaltyPoints: custCtx.loyaltyPoints,
    updateUserRole: custCtx.updateUserRole,
    addAddress: custCtx.addAddress,

    // Navigation fallback parameters
    activePage,
    setActivePage,
    activeAdminTab,
    setActiveAdminTab,
    activeProductDetailId,
    setActiveProductDetailId,

    // Orders & Returns
    orders: orderCtx.orders,
    returns: orderCtx.returns,
    placeOrder: orderCtx.placeOrder,
    updateOrderStatus: orderCtx.updateOrderStatus,
    requestReturn: orderCtx.requestReturn,
    processReturnRequest: orderCtx.processReturnRequest
  };
}
