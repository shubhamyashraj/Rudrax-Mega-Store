import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { CreditCard, Smartphone, Banknote, Building2 } from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    clearCart();
    toast.success("Order placed successfully!");
    navigate(`/orders/${orderId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate("/products")}>Start Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <h3>Delivery Address</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="md:col-span-2"
                      />
                      <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="md:col-span-2"
                      />
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="PIN Code"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3>Payment Method</h3>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup.Root value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <RadioGroup.Item
                            value="upi"
                            className="w-5 h-5 border-2 border-border rounded-full flex items-center justify-center data-[state=checked]:border-primary"
                          >
                            <RadioGroup.Indicator className="w-3 h-3 bg-primary rounded-full" />
                          </RadioGroup.Item>
                          <Smartphone className="w-5 h-5" />
                          <div className="flex-1">
                            <p>UPI Payment</p>
                            <p className="text-sm text-muted-foreground">
                              Pay using Google Pay, PhonePe, Paytm
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <RadioGroup.Item
                            value="card"
                            className="w-5 h-5 border-2 border-border rounded-full flex items-center justify-center data-[state=checked]:border-primary"
                          >
                            <RadioGroup.Indicator className="w-3 h-3 bg-primary rounded-full" />
                          </RadioGroup.Item>
                          <CreditCard className="w-5 h-5" />
                          <div className="flex-1">
                            <p>Credit/Debit Card</p>
                            <p className="text-sm text-muted-foreground">
                              Visa, Mastercard, Rupay
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <RadioGroup.Item
                            value="netbanking"
                            className="w-5 h-5 border-2 border-border rounded-full flex items-center justify-center data-[state=checked]:border-primary"
                          >
                            <RadioGroup.Indicator className="w-3 h-3 bg-primary rounded-full" />
                          </RadioGroup.Item>
                          <Building2 className="w-5 h-5" />
                          <div className="flex-1">
                            <p>Net Banking</p>
                            <p className="text-sm text-muted-foreground">
                              All major banks supported
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <RadioGroup.Item
                            value="cod"
                            className="w-5 h-5 border-2 border-border rounded-full flex items-center justify-center data-[state=checked]:border-primary"
                          >
                            <RadioGroup.Indicator className="w-3 h-3 bg-primary rounded-full" />
                          </RadioGroup.Item>
                          <Banknote className="w-5 h-5" />
                          <div className="flex-1">
                            <p>Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Pay when you receive
                            </p>
                          </div>
                        </label>
                      </div>
                    </RadioGroup.Root>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <h3>Order Summary</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} x {item.quantity}
                          </span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-3 space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>
                          {deliveryFee === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            formatCurrency(deliveryFee)
                          )}
                        </span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between text-lg">
                          <span>Total</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Place Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
