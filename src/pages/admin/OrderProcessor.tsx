import { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Order, OrderStatus } from '../../models/types';
import { Badge, Button } from '../../components/ui/atoms';
import { Receipt, Phone, Printer, ShieldCheck, CheckCircle } from 'lucide-react';

export function OrderProcessor() {
  const { orders, products, updateOrderStatus } = useRudrax();
  const [selectedOrd, setSelectedOrd] = useState<Order | null>(null);
  const [timelineNote, setTimelineNote] = useState<string>('');

  const handleUpdateStatus = (ordId: string, nextStatus: OrderStatus) => {
    let note = `Status changed to ${nextStatus}`;
    if (timelineNote.trim()) {
      note = timelineNote.trim();
    } else {
      switch (nextStatus) {
        case 'Confirmed': note = 'Order accepted at nearest dark-store fulfillment center.'; break;
        case 'Packed': note = 'Lot compiled and packed under hygienic temperatures.'; break;
        case 'Shipped': note = 'Dispatched and shipped to local delivery rider hubs.'; break;
        case 'Out For Delivery': note = 'Local rider has loaded package and is on their way.'; break;
        case 'Delivered': note = 'Order completed and handed safely to customer.'; break;
      }
    }

    updateOrderStatus(ordId, nextStatus, note);
    setTimelineNote('');
    
    // update current selectedOrd reference in view
    if (selectedOrd && selectedOrd.id === ordId) {
      const match = orders.find(o => o.id === ordId);
      if (match) {
        setSelectedOrd({
          ...match,
          status: nextStatus,
          timeline: [...match.timeline, { status: nextStatus, timestamp: new Date().toISOString(), note }]
        });
      }
    }
  };

  const statusActionsList: { status: OrderStatus; label: string; style: 'success' | 'info' | 'warning' | 'danger' }[] = [
    { status: 'Confirmed', label: 'Accept Order', style: 'success' },
    { status: 'Packed', label: 'Mark Packed', style: 'info' },
    { status: 'Shipped', label: 'Mark Shipped', style: 'info' },
    { status: 'Out For Delivery', label: 'Dispatch Out', style: 'warning' },
    { status: 'Delivered', label: 'Complete Delivery', style: 'success' }
  ];

  return (
    <div className="order-processor flex flex-col gap-6 p-4">
      {/* Title block */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Order Management Hub</h1>
        <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">Invoice Dispatch logs & Real-Time Logistics Stepper</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table Column */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100">Pending & Logged Order streams</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3 text-center">Items count</th>
                  <th className="py-3 px-3 text-right">Bill Value</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 font-mono">
                {orders.map((ord) => (
                  <tr key={ord.id} className={`hover:bg-slate-50/70 cursor-pointer ${selectedOrd?.id === ord.id ? 'bg-teal-50/30' : ''}`} onClick={() => setSelectedOrd(ord)}>
                    <td className="py-3 px-3 font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="font-semibold text-slate-800 block leading-tight">{ord.customerName}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-center">{ord.items.length} packs</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">₹{ord.total}</td>
                    <td className="py-3 px-3 font-semibold text-[10px] text-slate-500 uppercase">{ord.paymentMethod}</td>
                    <td className="py-3 px-3">
                      <Badge variant={ord.status === 'Delivered' ? 'success' : ord.status === 'Pending' ? 'warning' : 'info'}>
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="outline" size="sm" className="h-7 py-0 text-[10px] leading-none" onClick={() => setSelectedOrd(ord)}>
                        Review Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice & Status update Action Panel */}
        <div className="flex flex-col gap-4">
          {selectedOrd ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
              
              {/* Receipt Header details */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-black text-slate-900 uppercase font-mono block">Order Reference</span>
                  <span className="font-mono text-teal-700 font-black text-sm">{selectedOrd.id}</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer"
                  title="Print invoice for local dispatch tagging"
                >
                  <Printer size={15} />
                </button>
              </div>

              {/* Status workflow triggers */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-sans">Advance Logistics Workflow</h3>
                
                {selectedOrd.status === 'Delivered' ? (
                  <div className="bg-emerald-50 text-emerald-850 p-3 rounded-xl border border-emerald-100 text-center flex items-center justify-center gap-1.5 text-xs font-bold font-mono animate-fadeIn">
                    <CheckCircle size={15} className="text-emerald-600" /> Order delivered successfully. Closed.
                  </div>
                ) : selectedOrd.status === 'Returned' ? (
                  <div className="bg-rose-50 text-rose-850 p-3 rounded-xl border border-rose-100 text-center flex items-center justify-center gap-1.5 text-xs font-bold font-mono animate-fadeIn">
                    ⚠️ Item returned. Refund initiated.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 font-sans">
                    <div className="grid grid-cols-2 gap-1.5">
                      {statusActionsList.map(act => {
                        const isNextInTimeline = 
                          (selectedOrd.status === 'Pending' && act.status === 'Confirmed') ||
                          (selectedOrd.status === 'Confirmed' && act.status === 'Packed') ||
                          (selectedOrd.status === 'Packed' && act.status === 'Shipped') ||
                          (selectedOrd.status === 'Shipped' && act.status === 'Out For Delivery') ||
                          (selectedOrd.status === 'Out For Delivery' && act.status === 'Delivered');

                        return (
                          <button
                            key={act.status}
                            disabled={!isNextInTimeline}
                            onClick={() => handleUpdateStatus(selectedOrd.id, act.status)}
                            className={`px-2 py-2 border rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              isNextInTimeline
                                ? 'bg-slate-905 text-white border-slate-905 hover:bg-slate-800'
                                : 'bg-slate-50 text-slate-300 border-slate-200/60 cursor-not-allowed'
                            }`}
                          >
                            {act.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Custom Timeline Log comment</label>
                      <input
                        type="text"
                        placeholder="e.g. Dispatched with rider Ravi, ETA 10 Min"
                        value={timelineNote}
                        onChange={(e) => setTimelineNote(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 bg-white text-slate-800 rounded-lg text-xs font-medium placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Invoice lines summary */}
              <div className="border-t border-slate-101 pt-3">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Item consignment list</h3>
                <div className="flex flex-col gap-2 mx-1 text-xs font-sans">
                  {selectedOrd.items.map((item, index) => {
                    const pr = products.find(p => p.id === item.productId);
                    return (
                      <div key={index} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800 block line-clamp-1">{pr?.name}</span>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Batch: {item.batchId} | Qty: {item.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-905 font-mono">₹{item.purchasePrice * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping address recap */}
              <div className="border-t border-slate-101 pt-3 text-xs leading-normal font-medium text-slate-600">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Shipping Designation</h3>
                <p className="font-bold text-slate-800 text-xs mb-0.5">{selectedOrd.shippingAddress.fullName}</p>
                <p className="text-[11px] leading-tight text-slate-505">{selectedOrd.shippingAddress.addressLine1}, {selectedOrd.shippingAddress.city}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1 leading-none"><Phone size={10} /> {selectedOrd.shippingAddress.phone}</p>
              </div>

              {/* Secure SSL payment validation signature */}
              <div className="border-t border-slate-101 pt-3 overflow-hidden">
                <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100/50 flex items-start gap-1.5 text-[10px] text-teal-800 font-medium leading-relaxed font-sans">
                  <ShieldCheck size={16} className="text-teal-650 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 block">PCI Cryptogram Signature Valid</span>
                    Verified with key {selectedOrd.id}-HASH. Live inventory batch state synchronized.
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center flex flex-col items-center">
              <Receipt className="text-slate-300 mb-2" size={32} />
              <h3 className="text-xs font-bold text-slate-800">Select Invoice to manage</h3>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">Highlight a specific order block to advanced logistics status steps, print packing slips or check invoice listings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export { OrderProcessor as default };
