import { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Order, OrderStatus } from '../../models/types';
import { Clock, Package, RefreshCw, Sparkles } from 'lucide-react';
import { Badge, Button } from '../../components/ui/atoms';

export function CustomerDashboard() {
  const {
    orders,
    returns,
    products,
    requestReturn,
    currentUser,
    addresses,
    signInWithGoogle,
    signOutUser
  } = useRudrax();

  const [activeTab, setActiveTab] = useState<string>('orders'); // 'orders', 'profile', 'tickets'
  
  // Return request form modal states
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnProdId, setReturnProdId] = useState<string>('');
  const [returnVarId, setReturnVarId] = useState<string>('');
  const [returnQty, setReturnQty] = useState<number>(1);
  const [returnReason, setReturnReason] = useState<string>('Quality compromised / damaged packaging');

  const handleOpenReturnModal = (ord: Order) => {
    setReturnOrderId(ord.id);
    const item = ord.items[0];
    if (item) {
      setReturnProdId(item.productId);
      setReturnVarId(item.variantId);
      setReturnQty(item.quantity);
    }
  };

  const handleTriggerReturnRequest = () => {
    if (returnOrderId && returnProdId && returnVarId) {
      requestReturn(returnOrderId, returnProdId, returnVarId, returnQty, returnReason);
      setReturnOrderId(null);
    }
  };

  const getStatusColor = (st: OrderStatus) => {
    switch (st) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Packed': return 'info';
      case 'Shipped': return 'info';
      case 'Out For Delivery': return 'warning';
      case 'Delivered': return 'success';
      case 'Returned': return 'danger';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  // Get matching product name for return modal rendering
  const currentReturnProduct = products.find(p => p.id === returnProdId);
  const currentReturnVariant = currentReturnProduct?.variants.find(v => v.id === returnVarId);

  return (
    <div className="customer-workspace bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile Card Summary Row */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-3xl p-6 shadow-md mb-8 flex justify-between items-center flex-wrap gap-4 relative overflow-hidden select-none">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-3 translate-x-3 scale-150">
            <Package size={200} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.name} className="h-14 w-14 rounded-2xl border border-teal-500 object-cover shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-14 w-14 bg-teal-600 border border-teal-500 rounded-2xl flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                {currentUser.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-xl font-black tracking-tight">{currentUser.name}</h1>
              <p className="text-xs text-teal-300 font-medium mb-1.5">{currentUser.email} | {currentUser.phone}</p>
              {!currentUser.photoURL ? (
                <button
                  onClick={signInWithGoogle}
                  className="rounded-lg bg-teal-700 hover:bg-teal-600 active:scale-95 text-[10px] font-bold text-teal-100 hover:text-white px-3 py-1 cursor-pointer border border-teal-500/30 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  🔐 Connect Google Account
                </button>
              ) : (
                <button
                  onClick={signOutUser}
                  className="rounded-lg bg-red-800 hover:bg-red-700 active:scale-95 text-[10px] font-bold text-red-100 hover:text-white px-3 py-1 cursor-pointer border border-red-500/30 shadow-sm transition-all"
                >
                  🚪 Toggle Account / Logout
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 shadow-md">
              <Sparkles size={18} className="fill-slate-900" />
            </div>
            <div>
              <span className="text-[10px] text-teal-200 font-bold block uppercase tracking-wider">Rudrax loyalty tier</span>
              <span className="text-sm font-black text-amber-300 font-mono tracking-tight">{currentUser.loyaltyPoints} points earned</span>
            </div>
          </div>
        </div>

        {/* Navigation Workspace Sub-tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-4 mb-6 select-none">
          {[
            { id: 'orders', label: "My Orders & Tracking" },
            { id: 'returns', label: "Returns History" },
            { id: 'addresses', label: "Saved Addresses" }
          ].map(tb => (
            <button
               key={tb.id}
               onClick={() => setActiveTab(tb.id)}
               className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                 activeTab === tb.id
                   ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10'
                   : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
               }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* RETURN DIALOG / MODAL FORM */}
        {returnOrderId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
              <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-1.5 leading-tight animate-bounce">
                <RefreshCw size={19} className="text-teal-600" /> File Return Request
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Ensure the supermarket seal is intact. Refund will be credited dynamically upon verification.</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Order Reference</span>
                  <span className="font-mono text-slate-900">{returnOrderId}</span>
                </div>
                <div className="flex justify-between mt-1 text-slate-500 font-medium">
                  <span>Item to Return</span>
                  <span>{currentReturnProduct?.name} ({currentReturnVariant?.name})</span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Returns Reason</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-xl"
                  >
                    <option value="Quality compromised / damaged packaging">Quality compromised / damaged packaging</option>
                    <option value="Incorrect grocery weight variant delivered">Incorrect grocery weight variant delivered</option>
                    <option value="Near expiry date/Spoiled">Near expiry date/Spoiled</option>
                    <option value="Ordered in error">Ordered in error</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Quantity to return</label>
                  <input
                    type="number"
                    min="1"
                    value={returnQty}
                    onChange={(e) => setReturnQty(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 justify-end">
                <Button variant="outline" size="sm" onClick={() => setReturnOrderId(null)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={handleTriggerReturnRequest}>Submit Return Claim</Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ORDERS TRACKING SYSTEM */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center">
                <Package size={40} className="text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 mb-1">No orders located</h3>
                <p className="text-xs text-slate-500 max-w-[280px]">Your dynamic e-commerce payload history is clear. Place a mock checkout order first!</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  {/* Order card header details */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4 flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-mono">
                        📦 ID: {ord.id}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">Placed: {new Date(ord.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(ord.status)}>
                        {ord.status}
                      </Badge>
                      {ord.status === 'Delivered' && !ord.returnRequested && (
                        <button
                          onClick={() => handleOpenReturnModal(ord)}
                          className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 h-6 px-2.5 rounded-lg font-bold transition-all cursor-pointer"
                        >
                          Return Item
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List of items with specific variant pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purchased Products</h4>
                      {ord.items.map((item, idx) => {
                        const pr = products.find(p => p.id === item.productId);
                        const vr = pr?.variants.find(v => v.id === item.variantId);
                        return (
                          <div key={idx} className="flex gap-2.5 items-center text-xs">
                            <img src={pr?.image} className="h-8 w-8 object-cover rounded border border-slate-100" alt={pr?.name} referrerPolicy="no-referrer" />
                            <div className="flex-1">
                              <span className="font-semibold text-slate-800 line-clamp-1">{pr?.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold block">{vr?.name} x {item.quantity}</span>
                            </div>
                            <span className="font-bold text-slate-900 font-mono">₹{item.purchasePrice * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col justify-end text-xs font-medium text-slate-600 gap-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50 md:max-w-xs md:ml-auto w-full">
                      <div className="flex justify-between items-center">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-slate-800 font-mono">₹{ord.subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Taxes & Packet</span>
                        <span className="font-bold text-slate-800 font-mono">₹{ord.tax}</span>
                      </div>
                      {ord.discount > 0 && (
                        <div className="flex justify-between items-center text-rose-600 font-bold text-[11px]">
                          <span>Discount coupon save</span>
                          <span className="font-mono">-₹{ord.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                        <span>Grand Bill Paid</span>
                        <span className="text-teal-800 font-mono">₹{ord.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* HIGH-FIDELITY TRACKING TIMELINE BLOCK */}
                  <div className="pt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-1">
                      🚦 Real-Time Logistics Timeline Tracking
                    </h4>
                    
                    {/* Linear timeline nodes dots */}
                    <div className="flex items-start md:flex-row flex-col gap-4 justify-between w-full relative">
                      {[
                        { stepStatus: 'Pending', label: 'Ordered', desc: 'Invoice generated' },
                        { stepStatus: 'Confirmed', label: 'Confirmed', desc: 'Acceptance by hub' },
                        { stepStatus: 'Packed', label: 'Packed', desc: 'Sanitized packing' },
                        { stepStatus: 'Shipped', label: 'Shipped', desc: 'Departed central hub' },
                        { stepStatus: 'Out For Delivery', label: 'Out for Delivery', desc: 'Rider departing' },
                        { stepStatus: 'Delivered', label: 'Delivered', desc: 'Handed safely' }
                      ].map((tlNode, index) => {
                        const statusWeights: Record<OrderStatus, number> = {
                          'Pending': 1, 'Confirmed': 2, 'Packed': 3, 'Shipped': 4,
                          'Out For Delivery': 5, 'Delivered': 6, 'Returned': 7, 'Completed': 8
                        };

                        const currentWeight = statusWeights[ord.status];
                        const checkedWeight = statusWeights[tlNode.stepStatus as OrderStatus];
                        
                        const isAchieved = currentWeight >= checkedWeight;
                        const isCurrentActive = ord.status === tlNode.stepStatus;

                        return (
                          <div key={index} className="flex md:flex-col items-center gap-2.5 text-left md:text-center flex-1 relative z-10 w-full md:w-auto">
                            <div className="flex items-center">
                              {/* Glowing state dot */}
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-mono font-black text-[10px] transition-all ${
                                isAchieved
                                  ? isCurrentActive
                                    ? 'bg-amber-400 text-slate-950 border-amber-400 ring-4 ring-amber-500/20'
                                    : 'bg-teal-600 text-white border-teal-600'
                                  : 'bg-slate-50 text-slate-300 border-slate-200'
                              }`}>
                                {isAchieved && !isCurrentActive ? '✓' : index + 1}
                              </div>
                            </div>

                            <div className="flex flex-col text-xs leading-tight">
                              <span className={`font-bold ${isAchieved ? 'text-slate-900' : 'text-slate-400'}`}>
                                {tlNode.label}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                                {tlNode.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Latest milestone note */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 mt-4 text-[11px] font-semibold text-slate-700 flex items-start gap-1.5 leading-relaxed">
                      <Clock size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500">Latest Event Note:</span> {ord.timeline[ord.timeline.length - 1]?.note}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: RETURNS CLAIMS MONITOR */}
        {activeTab === 'returns' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {returns.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center">
                <RefreshCw size={40} className="text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 mb-1">No claims in progress</h3>
                <p className="text-xs text-slate-500 max-w-[280px]">If you encounter damaged or incorrect essentials, you can file return requests here.</p>
              </div>
            ) : (
              returns.map((ret) => {
                const targetPr = products.find(p => p.id === ret.productId);
                const targetVr = targetPr?.variants.find(v => v.id === ret.variantId);
                return (
                  <div key={ret.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 hover:shadow-sm">
                    <div className="h-14 w-14 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100 flex-shrink-0">
                      <img src={targetPr?.image} className="object-cover h-full w-full rounded" alt={targetPr?.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                       <div className="flex justify-between items-start flex-wrap gap-2 text-xs font-semibold">
                        <div>
                          <span className="font-bold text-slate-900 font-mono">Claim: {ret.id}</span>
                          <span className="text-slate-400 font-bold font-mono text-[10px] block mt-0.5">Linked Order: {ret.orderId}</span>
                        </div>
                        <Badge variant={ret.status === 'Closed' ? 'success' : 'warning'}>
                          {ret.status}
                        </Badge>
                      </div>

                      <div className="text-xs">
                        <span className="font-semibold text-slate-700 block mt-1">Returned item: {targetPr?.name} ({targetVr?.name})</span>
                        <p className="text-slate-500 font-medium leading-relaxed mt-0.5">Reason: "{ret.reason}"</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                        <span>Refund Amount: <strong className="text-rose-600 text-xs font-black font-mono">₹{ret.refundAmount}</strong></span>
                        {ret.inventoryAction !== 'None' && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">Inv Action: {ret.inventoryAction}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            {addresses.map((addr, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-xs leading-normal font-medium text-slate-600">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1 bg-teal-50/50 p-2 rounded-lg border border-slate-100">
                  🏠 {index === 0 ? 'Primary Default' : 'Alternate'} Address
                </span>
                <p className="font-bold text-slate-800 text-sm mb-1">{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                <p className="text-slate-500 font-semibold mt-1">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
export { CustomerDashboard as default };
export { CustomerDashboard as CustomerWorkspace };
