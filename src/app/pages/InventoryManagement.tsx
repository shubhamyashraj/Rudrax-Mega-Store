import { AdminSidebar } from '../components/organisms/AdminSidebar';
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Calendar,
  Package,
  TrendingDown,
  Download,
  Upload
} from 'lucide-react';
import { useState } from 'react';

interface Batch {
  batchId: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  supplier: string;
  isActive: boolean;
}

interface InventoryItem {
  id: string;
  productName: string;
  variant: string;
  category: string;
  totalStock: number;
  batches: Batch[];
  lowStockThreshold: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'near-expiry';
}

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Mock inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      productName: 'Premium Basmati Rice',
      variant: '5kg',
      category: 'Grocery',
      totalStock: 245,
      lowStockThreshold: 50,
      status: 'in-stock',
      batches: [
        {
          batchId: 'BATCH-001',
          purchasePrice: 450,
          sellingPrice: 599,
          quantity: 100,
          manufacturingDate: '2026-03-01',
          expiryDate: '2027-03-01',
          supplier: 'India Gate Distributors',
          isActive: true
        },
        {
          batchId: 'BATCH-002',
          purchasePrice: 460,
          sellingPrice: 599,
          quantity: 85,
          manufacturingDate: '2026-04-15',
          expiryDate: '2027-04-15',
          supplier: 'India Gate Distributors',
          isActive: true
        },
        {
          batchId: 'BATCH-003',
          purchasePrice: 470,
          sellingPrice: 599,
          quantity: 60,
          manufacturingDate: '2026-05-20',
          expiryDate: '2027-05-20',
          supplier: 'India Gate Distributors',
          isActive: false
        }
      ]
    },
    {
      id: '2',
      productName: 'Fresh Milk',
      variant: '1L',
      category: 'Dairy',
      totalStock: 35,
      lowStockThreshold: 50,
      status: 'low-stock',
      batches: [
        {
          batchId: 'BATCH-101',
          purchasePrice: 50,
          sellingPrice: 65,
          quantity: 35,
          manufacturingDate: '2026-05-28',
          expiryDate: '2026-06-05',
          supplier: 'Amul Dairy',
          isActive: true
        }
      ]
    },
    {
      id: '3',
      productName: 'Whole Wheat Bread',
      variant: '400g',
      category: 'Bakery',
      totalStock: 0,
      lowStockThreshold: 30,
      status: 'out-of-stock',
      batches: []
    },
    {
      id: '4',
      productName: 'Olive Oil',
      variant: '500ml',
      category: 'Grocery',
      totalStock: 42,
      lowStockThreshold: 20,
      status: 'near-expiry',
      batches: [
        {
          batchId: 'BATCH-201',
          purchasePrice: 320,
          sellingPrice: 425,
          quantity: 42,
          manufacturingDate: '2025-06-01',
          expiryDate: '2026-06-10',
          supplier: 'Figaro Imports',
          isActive: true
        }
      ]
    }
  ];

  // Summary statistics
  const summary = {
    totalValue: inventoryItems.reduce((sum, item) =>
      sum + item.batches.reduce((bSum, batch) =>
        bSum + (batch.purchasePrice * batch.quantity), 0
      ), 0
    ),
    lowStockItems: inventoryItems.filter(i => i.status === 'low-stock').length,
    outOfStockItems: inventoryItems.filter(i => i.status === 'out-of-stock').length,
    nearExpiryItems: inventoryItems.filter(i => i.status === 'near-expiry').length
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'in-stock': 'text-success bg-success/10',
      'low-stock': 'text-warning bg-warning/10',
      'out-of-stock': 'text-danger bg-danger/10',
      'near-expiry': 'text-warning bg-warning/10'
    };
    return colors[status] || 'text-muted-foreground bg-muted';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
      'near-expiry': 'Near Expiry'
    };
    return labels[status] || status;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar activeItem="inventory" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">Batch-based FIFO inventory tracking</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Add Batch
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">Total Inventory Value</h3>
              <p className="text-2xl font-bold">₹{summary.totalValue.toLocaleString()}</p>
            </div>

            <div className="bg-card border border-warning rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="w-8 h-8 text-warning" />
                <span className="text-warning font-bold">{summary.lowStockItems}</span>
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">Low Stock Products</h3>
              <p className="text-sm text-warning font-medium">Requires attention</p>
            </div>

            <div className="bg-card border border-danger rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-danger" />
                <span className="text-danger font-bold">{summary.outOfStockItems}</span>
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">Out of Stock</h3>
              <p className="text-sm text-danger font-medium">Immediate action needed</p>
            </div>

            <div className="bg-card border border-warning rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-warning" />
                <span className="text-warning font-bold">{summary.nearExpiryItems}</span>
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">Near Expiry</h3>
              <p className="text-sm text-warning font-medium">Expiring soon</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by product name, batch ID, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="near-expiry">Near Expiry</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">Product</th>
                    <th className="text-left py-4 px-4 font-semibold">Category</th>
                    <th className="text-right py-4 px-4 font-semibold">Total Stock</th>
                    <th className="text-right py-4 px-4 font-semibold">Active Batches</th>
                    <th className="text-center py-4 px-4 font-semibold">Status</th>
                    <th className="text-right py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <>
                      <tr
                        key={item.id}
                        className="border-b border-border hover:bg-muted/30 cursor-pointer"
                        onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">{item.category}</td>
                        <td className="py-4 px-4 text-right">
                          <span className={`font-bold ${
                            item.totalStock === 0 ? 'text-danger' :
                            item.totalStock <= item.lowStockThreshold ? 'text-warning' :
                            'text-success'
                          }`}>
                            {item.totalStock}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {item.batches.filter(b => b.isActive).length}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-primary hover:underline text-sm font-medium">
                            Manage
                          </button>
                        </td>
                      </tr>

                      {/* Batch Details (Expandable) */}
                      {selectedItem === item.id && item.batches.length > 0 && (
                        <tr>
                          <td colSpan={6} className="bg-muted/20 p-4">
                            <h4 className="font-semibold mb-3">Batch Details (FIFO Order)</h4>
                            <div className="space-y-2">
                              {item.batches.map((batch, index) => {
                                const daysUntilExpiry = getDaysUntilExpiry(batch.expiryDate);
                                const isNearExpiry = daysUntilExpiry <= 30;

                                return (
                                  <div
                                    key={batch.batchId}
                                    className={`border rounded-lg p-4 ${
                                      batch.isActive ? 'border-success bg-success/5' : 'border-border'
                                    }`}
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Batch ID</p>
                                        <p className="font-semibold text-sm flex items-center gap-2">
                                          {batch.batchId}
                                          {batch.isActive && (
                                            <span className="text-xs bg-success text-success-foreground px-2 py-0.5 rounded">
                                              Active
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                                        <p className="font-semibold text-sm">{batch.quantity} units</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Purchase Price</p>
                                        <p className="font-semibold text-sm">₹{batch.purchasePrice}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                                        <p className="font-semibold text-sm">₹{batch.sellingPrice}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">MFG Date</p>
                                        <p className="text-sm">{formatDate(batch.manufacturingDate)}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                                        <p className={`text-sm font-semibold ${isNearExpiry ? 'text-warning' : ''}`}>
                                          {formatDate(batch.expiryDate)}
                                          {isNearExpiry && (
                                            <span className="block text-xs">({daysUntilExpiry} days left)</span>
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                                        <p className="text-sm">{batch.supplier}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
