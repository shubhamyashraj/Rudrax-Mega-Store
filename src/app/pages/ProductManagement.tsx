import { AdminSidebar } from '../components/organisms/AdminSidebar';
import { Search, Filter, Plus, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  variants: number;
  stock: number;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  createdAt: string;
}

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock products
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Basmati Rice',
      category: 'Grocery',
      brand: 'India Gate',
      variants: 4,
      stock: 245,
      price: 599,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop',
      createdAt: '2026-01-15'
    },
    {
      id: '2',
      name: 'Fresh Milk',
      category: 'Dairy',
      brand: 'Amul',
      variants: 3,
      stock: 35,
      price: 65,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop',
      createdAt: '2026-02-20'
    },
    {
      id: '3',
      name: 'Whole Wheat Bread',
      category: 'Bakery',
      brand: 'Britannia',
      variants: 2,
      stock: 0,
      price: 45,
      status: 'inactive',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop',
      createdAt: '2026-03-10'
    },
    {
      id: '4',
      name: 'Extra Virgin Olive Oil',
      category: 'Grocery',
      brand: 'Figaro',
      variants: 2,
      stock: 42,
      price: 425,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&h=100&fit=crop',
      createdAt: '2026-04-05'
    },
    {
      id: '5',
      name: 'Organic Quinoa',
      category: 'Grocery',
      brand: 'Organic India',
      variants: 2,
      stock: 25,
      price: 280,
      status: 'draft',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop',
      createdAt: '2026-05-12'
    }
  ];

  const categories = ['All', 'Grocery', 'Dairy', 'Bakery', 'Personal Care', 'Household'];
  const statuses = ['All', 'Active', 'Inactive', 'Draft'];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'text-success bg-success/10',
      'inactive': 'text-muted-foreground bg-muted',
      'draft': 'text-warning bg-warning/10'
    };
    return colors[status] || 'text-muted-foreground bg-muted';
  };

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar activeItem="products" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Product Management</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-1">Total Products</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="bg-card border border-success rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-1">Active Products</p>
              <p className="text-3xl font-bold text-success">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-card border border-warning rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-warning">
                {products.filter(p => p.stock < 50).length}
              </p>
            </div>
            <div className="bg-card border border-danger rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-danger">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products by name, brand, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg"
              >
                {statuses.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>

              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">Product</th>
                    <th className="text-left py-4 px-4 font-semibold">Category</th>
                    <th className="text-left py-4 px-4 font-semibold">Brand</th>
                    <th className="text-right py-4 px-4 font-semibold">Variants</th>
                    <th className="text-right py-4 px-4 font-semibold">Stock</th>
                    <th className="text-right py-4 px-4 font-semibold">Price</th>
                    <th className="text-center py-4 px-4 font-semibold">Status</th>
                    <th className="text-right py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{product.category}</td>
                      <td className="py-4 px-4">{product.brand}</td>
                      <td className="py-4 px-4 text-right">{product.variants}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-bold ${
                          product.stock === 0 ? 'text-danger' :
                          product.stock < 50 ? 'text-warning' :
                          'text-success'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">₹{product.price}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 hover:bg-muted rounded-lg"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-danger/10 text-danger rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {products.length} products
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  2
                </button>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
