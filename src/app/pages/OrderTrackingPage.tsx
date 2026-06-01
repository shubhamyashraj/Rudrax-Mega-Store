import { useParams, Link } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { orders } from "../data/mockData";
import { formatCurrency, formatDate } from "../lib/utils";
import { Check, Package, Truck, Home, ChevronLeft } from "lucide-react";

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const order = orders.find((o) => o.id === orderId) || {
    id: orderId || "ORD001234",
    customerId: "CUST001",
    customerName: "Guest User",
    date: new Date().toISOString().split("T")[0],
    status: "confirmed" as const,
    items: [],
    total: 0,
    address: "Sample Address",
    paymentMethod: "UPI",
  };

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: Check },
    { key: "packed", label: "Packed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ];

  const statusOrder = ["pending", "confirmed", "packed", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(order.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl mb-2">Order Tracking</h1>
            <p className="text-muted-foreground">Order ID: {order.id}</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-border">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                        <p className={`text-sm text-center ${isCompleted ? "" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <h3>Order Details</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span>{formatDate(order.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={order.status === "delivered" ? "success" : "info"}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>Delivery Address</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.customerName}</p>
                <p className="text-sm text-muted-foreground mt-2">{order.address}</p>
              </CardContent>
            </Card>
          </div>

          {order.items.length > 0 && (
            <Card>
              <CardHeader>
                <h3>Order Items</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 mt-6">
            <Link to="/dashboard" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
