import React, { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Coupon } from '../../models/types';
import { Badge, Button, Input } from '../ui/atoms';
import { Percent, Plus } from 'lucide-react';

export function CouponOffers() {
  const { coupons, createCoupon, toggleCoupon } = useRudrax();

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(300);
  const [description, setDescription] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('2026-12-31');

  const [err, setErr] = useState<string>('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    if (!code || !description) {
      setErr('Please enter promo values.');
      return;
    }

    if (coupons.some(c => c.code.toUpperCase() === code.toUpperCase())) {
      setErr('Promo code already exits in coupon list.');
      return;
    }

    const newCp: Coupon = {
      code: code.toUpperCase(),
      discountPercent,
      minOrderValue,
      description,
      isActive: true,
      expiryDate
    };

    createCoupon(newCp);
    setShowAdd(false);
    
    // clear fields
    setCode('');
    setDescription('');
  };

  return (
    <div className="coupon-offers flex flex-col gap-6">
      <div className="flex justify-between items-center select-none flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <Percent size={24} className="text-teal-600" /> Offers & Coupons Manager
          </h1>
          <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">Setup Discount Rules & Campaign codes</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} /> Create Promo Code
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateCoupon} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-2xl flex flex-col gap-4 animate-fadeIn">
          <h2 className="text-xs font-black uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-100">Publish Promo Code</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Input label="Coupon Code String" placeholder="e.g. MONSOON30" value={code} onChange={setCode} />
            <Input label="Discount Percentage (%)" type="number" min="1" value={discountPercent} onChange={v => setDiscountPercent(Number(v))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Input label="Minimum order value requirement (₹)" type="number" min="0" value={minOrderValue} onChange={v => setMinOrderValue(Number(v))} />
            <Input label="Campaign Expiration Date" type="date" value={expiryDate} onChange={setExpiryDate} />
          </div>

          <Input label="Campaign Description Notes" placeholder="Get cash savings on healthy grains consignments..." value={description} onChange={setDescription} />

          {err && <span className="text-xs text-red-650 font-bold">{err}</span>}

          <div className="flex gap-2.5 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Activate Campaign Now</Button>
          </div>
        </form>
      )}

      {/* Main coupons lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
        {coupons.map((c) => (
          <div key={c.code} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 right-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase leading-none font-sans ${
                c.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
              }`}>
                {c.isActive ? 'Active' : 'Expired'}
              </span>
            </div>

            <div>
              <span className="text-xs font-black text-rose-600 font-mono tracking-wider bg-rose-50 border border-rose-100 p-1 px-2.5 rounded-lg inline-block mb-3">
                🏷️ {c.code}
              </span>
              <p className="text-sm font-bold text-slate-900 mb-1">{c.discountPercent}% OFF</p>
              <p className="text-xs text-slate-500 font-semibold mb-3 max-w-[180px] leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-bold flex justify-between items-center font-mono">
              <span>Min Basket: ₹{c.minOrderValue}</span>
              <button
                onClick={() => toggleCoupon(c.code)}
                className={`p-1 px-2 rounded font-black text-[9px] uppercase cursor-pointer border ${
                  c.isActive
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100'
                }`}
              >
                {c.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
