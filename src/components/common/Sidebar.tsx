import { useRudrax } from '../../app/StateContext';
import { LayoutDashboard, Box, Award, Receipt, Percent, Settings, Database } from 'lucide-react';

export function Sidebar() {
  const { activeAdminTab, setActiveAdminTab, orders, returns, batches } = useRudrax();

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const pendingReturns = returns.filter(r => r.status === 'Pending').length;
  
  const lowStockBatches = batches.filter(b => b.quantity <= 5 && b.quantity > 0).length;
  const expiredBatches = batches.filter(b => new Date(b.expiryDate).getTime() < new Date().getTime()).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Stats', icon: LayoutDashboard },
    { id: 'products', label: 'Products Master', icon: Box },
    { id: 'inventory', label: 'FIFO Inventory', icon: Database, badge: lowStockBatches + expiredBatches, badgeColor: 'bg-rose-600' },
    { id: 'orders', label: 'Customer Orders', icon: Receipt, badge: pendingOrders, badgeColor: 'bg-teal-600' },
    { id: 'returns', label: 'Returned Logs', icon: Award, badge: pendingReturns, badgeColor: 'bg-amber-500 text-slate-950' },
    { id: 'coupons', label: 'Offers & Coupons', icon: Percent },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <aside className="admin-sidebar bg-slate-900 text-slate-300 w-full md:w-64 min-h-screen p-5 flex flex-col justify-between border-r border-slate-800 flex-shrink-0 select-none">
      <div className="flex flex-col gap-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="h-9 w-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <span>R</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white tracking-wide leading-none">RUDRAX STORE</span>
            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider mt-1">Backoffice Panels</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComp size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`h-4 min-w-[16px] px-1 text-[9px] font-black rounded-full flex items-center justify-center text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Operator identity */}
      <div className="pt-5 border-t border-slate-800">
        <div className="flex items-center gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[9px]">
            OP
          </div>
          <div className="flex flex-col text-[10px]">
            <span className="font-bold text-slate-300">Shubham Operator</span>
            <span className="text-emerald-500 font-semibold font-mono leading-none flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
export { Sidebar as AdminSidebar }; // Export as AdminSidebar too to preserve any current naming conventions.
