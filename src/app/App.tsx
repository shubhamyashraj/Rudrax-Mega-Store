import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { InventoryManagement } from './pages/InventoryManagement';
import { OrderManagement } from './pages/OrderManagement';
import { ProductManagement } from './pages/ProductManagement';

export default function App() {
  // Simple route state management
  const [currentPage, setCurrentPage] = useState('home');

  // Render different pages based on currentPage state
  // In a real app, you'd use react-router, but this demonstrates all pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductListingPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'login':
        return <LoginPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-products':
        return <ProductManagement />;
      case 'admin-inventory':
        return <InventoryManagement />;
      case 'admin-orders':
        return <OrderManagement />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Helper for demonstration */}
      <div className="fixed bottom-4 right-4 z-50 bg-card border-2 border-primary rounded-lg p-4 shadow-xl max-h-96 overflow-y-auto">
        <h3 className="font-bold text-sm mb-3 text-primary">🛍️ Rudrax Demo</h3>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground mb-1">CUSTOMER PAGES</p>
          <button onClick={() => setCurrentPage('home')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">🏠 Home</button>
          <button onClick={() => setCurrentPage('products')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">📦 Products</button>
          <button onClick={() => setCurrentPage('product-details')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">🔍 Product Details</button>
          <button onClick={() => setCurrentPage('cart')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">🛒 Cart</button>
          <button onClick={() => setCurrentPage('checkout')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">💳 Checkout</button>
          <button onClick={() => setCurrentPage('customer-dashboard')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">👤 My Account</button>
          <button onClick={() => setCurrentPage('login')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">🔐 Login</button>

          <div className="border-t border-border my-2" />

          <p className="text-xs font-semibold text-muted-foreground mb-1">ADMIN PANEL</p>
          <button onClick={() => setCurrentPage('admin-dashboard')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded font-semibold">📊 Dashboard</button>
          <button onClick={() => setCurrentPage('admin-products')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">📦 Products</button>
          <button onClick={() => setCurrentPage('admin-inventory')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">📋 Inventory</button>
          <button onClick={() => setCurrentPage('admin-orders')} className="text-xs text-left hover:text-primary px-2 py-1 hover:bg-muted rounded">🚚 Orders</button>
        </div>
      </div>

      {renderPage()}
    </div>
  );
}