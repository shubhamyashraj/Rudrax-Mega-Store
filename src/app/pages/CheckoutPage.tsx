import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { AddressCard, Address } from '../components/molecules/AddressCard';
import { CheckoutSummary } from '../components/organisms/CheckoutSummary';
import { Check, CreditCard, Wallet, Building, Smartphone } from 'lucide-react';
import { useState } from 'react';

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('');

  // Mock addresses
  const addresses: Address[] = [
    {
      id: '1',
      name: 'Raj Patel',
      phone: '+91 98765 43210',
      addressLine1: '123, Green Park Apartments',
      addressLine2: 'Near Metro Station',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
      type: 'home'
    },
    {
      id: '2',
      name: 'Raj Patel',
      phone: '+91 98765 43210',
      addressLine1: 'Tech Hub, 4th Floor',
      addressLine2: 'BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      type: 'work'
    }
  ];

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      duration: '3-5 business days',
      price: 0
    },
    {
      id: 'express',
      name: 'Express Delivery',
      duration: '1-2 business days',
      price: 99
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      duration: 'Within 24 hours',
      price: 149
    }
  ];

  const paymentOptions = [
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay using UPI apps'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building className="w-5 h-5" />,
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Paytm, PhonePe, Amazon Pay'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <span className="text-lg">₹</span>,
      description: 'Pay when you receive'
    }
  ];

  const steps = [
    { id: 1, name: 'Address', completed: currentStep > 1 },
    { id: 2, name: 'Delivery', completed: currentStep > 2 },
    { id: 3, name: 'Payment', completed: currentStep > 3 },
    { id: 4, name: 'Review', completed: false }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={3}
        wishlistCount={5}
        onCartClick={() => console.log('Cart')}
        onWishlistClick={() => console.log('Wishlist')}
        onProfileClick={() => console.log('Profile')}
      />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Steps Indicator */}
          <div className="bg-card rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : step.completed
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.completed ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 transition-colors ${
                      step.completed ? 'bg-success' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Address Selection */}
              {currentStep === 1 && (
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Select Delivery Address</h2>
                    <button className="text-primary font-semibold hover:underline">
                      + Add New Address
                    </button>
                  </div>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        isSelected={selectedAddress === address.id}
                        onSelect={setSelectedAddress}
                        showActions={false}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Options */}
              {currentStep === 2 && (
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Select Delivery Option</h2>
                  <div className="space-y-4">
                    {deliveryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedDelivery(option.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                          selectedDelivery === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedDelivery === option.id
                                  ? 'border-primary'
                                  : 'border-border'
                              }`}
                            >
                              {selectedDelivery === option.id && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{option.name}</p>
                              <p className="text-sm text-muted-foreground">{option.duration}</p>
                            </div>
                          </div>
                          <p className="font-bold">
                            {option.price === 0 ? 'FREE' : `₹${option.price}`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-8 py-3 rounded-lg border border-border hover:bg-muted"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedPayment(option.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                          selectedPayment === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedPayment === option.id
                                ? 'border-primary'
                                : 'border-border'
                            }`}
                          >
                            {selectedPayment === option.id && (
                              <div className="w-3 h-3 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-muted-foreground">{option.icon}</div>
                            <div>
                              <p className="font-semibold">{option.name}</p>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 rounded-lg border border-border hover:bg-muted"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      disabled={!selectedPayment}
                      className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Order Review */}
              {currentStep === 4 && (
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Delivery Address</h3>
                    <AddressCard
                      address={addresses.find(a => a.id === selectedAddress)!}
                      showActions={false}
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <p className="text-muted-foreground">
                      {paymentOptions.find(p => p.id === selectedPayment)?.name}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 rounded-lg border border-border hover:bg-muted"
                    >
                      Back
                    </button>
                    <button className="bg-success text-success-foreground px-8 py-3 rounded-lg font-bold hover:bg-success/90">
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Sticky */}
            <div>
              <CheckoutSummary
                subtotal={1363}
                discount={165}
                deliveryCharge={deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0}
                tax={68.15}
                appliedCoupon="FIRST50"
                onRemoveCoupon={() => console.log('Remove coupon')}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
