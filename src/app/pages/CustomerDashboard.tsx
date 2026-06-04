import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Package, MapPin, Heart, Bell, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  const sidebarItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Mock data
  const orders = [
    {
      id: '1',
      orderNumber: '#ORD-1234',
      date: '2026-05-25',
      status: 'Delivered',
      total: 1539.15,
      items: 2,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      orderNumber: '#ORD-1233',
      date: '2026-05-28',
      status: 'Shipped',
      total: 324.25,
      items: 3,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      orderNumber: '#ORD-1232',
      date: '2026-05-30',
      status: 'Processing',
      total: 665,
      items: 1,
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=100&h=100&fit=crop'
    }
  ];

  const addresses = [
    {
      id: '1',
      type: 'Home',
      name: 'Raj Patel',
      address: '123, Green Park Apartments, Near Metro Station, Mumbai - 400001',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: '2',
      type: 'Work',
      name: 'Raj Patel',
      address: 'Tech Hub, 4th Floor, BKC, Mumbai - 400051',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ];

  const wishlistItems = [
    {
      id: '1',
      name: 'Organic Quinoa',
      brand: 'Organic India',
      price: 280,
      originalPrice: 320,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop',
      inStock: true
    },
    {
      id: '2',
      name: 'Almond Milk',
      brand: 'Raw Pressery',
      price: 220,
      originalPrice: 250,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&h=150&fit=crop',
      inStock: true
    }
  ];

  const notifications = [
    {
      id: '1',
      title: 'Order Delivered',
      message: 'Your order #ORD-1234 has been delivered successfully',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      title: 'Flash Sale',
      message: 'Up to 50% off on grocery items. Limited time offer!',
      time: '1 day ago',
      unread: true
    },
    {
      id: '3',
      title: 'Order Shipped',
      message: 'Your order #ORD-1233 is out for delivery',
      time: '2 days ago',
      unread: false
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Delivered': 'text-success bg-success/10',
      'Shipped': 'text-info bg-info/10',
      'Processing': 'text-warning bg-warning/10',
      'Cancelled': 'text-danger bg-danger/10'
    };
    return colors[status] || 'text-muted-foreground bg-muted';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={3}
        wishlistCount={wishlistItems.length}
        isLoggedIn={true}
        userName="Raj"
      />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-4">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    R
                  </div>
                  <div>
                    <p className="font-semibold">Raj Patel</p>
                    <p className="text-sm text-muted-foreground">raj.patel@email.com</p>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-danger/10 text-danger">
                    <LogOut className="w-5 h-5" />
                    <span className="flex-1 text-left">Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Ordered on {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.image}
                              alt="Order"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm text-muted-foreground">{order.items} items</p>
                              <p className="font-bold">₹{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">
                              View Details
                            </button>
                            {order.status === 'Delivered' && (
                              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">My Addresses</h2>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      + Add New Address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{address.type}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="font-semibold mb-1">{address.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{address.address}</p>
                        <p className="text-sm text-muted-foreground mb-4">{address.phone}</p>
                        <div className="flex gap-2">
                          <button className="text-sm text-primary hover:underline">Edit</button>
                          <button className="text-sm text-danger hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">My Wishlist ({wishlistItems.length} items)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                            <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-bold">₹{item.price}</span>
                              <span className="text-sm line-through text-muted-foreground">
                                ₹{item.originalPrice}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm hover:bg-primary/90">
                                Add to Cart
                              </button>
                              <button className="p-2 border border-border rounded-lg hover:bg-muted">
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`bg-card border border-border rounded-lg p-4 ${
                          notif.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{notif.title}</h3>
                              {notif.unread && (
                                <span className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{notif.message}</p>
                            <p className="text-xs text-muted-foreground">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">My Profile</h2>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            defaultValue="Raj Patel"
                            className="w-full px-4 py-2 border border-border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue="raj.patel@email.com"
                            className="w-full px-4 py-2 border border-border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <input
                            type="tel"
                            defaultValue="+91 98765 43210"
                            className="w-full px-4 py-2 border border-border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Date of Birth</label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border border-border rounded-lg"
                          />
                        </div>
                      </div>
                      <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
