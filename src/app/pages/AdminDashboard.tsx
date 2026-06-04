import { AdminSidebar } from '../components/organisms/AdminSidebar';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  AlertCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 45000, orders: 120 },
    { month: 'Feb', sales: 52000, orders: 145 },
    { month: 'Mar', sales: 48000, orders: 130 },
    { month: 'Apr', sales: 61000, orders: 170 },
    { month: 'May', sales: 58000, orders: 160 },
    { month: 'Jun', sales: 67000, orders: 185 }
  ];

  const categoryData = [
    { name: 'Grocery', value: 45, color: '#ff6b35' },
    { name: 'Dairy', value: 25, color: '#10b981' },
    { name: 'Personal Care', value: 15, color: '#3b82f6' },
    { name: 'Household', value: 15, color: '#f59e0b' }
  ];

  const topProducts = [
    { id: '1', name: 'Premium Basmati Rice 5kg', sold: 450, revenue: 269550 },
    { id: '2', name: 'Fresh Milk 1L', sold: 890, revenue: 57850 },
    { id: '3', name: 'Whole Wheat Bread', sold: 670, revenue: 30150 },
    { id: '4', name: 'Olive Oil 500ml', sold: 320, revenue: 136000 },
    { id: '5', name: 'Toor Dal 1kg', sold: 540, revenue: 75600 }
  ];

  const recentOrders = [
    { id: '#ORD-1234', customer: 'Priya Sharma', amount: 1250, status: 'Delivered', date: '1 hour ago' },
    { id: '#ORD-1233', customer: 'Raj Kumar', amount: 890, status: 'Shipped', date: '2 hours ago' },
    { id: '#ORD-1232', customer: 'Anita Desai', amount: 2340, status: 'Processing', date: '3 hours ago' },
    { id: '#ORD-1231', customer: 'Vikram Singh', amount: 670, status: 'Pending', date: '4 hours ago' },
    { id: '#ORD-1230', customer: 'Meera Patel', amount: 1890, status: 'Delivered', date: '5 hours ago' }
  ];

  const alerts = [
    { id: '1', type: 'low-stock', message: '15 products are low in stock', severity: 'warning' },
    { id: '2', type: 'expiry', message: '8 products expiring in 7 days', severity: 'danger' },
    { id: '3', type: 'order', message: '23 orders pending confirmation', severity: 'info' }
  ];

  const kpis = [
    {
      title: 'Total Revenue',
      value: '₹3,67,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Total Orders',
      value: '1,285',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-primary'
    },
    {
      title: 'Total Products',
      value: '4,567',
      change: '+3.1%',
      trend: 'up',
      icon: Package,
      color: 'text-info'
    },
    {
      title: 'Total Customers',
      value: '8,942',
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'text-warning'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Delivered': 'text-success bg-success/10',
      'Shipped': 'text-info bg-info/10',
      'Processing': 'text-warning bg-warning/10',
      'Pending': 'text-muted-foreground bg-muted'
    };
    return colors[status] || 'text-muted-foreground bg-muted';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'warning': 'border-warning bg-warning/10',
      'danger': 'border-danger bg-danger/10',
      'info': 'border-info bg-info/10'
    };
    return colors[severity] || 'border-border bg-muted';
  };

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar activeItem="dashboard" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: Just now</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {kpis.map((kpi) => (
              <div key={kpi.title} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-muted ${kpi.color}`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    kpi.trend === 'up' ? 'text-success' : 'text-danger'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {kpi.change}
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Alerts & Notifications
              </h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                  >
                    <p className="font-medium">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Sales Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#ff6b35" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Monthly Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Top Selling Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-semibold">Product</th>
                      <th className="text-right py-3 text-sm font-semibold">Sold</th>
                      <th className="text-right py-3 text-sm font-semibold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="py-3 text-sm">{product.name}</td>
                        <td className="py-3 text-sm text-right">{product.sold}</td>
                        <td className="py-3 text-sm text-right font-semibold">
                          ₹{product.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right mx-4">
                      <p className="font-semibold text-sm">₹{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
