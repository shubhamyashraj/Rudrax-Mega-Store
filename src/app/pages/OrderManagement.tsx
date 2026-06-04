import { AdminSidebar } from '../components/organisms/AdminSidebar';
import { Search, Filter, Download, Eye, Printer, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
  productName: string;
  variant: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  deliveryAddress: string;
  trackingNumber?: string;
}

export function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '#ORD-1234',
      customer: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43210'
      },
      items: [
        { productName: 'Premium Basmati Rice', variant: '5kg', quantity: 2, price: 599 },
        { productName: 'Olive Oil', variant: '500ml', quantity: 1, price: 425 }
      ],
      subtotal: 1623,
      discount: 165,
      tax: 81.15,
      deliveryCharge: 0,
      total: 1539.15,
      status: 'delivered',
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      orderDate: '2026-05-25',
      deliveryAddress: '123, Green Park Apartments, Mumbai - 400001',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '2',
      orderNumber: '#ORD-1233',
      customer: {
        name: 'Raj Kumar',
        email: 'raj.kumar@email.com',
        phone: '+91 98765 43211'
      },
      items: [
        { productName: 'Fresh Milk', variant: '1L', quantity: 3, price: 65 },
        { productName: 'Whole Wheat Bread', variant: '400g', quantity: 2, price: 45 }
      ],
      subtotal: 285,
      discount: 15,
      tax: 14.25,
      deliveryCharge: 40,
      total: 324.25,
      status: 'shipped',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      orderDate: '2026-05-28',
      deliveryAddress: '456, Palm Heights, Delhi - 110001',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '3',
      orderNumber: '#ORD-1232',
      customer: {
        name: 'Anita Desai',
        email: 'anita.desai@email.com',
        phone: '+91 98765 43212'
      },
      items: [
        { productName: 'Toor Dal', variant: '1kg', quantity: 5, price: 140 }
      ],
      subtotal: 700,
      discount: 70,
      tax: 35,
      deliveryCharge: 0,
      total: 665,
      status: 'packed',
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderDate: '2026-05-30',
      deliveryAddress: '789, Rose Garden, Bangalore - 560001'
    },
    {
      id: '4',
      orderNumber: '#ORD-1231',
      customer: {
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+91 98765 43213'
      },
      items: [
        { productName: 'Cashew Nuts', variant: '500g', quantity: 2, price: 450 }
      ],
      subtotal: 900,
      discount: 0,
      tax: 45,
      deliveryCharge: 0,
      total: 945,
      status: 'pending',
      paymentMethod: 'Net Banking',
      paymentStatus: 'pending',
      orderDate: '2026-05-31',
      deliveryAddress: '321, Sunset Villa, Pune - 411001'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'packed', label: 'Packed', count: orders.filter(o => o.status === 'packed').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
    { value: 'returned', label: 'Returned', count: orders.filter(o => o.status === 'returned').length }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'text-warning bg-warning/10',
      'confirmed': 'text-info bg-info/10',
      'packed': 'text-primary bg-primary/10',
      'shipped': 'text-primary bg-primary/10',
      'delivered': 'text-success bg-success/10',
      'cancelled': 'text-danger bg-danger/10',
      'returned': 'text-warning bg-warning/10'
    };
    return colors[status] || 'text-muted-foreground bg-muted';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'paid': 'text-success',
      'pending': 'text-warning',
      'failed': 'text-danger',
      'refunded': 'text-info'
    };
    return colors[status] || 'text-muted-foreground';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar activeItem="orders" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="text-muted-foreground">Manage and track all customer orders</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
              <Download className="w-4 h-4" />
              Export Orders
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status Tabs */}
          <div className="bg-card border border-border rounded-lg p-2 mb-6 overflow-x-auto">
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {option.label}
                  <span className={`ml-2 ${selectedStatus === option.value ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    ({option.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">Order</th>
                    <th className="text-left py-4 px-4 font-semibold">Customer</th>
                    <th className="text-left py-4 px-4 font-semibold">Date</th>
                    <th className="text-right py-4 px-4 font-semibold">Total</th>
                    <th className="text-center py-4 px-4 font-semibold">Payment</th>
                    <th className="text-center py-4 px-4 font-semibold">Status</th>
                    <th className="text-right py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-muted/30"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">{formatDate(order.orderDate)}</td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-bold">₹{order.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-muted rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.orderNumber}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">{item.variant} × {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div>
                <h3 className="font-semibold mb-3">Price Summary</h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['confirmed', 'packed', 'shipped', 'delivered'].map((status) => (
                    <button
                      key={status}
                      className={`px-4 py-2 rounded-lg font-medium capitalize ${
                        selectedOrder.status === status
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
