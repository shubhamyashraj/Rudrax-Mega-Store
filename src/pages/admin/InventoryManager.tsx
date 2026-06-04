import React, { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Batch } from '../../models/types';
import { Button, Input } from '../../components/ui/atoms';
import { Database, Plus, Trash2, FileSpreadsheet } from 'lucide-react';

export function InventoryManager() {
  const {
    batches,
    products,
    addBatch,
    deleteBatch
  } = useRudrax();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [selectedProdId, setSelectedProdId] = useState<string>(products[0]?.id || '');

  // Get matching variants for selected product
  const targetProductObj = products.find(p => p.id === selectedProdId) || products[0];
  const [selectedVarId, setSelectedVarId] = useState<string>(targetProductObj?.variants[0]?.id || '');

  // Inputs state
  const [batchId, setBatchId] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(135);
  const [quantity, setQuantity] = useState<number>(50);
  const [mfgDate, setMfgDate] = useState<string>('2026-05-15');
  const [expiryDate, setExpiryDate] = useState<string>('2028-05-15');
  const [taxPercent, setTaxPercent] = useState<number>(5);
  const [hsnCode, setHsnCode] = useState<string>('10063010');
  const [supplier, setSupplier] = useState<string>('National Supply Graders');

  const [formErr, setFormErr] = useState<string>('');

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (!batchId || !selectedProdId || !selectedVarId || !supplier) {
      setFormErr('Please complete all mandatory batch inwarding metrics.');
      return;
    }

    // Verify unique batchId
    if (batches.some(b => b.id.toUpperCase() === batchId.toUpperCase())) {
      setFormErr('Batch ID must be unique inside inventory system.');
      return;
    }

    const payload: Omit<Batch, 'isActive'> = {
      id: batchId.toUpperCase(),
      productId: selectedProdId,
      variantId: selectedVarId,
      purchasePrice,
      sellingPrice,
      quantity,
      initialQuantity: quantity,
      mfgDate,
      expiryDate,
      taxPercent,
      hsnCode,
      supplier
    };

    addBatch(payload);
    setShowAddForm(false);
    
    // clear fields
    setBatchId('');
  };

  const handleSelectProductChange = (prodId: string) => {
    setSelectedProdId(prodId);
    const mathProd = products.find(p => p.id === prodId);
    if (mathProd && mathProd.variants.length > 0) {
      setSelectedVarId(mathProd.variants[0].id);
    }
  };

  return (
    <div className="inventory-manager flex flex-col gap-6 p-4">
      {/* Page header */}
      <div className="flex justify-between items-center flex-wrap gap-4 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <Database size={24} className="text-teal-650" /> Advanced FIFO Batch Manager
          </h1>
          <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">Stock Inwarding & Cron FIFO Reserve Queue</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus size={15} /> Inward New Batch
        </button>
      </div>

      {/* Dynamic Add Batch Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateBatch} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-4xl flex flex-col gap-4 animate-fadeIn">
          <h2 className="text-xs font-black uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-100">Inward Fresh Consignment Lot</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-slate-700">Select Product</label>
              <select
                value={selectedProdId}
                onChange={(e) => handleSelectProductChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-teal-500 focus:outline-none font-medium text-slate-800"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-slate-700">Select Variant Pack</label>
              <select
                value={selectedVarId}
                onChange={(e) => setSelectedVarId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:border-teal-500 focus:outline-none font-medium text-slate-850"
              >
                {targetProductObj?.variants.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (SKU: {v.sku})</option>
                ))}
              </select>
            </div>

            <Input label="Lot / Batch ID (Unique)" placeholder="e.g. BAT-MILK-10" value={batchId} onChange={setBatchId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <Input label="Purchase Cost Price (₹)" type="number" min="1" value={purchasePrice} onChange={v => setPurchasePrice(Number(v))} />
            <Input label="Retail Selling Price (₹)" type="number" min="1" value={sellingPrice} onChange={v => setSellingPrice(Number(v))} />
            <Input label="Consignment Qty (Packs)" type="number" min="1" value={quantity} onChange={v => setQuantity(Number(v))} />
            <Input label="Tax bracket (%)" type="number" min="0" value={taxPercent} onChange={v => setTaxPercent(Number(v))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <Input label="Manufacturing Date" type="date" value={mfgDate} onChange={setMfgDate} />
            <Input label="Expiry Date" type="date" value={expiryDate} onChange={setExpiryDate} />
            <Input label="HSN Tariffs Code" placeholder="e.g. 10063010" value={hsnCode} onChange={setHsnCode} />
            <Input label="Supplier Agency Name" placeholder="e.g. Vidarbha Wholesales" value={supplier} onChange={setSupplier} />
          </div>

          {formErr && <span className="text-xs text-red-650 font-bold">{formErr}</span>}

          <div className="flex gap-2.5 justify-end border-t border-slate-100 pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Verify & Log to FIFO Pool</Button>
          </div>
        </form>
      )}

      {/* Chronological FIFO Queue Visualization */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-lg select-none relative overflow-hidden">
        <h2 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3.5 flex items-center gap-1.5 leading-none">
          ⚡ Chronological FIFO Dispatch Pipeline Visualizer
        </h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed max-w-2xl">
          E-commerce dispatch operates strictly on <strong>First-In, First-Out (FIFO)</strong>. The earliest manufactured batches are marked <span className="text-emerald-400 font-bold uppercase underline">ACTIVE</span> and drained down first during customer checkouts. Reserve batches are kept locked until active batches are depleted.
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {batches.filter(b => b.quantity > 0).sort((x, y) => new Date(x.mfgDate).getTime() - new Date(y.mfgDate).getTime()).map((b, idx) => {
            const matchedP = products.find(p => p.id === b.productId);
            const matchedV = matchedP?.variants.find(v => v.id === b.variantId);
            return (
              <div
                key={b.id}
                className={`flex-shrink-0 w-64 border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 relative ${
                  b.isActive
                    ? 'bg-teal-950/70 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/40 border-slate-700/80 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Active Tag */}
                <div className="absolute top-3.5 right-3.5">
                  {b.isActive ? (
                    <span className="bg-emerald-505 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider leading-none">
                      Active
                    </span>
                  ) : (
                    <span className="bg-slate-700 text-slate-300 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider leading-none font-mono">
                      {idx + 1} Queue
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-amber-400 font-bold font-mono tracking-tight uppercase">LOT: {b.id}</span>
                  <span className="font-bold text-sm block text-white truncate max-w-[150px] leading-tight mt-1">{matchedP?.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 font-sans">Pack: {matchedV?.name}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-end text-[10px] text-slate-300 font-medium">
                  <div>
                    <span className="block">Mfg Consignment:</span>
                    <span className="font-bold text-white font-mono">{b.mfgDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-sans">Quantity pool:</span>
                    <span className={`text-xs font-black font-mono ${b.quantity <= 5 ? 'text-orange-400 animate-pulse' : 'text-white'}`}>
                      {b.quantity} / {b.initialQuantity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Inventory list Database Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-slate-101 mb-4 text-xs font-bold text-slate-800">
          <span className="text-sm font-black text-slate-900 font-sans">Supermarket Batch Ledger ({batches.length} recorded lots)</span>
          <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md text-[10px] font-mono leading-none tracking-wide text-slate-520 uppercase select-none"><FileSpreadsheet size={13} /> EXPORT CSV</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3 animate-pulse">Essential Product</th>
                <th className="py-3 px-3">HSN Code</th>
                <th className="py-3 px-3 text-center">Remaining</th>
                <th className="py-3 px-3 text-right">Inward Cost</th>
                <th className="py-3 px-3 text-right">Selling Pricing</th>
                <th className="py-3 px-3">Expiry Matrix</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-705 font-mono">
              {batches.map((b) => {
                const pr = products.find(p => p.id === b.productId);
                const vr = pr?.variants.find(v => v.id === b.variantId);
                const isExpired = new Date(b.expiryDate).getTime() < new Date().getTime();
                return (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-teal-700">{b.id}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="font-bold text-slate-950 block leading-normal">{pr?.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{pr?.brand} | Variant: {vr?.name}</span>
                    </td>
                    <td className="py-3 px-3 uppercase text-slate-400 font-bold">{b.hsnCode}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        b.quantity === 0
                          ? 'bg-red-50 text-red-650'
                          : b.quantity <= 5
                            ? 'bg-orange-50 text-orange-650'
                            : 'bg-slate-50 text-slate-700'
                      }`}>
                        {b.quantity} / {b.initialQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-520 font-bold">₹{b.purchasePrice}</td>
                    <td className="py-3 px-3 text-right text-slate-900 font-bold">₹{b.sellingPrice}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`font-semibold text-[11px] ${isExpired ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                        {b.expiryDate} {isExpired ? '(Expired)' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteBatch(b.id)}
                        className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-605 hover:text-rose-700 rounded-lg text-[10px] font-black transition-all cursor-pointer inline-flex items-center gap-1 border border-rose-200"
                      >
                        <Trash2 size={11} /> Del
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export { InventoryManager as default };
