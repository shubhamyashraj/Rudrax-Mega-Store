import { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Trash2, Plus, Minus, Ticket, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../../components/ui/atoms';

export function CartPage() {
  const {
    cart,
    products,
    batches,
    coupons,
    settings,
    updateCartQty,
    removeFromCart,
    setActivePage
  } = useRudrax();

  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Settle cart items references
  const cartWithData = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const variant = prod?.variants.find(v => v.id === item.variantId);
    
    // Find active batch to calculate true selling price
    const variantBatches = batches.filter(b => b.productId === item.productId && b.variantId === item.variantId);
    const activeBatch = variantBatches.find(b => b.isActive) || variantBatches[0];

    const price = activeBatch ? activeBatch.sellingPrice : 0;
    const aggregateStock = variantBatches.reduce((s, b) => s + b.quantity, 0);

    return {
      ...item,
      product: prod,
      variant,
      price,
      aggregateStock
    };
  }).filter(item => item.product && item.variant);

  // Subtotal Calculation
  const subtotal = cartWithData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Tax fee calc
  const taxRate = settings.defaultTaxRate;
  const taxAmount = parseFloat(((subtotal * taxRate) / 100).toFixed(2));

  // Ship charge calc
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : settings.standardShippingFee);

  // Handle Coupon Application
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    const target = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!target) {
      setCouponError('Invalid coupon code. Try RUDRAX20, ESSENTIALS10');
      return;
    }

    if (!target.isActive) {
      setCouponError('This coupon is currently inactive.');
      return;
    }

    if (subtotal < target.minOrderValue) {
      setCouponError(`Min purchase requirement is ₹${target.minOrderValue} to use this coupon.`);
      return;
    }

    setAppliedCoupon(target.code.toUpperCase());
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const activePromoObj = appliedCoupon ? coupons.find(c => c.code === appliedCoupon) : null;
  const couponDiscount = activePromoObj ? parseFloat(((subtotal * activePromoObj.discountPercent) / 100).toFixed(2)) : 0;

  const finalTotal = parseFloat((subtotal + taxAmount + shippingFee - couponDiscount).toFixed(2));

  const handleCheckoutProgress = () => {
    if (cart.length > 0) {
      setActivePage('checkout');
    }
  };

  return (
    <div className="cart-section bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb row */}
        <button
          onClick={() => setActivePage('catalog')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-semibold text-xs mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6 animate-fadeIn">Shopping Cart</h1>

        {cartWithData.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center max-w-lg mx-auto">
            <div className="h-16 w-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[280px]">Fill your basket with premium pulses, local milk, grains, and kitchen essentials.</p>
            <Button variant="primary" size="sm" onClick={() => setActivePage('catalog')}>
              Explore Hot Deals
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Cart products column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartWithData.map((item) => (
                <div
                  key={`${item.productId}_${item.variantId}`}
                  className="cart-item bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="h-16 w-16 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                    <img src={item.product?.image} alt={item.product?.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{item.product?.name}</span>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-widest">{item.product?.brand}</span>
                        <span className="text-xs text-slate-500 font-medium">Pack size: {item.variant?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 max-w-[100px]">
                        <button
                          onClick={() => updateCartQty(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="flex-1 text-center text-xs font-bold text-slate-800 px-2 min-w-[24px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity < item.aggregateStock) {
                              updateCartQty(item.productId, item.variantId, item.quantity + 1);
                            }
                          }}
                          disabled={item.quantity >= item.aggregateStock}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-950 block">₹{item.price * item.quantity}</span>
                        <span className="text-[10px] text-slate-400 font-mono">₹{item.price} each</span>
                        {item.quantity >= item.aggregateStock && (
                          <span className="text-[9px] text-orange-600 font-bold block mt-0.5 font-mono">Max Stock Limit Reached</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Summary Panel */}
            <div className="flex flex-col gap-4">
              {/* Promo Coupon Application widget */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Ticket size={14} className="text-teal-600" /> Apply Coupon Codes
                </h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl p-3">
                    <div>
                      <span className="text-xs font-black text-teal-800 tracking-wider font-mono">{appliedCoupon}</span>
                      <p className="text-[10px] text-teal-600 font-medium">Applied Successfully! Discounts apply.</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 underline border-none bg-transparent cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try RUDRAX20, FRESH30"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg placeholder:text-slate-400 uppercase font-bold text-slate-700"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <span className="text-[10px] text-rose-600 font-semibold">{couponError}</span>
                    )}
                    <div className="mt-1 pt-1 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Available Coupons:</span>
                      {coupons.filter(c => c.isActive).map(c => (
                        <div key={c.code} className="text-[10px] text-slate-500 mb-1 flex items-center justify-between font-medium">
                          <span>🎁 <strong className="font-mono text-slate-700 font-bold">{c.code}</strong> ({c.discountPercent}% OFF)</span>
                          <span className="text-slate-400">Min. ₹{c.minOrderValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price list widget */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Payment Summary</h3>
                <div className="flex flex-col gap-3 text-xs font-medium text-slate-600 pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-slate-800 font-mono">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Packaging & GST (5%)</span>
                    <span className="font-bold text-slate-800 font-mono">₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Charges</span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-black">FREE Delivery</span>
                    ) : (
                      <span className="font-bold text-slate-800 font-mono">₹{shippingFee}</span>
                    )}
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-rose-600 bg-rose-50 px-2 py-1.5 rounded-lg border border-rose-100">
                      <span>Promo Discount ({appliedCoupon})</span>
                      <span className="font-black font-mono">-₹{couponDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-4 mb-4">
                  <span className="text-sm font-bold text-slate-900">Aggregate Total</span>
                  <span className="text-lg font-black text-teal-800 font-mono">₹{finalTotal}</span>
                </div>

                {isFreeShipping ? (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] font-bold mb-4">
                    <Truck size={14} className="text-emerald-600" />
                    <span>Congrats! You locked in FREE delivery shipping</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100 text-[10px] font-bold mb-4 leading-normal">
                    💡 Add items worth <strong className="font-mono">₹{settings.freeShippingThreshold - subtotal}</strong> more to get completely FREE Super Express Delivery!
                  </div>
                )}

                <button
                  onClick={handleCheckoutProgress}
                  className="w-full py-3 bg-teal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-teal-600" /> Secure SSL 256-Bit Checkout Gateway
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export { CartPage as default };
export { CartPage as Cart };
