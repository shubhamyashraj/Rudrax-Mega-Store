import { useRudrax } from '../../app/StateContext';
import { DollarSign, Inbox, ShieldAlert, TrendingUp, AlertTriangle, CalendarRange } from 'lucide-react';

export function DashboardPage() {
  const { orders, batches, products, returns } = useRudrax();

  // Calculations
  const totalRevenue = orders
    .filter(o => o.status !== 'Returned')
    .reduce((sum, o) => sum + o.total, 0);

  const inventoryValue = batches.reduce((sum, b) => sum + (b.quantity * b.purchasePrice), 0);
  const potentialEarningsValue = batches.reduce((sum, b) => sum + (b.quantity * b.sellingPrice), 0);

  const lowStockProductsList = batches.filter(b => b.quantity <= 5 && b.quantity > 0);
  const nearExpiryList = batches.filter(b => {
    const daysLeft = (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return daysLeft > 0 && daysLeft <= 15;
  });

  // Calculate Product sales performance for fast-moving items
  const productSalesMap: Record<string, { quantity: number; revenue: number }> = {};
  orders.forEach(o => {
    if (o.status !== 'Returned') {
      o.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { quantity: 0, revenue: 0 };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.quantity * item.purchasePrice;
      });
    }
  });

  const productPerformance = Object.entries(productSalesMap).map(([pId, stats]) => {
    const prDetails = products.find(p => p.id === pId);
    return {
      id: pId,
      name: prDetails?.name || 'Unknown Essential',
      brand: prDetails?.brand || 'Local',
      quantitySold: stats.quantity,
      revenueGenerated: stats.revenue
    };
  }).sort((a, b) => b.quantitySold - a.quantitySold);

  const kpiCards = [
    { label: 'Total Sales Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+18.5% this month', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Inventory Cost Value', value: `₹${inventoryValue.toLocaleString()}`, change: `Expected Ret: ₹${potentialEarningsValue.toLocaleString()}`, icon: DollarSign, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Active Orders Queue', value: orders.filter(o => o.status === 'Pending').length, change: `${orders.length} orders total`, icon: Inbox, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Claims (Returns)', value: returns.filter(r => r.status === 'Pending').length, change: `${returns.length} requests total`, icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-100' }
  ];

  return (
    <div className="dashboard-stats flex flex-col gap-6 p-4">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Dashboard Analytics</h1>
        <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">Real-Time Business Pulse Indicators</p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const CardIcon = card.icon;
          return (
            <div key={index} className={`bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow ${card.color}`}>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">{card.label}</span>
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight leading-none">{card.value}</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-1.5">{card.change}</span>
              </div>
              <div className="p-3 bg-white/60 border border-slate-100 rounded-xl">
                <CardIcon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Low stock and expiring soon banners row */}
      {(lowStockProductsList.length > 0 || nearExpiryList.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Stock Alerts */}
          {lowStockProductsList.length > 0 && (
            <div className="bg-orange-50 border border-orange-200/65 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
              <AlertTriangle className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <span className="text-xs font-black text-orange-955 uppercase tracking-wide leading-none">Pantry Low Stock Warnings ({lowStockProductsList.length})</span>
                <div className="flex flex-col gap-1.5 mt-2 text-[11px] text-orange-850 font-semibold font-mono">
                  {lowStockProductsList.slice(0, 3).map((item, idx) => {
                    const pr = products.find(p => p.id === item.productId);
                    const vr = pr?.variants.find(v => v.id === item.variantId);
                    return (
                      <div key={idx} className="flex justify-between items-center bg-white/70 p-1.5 rounded-lg border border-orange-100">
                        <span>{pr?.name} ({vr?.name})</span>
                        <span className="bg-orange-100 px-1.5 py-0.5 rounded text-orange-755 text-[10px]">Only {item.quantity} units left!</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Near Expiry Alerts */}
          {nearExpiryList.length > 0 && (
            <div className="bg-red-50 border border-red-200/65 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
              <CalendarRange className="text-red-600 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <span className="text-xs font-black text-red-955 uppercase tracking-wide leading-none font-mono">Freshness Expiry Alerts ({nearExpiryList.length})</span>
                <div className="flex flex-col gap-1.5 mt-2 text-[11px] text-red-850 font-semibold font-mono">
                  {nearExpiryList.slice(0, 3).map((item, idx) => {
                    const pr = products.find(p => p.id === item.productId);
                    const vr = pr?.variants.find(v => v.id === item.variantId);
                    const daysLeft = Math.round((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    return (
                      <div key={idx} className="flex justify-between items-center bg-white/70 p-1.5 rounded-lg border border-red-100">
                        <span>{pr?.name} ({vr?.name})</span>
                        <span className="bg-red-100 px-1.5 py-0.5 rounded text-red-755 text-[10px]">Expiring in {daysLeft} Days</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main product Performance analytics table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast-Moving lists */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            🔥 Top Performing Essentials (Best Sellers)
            <span className="bg-teal-50 text-teal-700 font-bold text-[10px] px-2 py-0.5 rounded border border-teal-100 font-mono">SALES RANKS</span>
          </h3>
          
          {productPerformance.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              Waiting for customer checkout operations to record sales...
            </div>
          ) : (
            <div className="overflow-x-auto font-sans">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Essential Product</th>
                    <th className="py-3 px-2">Brand</th>
                    <th className="py-3 px-2 text-center">Packs Sold</th>
                    <th className="py-3 px-2 text-right">Revenue generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-mono">
                  {productPerformance.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2 font-sans font-semibold text-slate-900">{p.name}</td>
                      <td className="py-3 px-2 font-sans">{p.brand}</td>
                      <td className="py-3 px-2 text-center font-bold text-teal-600">{p.quantitySold}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900">₹{p.revenueGenerated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Slow-Moving Warehouse stocks warnings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            🐌 Slow-Moving Storage Batches
          </h3>
          
          <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-500">
            {batches.slice(0, 4).map((b, idx) => {
              const pr = products.find(p => p.id === b.productId);
              const vr = pr?.variants.find(v => v.id === b.variantId);
              return (
                <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <span className="font-sans font-semibold text-slate-800 block leading-tight">{pr?.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{vr?.name} | Batch: {b.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{b.quantity} remaining</span>
                    <span className="text-[9px] text-slate-400 font-bold">Cost: ₹{b.purchasePrice * b.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export { DashboardPage as default };
export { DashboardPage as DashboardStats };
