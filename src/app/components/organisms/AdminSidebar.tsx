import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Percent,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Box
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
}

interface AdminSidebarProps {
  activeItem?: string;
  onNavigate?: (path: string) => void;
  isCollapsed?: boolean;
}

export function AdminSidebar({
  activeItem = 'dashboard',
  onNavigate,
  isCollapsed = false
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['products']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: <Package className="w-5 h-5" />,
      path: '/admin/products',
      children: [
        { id: 'all-products', label: 'All Products', icon: null, path: '/admin/products' },
        { id: 'add-product', label: 'Add Product', icon: null, path: '/admin/products/add' },
        { id: 'categories', label: 'Categories', icon: null, path: '/admin/categories' },
        { id: 'variants', label: 'Variants', icon: null, path: '/admin/variants' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Box className="w-5 h-5" />,
      path: '/admin/inventory'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      path: '/admin/orders'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/customers'
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: <Tag className="w-5 h-5" />,
      path: '/admin/offers'
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: <Percent className="w-5 h-5" />,
      path: '/admin/coupons'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/admin/reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      onNavigate?.(item.path);
    }
  };

  const isActive = (itemId: string) => activeItem === itemId;
  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  return (
    <aside className={`bg-sidebar border-r border-sidebar-border h-full flex flex-col transition-all ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className={`font-bold text-xl text-primary ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'R' : 'Rudrax'}
        </h2>
        {!isCollapsed && (
          <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Panel</p>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Main Item */}
            <button
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.id)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.children && (
                    isExpanded(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </>
              )}
            </button>

            {/* Children */}
            {!isCollapsed && item.children && isExpanded(item.id) && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onNavigate?.(child.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(child.id)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                    }`}
                  >
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="flex-1 text-left">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/60">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2026 Rudrax</p>
          </div>
        )}
      </div>
    </aside>
  );
}
