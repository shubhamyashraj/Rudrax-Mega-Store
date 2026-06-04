import React from 'react';
import { StateProvider, useRudrax } from './StateContext';

// Import Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Import Customer Pages
import { HomePage } from '../pages/customer/HomePage';
import { ProductListingPage } from '../pages/customer/ProductListingPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';

// Import Admin Pages
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ProductManagementPage } from '../pages/admin/ProductManagementPage';
import { InventoryPage } from '../pages/admin/InventoryPage';
import { OrderPage } from '../pages/admin/OrderPage';
import { ReturnProcessor } from '../pages/admin/ReturnProcessor';
import { CouponOffers } from '../components/customer/CouponOffers';
import { AdminSettings } from '../pages/admin/AdminSettings';

function MainAppContent() {
  const {
    currentRole,
    activePage,
    activeAdminTab
  } = useRudrax();

  // If customer is viewing the site
  if (currentRole === 'Customer') {
    return (
      <CustomerLayout>
        {/* HOME PAGE ROUTE VIEW */}
        {activePage === 'home' && <HomePage />}

        {/* ACTIVE CATALOG DIRECT PRODUCT LISTINGS ROUTE VIEW */}
        {activePage === 'catalog' && <ProductListingPage />}

        {/* DYNAMIC COMPREHENSIVE PRODUCT DETAILS PAGE VIEW */}
        {activePage === 'product-detail' && <ProductDetailPage />}

        {/* PAGES OR STEPS */}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'orders' && <CustomerDashboard />}
        {activePage === 'profile' && <CustomerDashboard />}
      </CustomerLayout>
    );
  }

  // If role is Store Operator / manager / Backoffice Administrator
  return (
    <AdminLayout>
      {activeAdminTab === 'dashboard' && <DashboardPage />}
      {activeAdminTab === 'products' && <ProductManagementPage />}
      {activeAdminTab === 'inventory' && <InventoryPage />}
      {activeAdminTab === 'orders' && <OrderPage />}
      {activeAdminTab === 'returns' && <ReturnProcessor />}
      {activeAdminTab === 'coupons' && <CouponOffers />}
      {activeAdminTab === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <StateProvider>
      <MainAppContent />
    </StateProvider>
  );
}
