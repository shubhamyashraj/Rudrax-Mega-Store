import { Tag, Percent } from 'lucide-react';
import { useState } from 'react';

interface CheckoutSummaryProps {
  subtotal: number;
  discount?: number;
  deliveryCharge?: number;
  tax?: number;
  onApplyCoupon?: (code: string) => void;
  appliedCoupon?: string;
  onRemoveCoupon?: () => void;
  onCheckout?: () => void;
}

export function CheckoutSummary({
  subtotal,
  discount = 0,
  deliveryCharge = 0,
  tax = 0,
  onApplyCoupon,
  appliedCoupon,
  onRemoveCoupon,
  onCheckout
}: CheckoutSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const total = subtotal - discount + deliveryCharge + tax;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      onApplyCoupon?.(couponCode);
      setCouponCode('');
      setShowCouponInput(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 sticky top-4">
      <h2 className="font-bold text-lg mb-4">Order Summary</h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Discount</span>
            <span className="font-medium">-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Delivery Charge</span>
          <span className="font-medium">
            {deliveryCharge === 0 ? (
              <span className="text-success">FREE</span>
            ) : (
              `₹${deliveryCharge.toFixed(2)}`
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">₹{tax.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Coupon Section */}
      <div className="mb-4 pb-4 border-b border-border">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-success/10 border border-success rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <Tag className="w-4 h-4" />
              <span className="font-medium">{appliedCoupon}</span>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-sm text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            {!showCouponInput ? (
              <button
                onClick={() => setShowCouponInput(true)}
                className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Percent className="w-4 h-4" />
                <span className="font-medium">Apply Coupon</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    Apply
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCouponInput(false);
                    setCouponCode('');
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-xl text-primary">₹{total.toFixed(2)}</span>
      </div>

      {/* Savings Message */}
      {discount > 0 && (
        <p className="text-sm text-success mb-4 text-center">
          You saved ₹{discount.toFixed(2)} on this order
        </p>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Proceed to Checkout
        </button>
      )}

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="text-success">✓</span>
          Free delivery on orders above ₹500
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="text-success">✓</span>
          Easy returns within 7 days
        </p>
      </div>
    </div>
  );
}
