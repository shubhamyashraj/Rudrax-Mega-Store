import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { orders } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Search, Eye, Mail, Phone } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const customers = Array.from(
    new Map(
      orders.map((order) => [
        order.customerId,
        {
          id: order.customerId,
          name: order.customerName,
          email: `${order.customerName.toLowerCase().replace(" ", ".")}@example.com`,
          phone: "+91 98765 43210",
          joinDate: "2026-01-15",
          totalOrders: orders.filter((o) => o.customerId === order.customerId).length,
          totalSpent: orders
            .filter((o) => o.customerId === order.customerId)
            .reduce((sum, o) => sum + o.total, 0),
          lastOrder: orders
            .filter((o) => o.customerId === order.customerId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date,
        },
      ])
    ).values()
  );

  const filteredCustomers = Array.from(customers).filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewCustomer = (customer: any) => {
    const customerOrders = orders.filter((o) => o.customerId === customer.id);
    setSelectedCustomer({ ...customer, orders: customerOrders });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Customers</h1>
        <p className="text-muted-foreground">Manage customer relationships</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Customers</div>
            <div className="text-3xl">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Active This Month</div>
            <div className="text-3xl">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Average Order Value</div>
            <div className="text-3xl">
              {formatCurrency(
                orders.reduce((sum, o) => sum + o.total, 0) / orders.length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm">Customer</th>
                  <th className="px-6 py-3 text-left text-sm">Contact</th>
                  <th className="px-6 py-3 text-left text-sm">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm">Orders</th>
                  <th className="px-6 py-3 text-left text-sm">Total Spent</th>
                  <th className="px-6 py-3 text-left text-sm">Last Order</th>
                  <th className="px-6 py-3 text-right text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(customer.joinDate)}</td>
                    <td className="px-6 py-4 text-sm">{customer.totalOrders}</td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(customer.totalSpent)}</td>
                    <td className="px-6 py-4 text-sm">{formatDate(customer.lastOrder)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            {selectedCustomer && (
              <>
                <Dialog.Title className="text-xl mb-4">Customer Details</Dialog.Title>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p>{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Customer ID</p>
                      <p className="text-sm">{selectedCustomer.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="text-sm">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Join Date</p>
                      <p className="text-sm">{formatDate(selectedCustomer.joinDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                      <p className="text-sm">{selectedCustomer.totalOrders}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                      <span className="text-2xl">{formatCurrency(selectedCustomer.totalSpent)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Order History</p>
                    <div className="space-y-2">
                      {selectedCustomer.orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="flex justify-between items-center p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatCurrency(order.total)}</p>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "success"
                                  : order.status === "cancelled"
                                  ? "error"
                                  : "info"
                              }
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => setDialogOpen(false)} className="w-full">
                    Close
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
