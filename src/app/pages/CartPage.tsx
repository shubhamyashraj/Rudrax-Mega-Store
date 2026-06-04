import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { CartItem, CartItemType } from '../components/molecules/CartItem';
import { CheckoutSummary } from '../components/organisms/CheckoutSummary';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      id: '1',
      productId: '1',
      name: 'Premium Basmati Rice',
      brand: 'India Gate',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      price: 599,
      originalPrice: 699,
      quantity: 2,
      variant: '5 kg',
      stock: 50
    },
    {
      id: '2',
      productId: '2',
      name: 'Fresh Milk',
      brand: 'Amul',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      price: 65,
      originalPrice: 70,
      quantity: 1,
      variant: '1 Liter',
      stock: 100
    },
    {
      id: '3',
      productId: '3',
      name: 'Whole Wheat Bread',
      brand: 'Britannia',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
      price: 45,
      originalPrice: 50,
      quantity: 3,
      variant: '400g',
      stock: 80
    }
  ]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleMoveToWishlist = (id: string) => {
    console.log('Move to wishlist:', id);
    handleRemove(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const tax = subtotal * 0.05; // 5% tax

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartItems.length}
        wishlistCount={5}
        onCartClick={() => console.log('Cart')}
        onWishlistClick={() => console.log('Wishlist')}
        onProfileClick={() => console.log('Profile')}
      />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="bg-card rounded-lg p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add items to your cart to get started
              </p>
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90">
                Start Shopping
              </button>
            </div>
          ) : (
            // Cart with Items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <CheckoutSummary
                  subtotal={subtotal}
                  discount={discount}
                  deliveryCharge={deliveryCharge}
                  tax={tax}
                  onApplyCoupon={(code) => console.log('Apply coupon:', code)}
                  onCheckout={() => console.log('Proceed to checkout')}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
