import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useRudrax } from '../context/StateContext';

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
import { CouponOffers } from '../components/coupon/CouponOffers';
import { AdminSettings } from '../pages/admin/AdminSettings';
import { CustomerManagementPage } from '../pages/admin/CustomerManagementPage';

function RootLayout() {
  return <Outlet />;
}

function CustomerLayoutWrapper() {
  return (
    <CustomerLayout>
      <Outlet />
    </CustomerLayout>
  );
}

function AdminLayoutWrapper() {
  const { currentUser, authLoading } = useRudrax();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono">Authenticating Operator...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || (
    currentUser.role !== 'Admin' && 
    currentUser.role !== 'SuperAdmin' && 
    currentUser.role !== 'Staff' && 
    currentUser.role !== 'OrderManager' && 
    currentUser.role !== 'InventoryManager'
  )) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Customer Views
      {
        path: '',
        element: <CustomerLayoutWrapper />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'catalog', element: <ProductListingPage /> },
          { path: 'product/:id', element: <ProductDetailPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <CustomerDashboard /> },
          { path: 'profile', element: <CustomerDashboard /> },
        ],
      },
      // Admin Views
      {
        path: 'admin',
        element: <AdminLayoutWrapper />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'products', element: <ProductManagementPage /> },
          { path: 'inventory', element: <InventoryPage /> },
          { path: 'orders', element: <OrderPage /> },
          { path: 'returns', element: <ReturnProcessor /> },
          { path: 'coupons', element: <CouponOffers /> },
          { path: 'settings', element: <AdminSettings /> },
          { path: 'customers', element: <CustomerManagementPage /> },
        ],
      },
      // Catch-all Redirect to Home
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);
