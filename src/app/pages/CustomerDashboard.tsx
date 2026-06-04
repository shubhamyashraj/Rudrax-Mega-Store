import { useState } from "react";
import { Link } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { orders } from "../data/mockData";
import { formatCurrency, formatDate } from "../lib/utils";
import { User, Package, MapPin, Heart, Bell, LogOut } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  const userOrders = orders;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl mb-8">My Account</h1>

          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex gap-2 border-b border-border mb-6 overflow-x-auto">
              <Tabs.Trigger
                value="orders"
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap"
              >
                <Package className="w-4 h-4 inline mr-2" />
                Orders
              </Tabs.Trigger>
              <Tabs.Trigger
                value="profile"
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap"
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger
                value="addresses"
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Addresses
              </Tabs.Trigger>
              <Tabs.Trigger
                value="wishlist"
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap"
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Wishlist
              </Tabs.Trigger>
              <Tabs.Trigger
                value="notifications"
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap"
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Notifications
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="orders">
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="mb-1">Order {order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "success"
                                : order.status === "cancelled"
                                ? "error"
                                : "info"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="text-lg">{formatCurrency(order.total)}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-muted-foreground">
                              {item.name} x {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          Download Invoice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Tabs.Content>

            <Tabs.Content value="profile">
              <Card>
                <CardHeader>
                  <h3>Personal Information</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1 text-muted-foreground">Full Name</label>
                      <p>Rajesh Kumar</p>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-muted-foreground">Email</label>
                      <p>rajesh.kumar@example.com</p>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-muted-foreground">Phone</label>
                      <p>+91 98765 43210</p>
                    </div>
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="addresses">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3>Home</h3>
                      <Badge variant="default">Default</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      123 MG Road, Bangalore, Karnataka - 560001
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-border flex items-center justify-center">
                  <Button variant="ghost">+ Add New Address</Button>
                </Card>
              </div>
            </Tabs.Content>

            <Tabs.Content value="wishlist">
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Save your favorite products for later
                </p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            </Tabs.Content>

            <Tabs.Content value="notifications">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-4 border-b border-border">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p>Your order has been delivered</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b border-border">
                      <div className="w-2 h-2 bg-muted rounded-full mt-2" />
                      <div className="flex-1">
                        <p>Flash sale starting soon - Up to 50% off</p>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-muted rounded-full mt-2" />
                      <div className="flex-1">
                        <p>Your order is out for delivery</p>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Tabs.Content>
          </Tabs.Root>

          <Card className="mt-6">
            <CardContent className="p-6">
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
