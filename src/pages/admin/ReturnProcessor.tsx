import { useRudrax } from '../../app/StateContext';
import { ReturnStatus, ReturnInventoryAction } from '../../models/types';
import { Badge } from '../../components/ui/atoms';

export function ReturnProcessor() {
  const { returns, products, processReturnRequest } = useRudrax();

  const handleUpdateClaimState = (id: string, status: ReturnStatus, act: ReturnInventoryAction) => {
    processReturnRequest(id, status, act);
  };

  return (
    <div className="return-processor flex flex-col gap-6 p-4">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Returns & Claims Desk</h1>
        <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">Customer Refund Verification & Stock Restorations</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100">Filed claims list</h2>

        {returns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-semibold text-xs font-mono">
            No return request claims filed inside the simulator.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-3">Claim ID</th>
                  <th className="py-3 px-3">Order Details</th>
                  <th className="py-3 px-3">Product Essential</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Refund Value</th>
                  <th className="py-3 px-3">Customer Reason</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right font-mono">Resolution Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-705">
                {returns.map((ret) => {
                  const targetP = products.find(p => p.id === ret.productId);
                  const targetV = targetP?.variants.find(v => v.id === ret.variantId);
                  
                  return (
                    <tr key={ret.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold font-mono text-teal-700">{ret.id}</td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-slate-800">{ret.orderId}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(ret.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{targetP?.name}</span>
                        <span className="text-[10px] text-slate-450 font-bold font-mono block mt-0.5">{targetV?.name}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono">{ret.quantity}</td>
                      <td className="py-3 px-3 text-right font-bold text-rose-600 font-mono">₹{ret.refundAmount}</td>
                      <td className="py-3 px-3 text-xs italic text-slate-500 font-medium max-w-[180px] leading-normal font-mono">
                        "{ret.reason}"
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={ret.status === 'Closed' ? 'success' : 'warning'}>
                          {ret.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {ret.status === 'Pending' ? (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleUpdateClaimState(ret.id, 'Closed', 'Restored')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black rounded-lg text-[9px] uppercase tracking-wider font-mono border border-emerald-200 cursor-pointer"
                              title="Approve refund and add stock back to the active FIFO batch"
                            >
                              ✓ Refund & Restore stock
                            </button>
                            <button
                              onClick={() => handleUpdateClaimState(ret.id, 'Closed', 'Scrap')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-lg text-[9px] uppercase tracking-wider font-mono border border-rose-250 cursor-pointer"
                              title="Approve refund but discard damaged goods as store scrap loss"
                            >
                              ✗ Refund & Scrap
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold font-mono block uppercase">Claim closed ({ret.inventoryAction})</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export { ReturnProcessor as default };
