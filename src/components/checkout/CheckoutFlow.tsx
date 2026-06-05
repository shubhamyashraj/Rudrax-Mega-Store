import React, { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { ShippingAddress, Order } from '../../models/types';
import { ArrowLeft, Check, CreditCard, Home, MapPin, Phone, Plus, ShieldCheck, ShoppingBag, Smartphone, Truck } from 'lucide-react';
import { Button, Input } from '../ui/atoms';

export function CheckoutFlow() {
  const {
    cart,
    products,
    batches,
    settings,
    addresses,
    addAddress,
    placeOrder,
    setActivePage
  } = useRudrax();

  const [step, setStep] = useState<number>(1);
  const [selectedAddrIndex, setSelectedAddrIndex] = useState<number>(0);
  const [deliveryOption, setDeliveryOption] = useState<string>('Super Express (15 Min)');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [orderCoupon] = useState<string>('RUDRAX20'); // Quick seed coupon to make flow extremely easy
  const [hasCouponFlag] = useState<boolean>(true);

  // Address create states
  const [showAddAddrForm, setShowAddAddrForm] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newAddrLine1, setNewAddrLine1] = useState<string>('');
  const [newAddrLine2, setNewAddrLine2] = useState<string>('');
  const [newCity, setNewCity] = useState<string>('');
  const [newState, setNewState] = useState<string>('');
  const [newZip, setNewZip] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [formErr, setFormErr] = useState<string>('');

  const [placingOrderProcess, setPlacingOrderProcess] = useState<boolean>(false);
  const [placeErr, setPlaceErr] = useState<string>('');

  // Cart total valuations
  const cartWithData = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const variant = prod?.variants.find(v => v.id === item.variantId);
    const vBatches = batches.filter(b => b.productId === item.productId && b.variantId === item.variantId);
    const activeBatch = vBatches.find(b => b.isActive) || vBatches[0];
    const price = activeBatch ? activeBatch.sellingPrice : 0;
    return { ...item, product: prod, variant, price };
  }).filter(item => item.product && item.variant);

  const subtotal = cartWithData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = parseFloat(((subtotal * settings.defaultTaxRate) / 100).toFixed(2));
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : settings.standardShippingFee);

  // Discount rules
  const discountAmount = hasCouponFlag && subtotal >= 500 ? parseFloat(((subtotal * 20) / 100).toFixed(2)) : 0;
  const grandTotal = parseFloat((subtotal + taxAmount + shippingFee - discountAmount).toFixed(2));

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    if (!newFullName || !newAddrLine1 || !newCity || !newState || !newZip || !newPhone) {
      setFormErr('Please complete all mandatory address fields.');
      return;
    }

    const newAddr: ShippingAddress = {
      fullName: newFullName,
      addressLine1: newAddrLine1,
      addressLine2: newAddrLine2,
      city: newCity,
      state: newState,
      zipCode: newZip,
      phone: newPhone
    };

    addAddress(newAddr);
    setShowAddAddrForm(false);
    setSelectedAddrIndex(0); // Highlight newly added address
    
    // reset form fields
    setNewFullName('');
    setNewAddrLine1('');
    setNewAddrLine2('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    setNewPhone('');
  };

  const handleTriggerPlaceOrder = async () => {
    setPlacingOrderProcess(true);
    setPlaceErr('');

    const activeAddress = addresses[selectedAddrIndex];
    if (!activeAddress) {
      setPlaceErr('No shipping address selected.');
      setPlacingOrderProcess(false);
      return;
    }

    // Small network lag simulator for great professional UI experience
    setTimeout(async () => {
      const result = await placeOrder(
        activeAddress,
        deliveryOption,
        paymentMethod,
        hasCouponFlag && subtotal >= 500 ? orderCoupon : undefined
      );

      setPlacingOrderProcess(false);
      if (result.success) {
        setActivePage('orders');
      } else {
        setPlaceErr(result.error || 'Failed placing order.');
      }
    }, 1200);
  };

  const deliveryOptions = [
    { name: "Super Express (15 Min)", description: "Instant local delivery from matching nearest dark-store hubs", icon: Truck },
    { name: "Standard Delivery (30-45 Min)", description: "Eco-friendly batch slot, saves energy emissions", icon: ClockIcon },
    { name: "Scheduled Next-Day", description: "Fresh morning drop slot between 7:00 AM - 10:00 AM", icon: CalendarIcon }
  ];

  const paymentModes = [
    { type: "UPI" as const, name: "UPI (GooglePay, PhonePe, Paytm)", description: "Instant verification, zero checkout failures", icon: Smartphone },
    { type: "Credit Card" as const, name: "Credit / Debit Card secure payload", description: "Visa, Mastercard, RuPay & Amex supported", icon: CreditCard },
    { type: "Cash On Delivery" as const, name: "Cash / Pay on Delivery (COD)", description: "UPI or Cash payable directly to delivery rider", icon: Home }
  ];

  return (
    <div className="checkout-page bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation back triggers */}
        <button
          onClick={() => { if (step > 1) { setStep(step - 1); } else { setActivePage('cart'); } }}
          className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-semibold text-xs mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} /> {step > 1 ? `Back to Step ${step - 1}` : 'Back to Cart'}
        </button>

        {/* Dynamic checkout horizontal stepper header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center mb-8 flex-wrap gap-4 select-none">
          {[
            { num: 1, label: "Delivery Address" },
            { num: 2, label: "Delivery Speed" },
            { num: 3, label: "Security & Payment" },
            { num: 4, label: "Review & Order" }
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                step === item.num
                  ? 'bg-teal-600 text-white border-teal-600'
                  : step > item.num
                    ? 'bg-teal-50 text-teal-600 border-teal-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                {step > item.num ? <Check size={12} className="stroke-3" /> : item.num}
              </div>
              <span className={`text-xs font-bold ${step === item.num ? 'text-slate-900 border-b-2 border-teal-600 pb-0.5' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: ADDRESS SELECTION FLOW */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Select Shipping Address</h2>
                <button
                  onClick={() => setShowAddAddrForm(!showAddAddrForm)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100"
                >
                  <Plus size={14} /> New Address
                </button>
              </div>

              {/* Collapsible New Address Form */}
              {showAddAddrForm && (
                <form onSubmit={handleAddNewAddress} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3.5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Add New Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input label="Full Name" placeholder="e.g. Shubham Yashraj" value={newFullName} onChange={setNewFullName} />
                    <Input label="Mobile Number" placeholder="e.g. +91 98765 43210" value={newPhone} onChange={setNewPhone} />
                  </div>
                  <Input label="Address Line 1" placeholder="Flat No, Apartment, Suite, Street name" value={newAddrLine1} onChange={setNewAddrLine1} />
                  <Input label="Address Line 2 (Optional)" placeholder="Landmark, Local area block" value={newAddrLine2} onChange={setNewAddrLine2} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input label="City" placeholder="Gurugram" value={newCity} onChange={setNewCity} />
                    <Input label="State" placeholder="Haryana" value={newState} onChange={setNewState} />
                    <Input label="Postal Code" placeholder="122002" value={newZip} onChange={setNewZip} />
                  </div>
                  {formErr && <span className="text-xs text-red-500 font-bold">{formErr}</span>}
                  <div className="flex gap-2.5 justify-end mt-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddAddrForm(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Save and Use Address</Button>
                  </div>
                </form>
              )}

              {/* Standard Address list cards */}
              <div className="flex flex-col gap-3">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    onClick={() => { setSelectedAddrIndex(index); }}
                    className={`address-card border rounded-2xl p-5 cursor-pointer flex justify-between bg-white relative transition-all ${
                      selectedAddrIndex === index
                        ? 'border-teal-600 ring-2 ring-teal-500/10 bg-teal-50/10'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="h-5 w-5 rounded-full border border-slate-300 mt-0.5 flex items-center justify-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${selectedAddrIndex === index ? 'bg-teal-600' : ''}`} />
                      </div>
                      <div className="flex flex-col text-xs leading-normal font-medium text-slate-600">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1">
                          <MapPin size={15} className="text-teal-600" /> {addr.fullName}
                        </span>
                        <span>{addr.addressLine1}</span>
                        {addr.addressLine2 && <span>{addr.addressLine2}</span>}
                        <span>{addr.city}, {addr.state} - {addr.zipCode}</span>
                        <span className="flex items-center gap-1 text-slate-500 font-semibold mt-1">
                          <Phone size={12} /> {addr.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button variant="primary" className="w-full sm:w-auto" onClick={() => setStep(2)}>
                  Confirm Address, Next Step
                </Button>
              </div>
            </div>

            {/* Quick Summary Aside */}
            <CheckoutSummaryAside subtotal={subtotal} discount={discountAmount} shipping={shippingFee} tax={taxAmount} total={grandTotal} itemsCount={cartWithData.length} />
          </div>
        )}

        {/* STEP 2: DELIVERY SPEEDS OPTIONS */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="md:col-span-2 flex flex-col gap-4">
              <h2 className="text-base font-bold text-slate-900 mb-2">Configure Delivery Speed</h2>
              <div className="flex flex-col gap-3">
                {deliveryOptions.map((opt) => {
                  const IconComp = opt.icon;
                  return (
                    <div
                      key={opt.name}
                      onClick={() => setDeliveryOption(opt.name)}
                      className={`border rounded-2xl p-4 cursor-pointer bg-white flex justify-between items-center transition-all ${
                        deliveryOption === opt.name
                          ? 'border-teal-600 ring-2 ring-teal-500/10 bg-teal-50/10'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700">
                          <IconComp size={22} className="text-teal-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{opt.name}</span>
                          <span className="text-xs text-slate-500 font-medium max-w-[280px] leading-normal">{opt.description}</span>
                        </div>
                      </div>
                      <div className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                        <div className={`h-2.5 w-2.5 rounded-full ${deliveryOption === opt.name ? 'bg-teal-600' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(3)}>Continue to Payments</Button>
              </div>
            </div>

            <CheckoutSummaryAside subtotal={subtotal} discount={discountAmount} shipping={shippingFee} tax={taxAmount} total={grandTotal} itemsCount={cartWithData.length} />
          </div>
        )}

        {/* STEP 3: PAYMENT METHOD FORM */}
        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="md:col-span-2 flex flex-col gap-4">
              <h2 className="text-base font-bold text-slate-900 mb-2">Select Payment Method</h2>
              <div className="flex flex-col gap-3">
                {paymentModes.map((opt) => {
                  const ModeIcon = opt.icon;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setPaymentMethod(opt.type)}
                      className={`border rounded-2xl p-4 cursor-pointer bg-white flex justify-between items-center transition-all ${
                        paymentMethod === opt.type
                          ? 'border-teal-600 ring-2 ring-teal-500/10 bg-teal-50/10'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700">
                          <ModeIcon size={22} className="text-teal-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{opt.name}</span>
                          <span className="text-xs text-slate-500 font-medium max-w-[280px] leading-normal">{opt.description}</span>
                        </div>
                      </div>
                      <div className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                        <div className={`h-2.5 w-2.5 rounded-full ${paymentMethod === opt.type ? 'bg-teal-600' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* UPI App Quick Mock Selection */}
              {paymentMethod === "UPI" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm animate-fadeIn">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"> UPI App Launcher</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                      <div key={app} className="p-2.5 border border-slate-200 hover:border-teal-500 rounded-xl cursor-not-allowed select-none text-[11px] font-bold text-slate-700 hover:bg-teal-50/20 bg-slate-50 font-mono">
                        {app}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold text-center italic">⚠️ Verify checkout directly upon placing order payload confirmation.</span>
                </div>
              )}

              {/* Credit Card Details Mock */}
              {paymentMethod === "Credit Card" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3.5 shadow-sm animate-fadeIn">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Secure Vault PCI Details</h3>
                  <div className="flex flex-col gap-3">
                    <Input label="Card Number" placeholder="4111 2222 3333 4444" value="4111 2222 3333 4444" onChange={() => {}} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Expiry MM/YY" placeholder="12/29" value="12/29" onChange={() => {}} />
                      <Input label="CVV Code" placeholder="•••" value="•••" onChange={() => {}} />
                    </div>
                    <Input label="Cardholder Name" placeholder="SHUBHAM YASHRAJ" value="SHUBHAM YASHRAJ" onChange={() => {}} />
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(4)}>Review Final Order</Button>
              </div>
            </div>

            <CheckoutSummaryAside subtotal={subtotal} discount={discountAmount} shipping={shippingFee} tax={taxAmount} total={grandTotal} itemsCount={cartWithData.length} />
          </div>
        )}

        {/* STEP 4: ORDER DEEP REVIEW */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="md:col-span-2 flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Confirm Order Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 mb-4 border-b border-slate-100 text-xs">
                  <div>
                    <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Shipping Destination</h3>
                    {addresses[selectedAddrIndex] && (
                      <div className="font-semibold text-slate-800">
                        <p>{addresses[selectedAddrIndex].fullName}</p>
                        <p className="text-slate-500 font-medium">{addresses[selectedAddrIndex].addressLine1}, {addresses[selectedAddrIndex].city}</p>
                        <p className="text-slate-500 font-medium">Phone: {addresses[selectedAddrIndex].phone}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Logistics & Billing</h3>
                    <p className="font-semibold text-slate-800">Speed: <span className="text-teal-600 font-black">{deliveryOption}</span></p>
                    <p className="font-semibold text-slate-800 mt-1">Payment Mode: <span className="text-slate-600 font-black">{paymentMethod}</span></p>
                  </div>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Purchased Items ({cartWithData.length})</h3>
                <div className="flex flex-col gap-3">
                  {cartWithData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <img src={item.product?.image} className="h-8 w-8 object-cover rounded" alt={item.product?.name} referrerPolicy="no-referrer" />
                        <div>
                          <span className="font-bold text-slate-800 block">{item.product?.name}</span>
                          <span className="text-slate-400 font-medium text-[10px]">Size: {item.variant?.name} | Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 font-mono">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {placeErr && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-200 text-xs font-bold leading-normal">
                  ⚠️ {placeErr}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button
                  variant="success"
                  className="flex-1 sm:flex-initial shadow-lg shadow-emerald-600/15"
                  onClick={handleTriggerPlaceOrder}
                  disabled={placingOrderProcess}
                >
                  {placingOrderProcess ? 'Validating Live Batch FIFO Stock Allocations...' : `Complete & Place Order (₹${grandTotal})`}
                </Button>
              </div>
            </div>

            <CheckoutSummaryAside subtotal={subtotal} discount={discountAmount} shipping={shippingFee} tax={taxAmount} total={grandTotal} itemsCount={cartWithData.length} />
          </div>
        )}
      </div>
    </div>
  );
}

// Side Widgets
interface SummaryAsideProps {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemsCount: number;
}

function CheckoutSummaryAside({ subtotal, discount, shipping, tax, total, itemsCount }: SummaryAsideProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5 font-mono">
        <ShoppingBag size={16} className="text-teal-600" /> Checkout Receipt
      </h3>
      <div className="flex flex-col gap-3 text-xs font-medium text-slate-600 pb-4 border-b border-slate-105">
        <div className="flex justify-between items-center">
          <span>Items Selected ({itemsCount})</span>
          <span className="font-bold text-slate-800 font-mono">₹{subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Taxes (5%)</span>
          <span className="font-bold text-slate-800 font-mono">₹{tax}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Delivery Charge</span>
          {shipping === 0 ? (
            <span className="text-emerald-600 font-bold">FREE</span>
          ) : (
            <span className="font-bold text-slate-800 font-mono">₹{shipping}</span>
          )}
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-rose-600 font-bold">
            <span>Special Coupon Save</span>
            <span className="font-mono">-₹{discount}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 mb-4 select-none">
        <span className="text-sm font-bold text-slate-900">Immediate Checkout</span>
        <span className="text-lg font-black text-teal-800 font-mono">₹{total}</span>
      </div>

      <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
        <ShieldCheck size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
        <span className="leading-normal font-medium">Automatic chronological FIFO algorithm reserves your fresh groceries dynamically upon selection.</span>
      </div>
    </div>
  );
}

// Simple clock support icon
function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  );
}

// Simple calendar support icon
function CalendarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
  );
}
