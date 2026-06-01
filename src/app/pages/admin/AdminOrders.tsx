import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { orders } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Search, Eye } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

export default function AdminOrders() {
  const [ordersList, setOrdersList] = useState(orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredOrders = ordersList.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrdersList(
      ordersList.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      )
    );
    toast.success("Order status updated!");
  };

  const viewOrder = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer name..."
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
                  <th className="px-6 py-3 text-left text-sm">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm">Customer</th>
                  <th className="px-6 py-3 text-left text-sm">Date</th>
                  <th className="px-6 py-3 text-left text-sm">Items</th>
                  <th className="px-6 py-3 text-left text-sm">Total</th>
                  <th className="px-6 py-3 text-left text-sm">Payment</th>
                  <th className="px-6 py-3 text-left text-sm">Status</th>
                  <th className="px-6 py-3 text-right text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(order.date)}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4 text-sm">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <select
                        className="h-8 px-2 rounded border border-border text-sm"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewOrder(order)}
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
            {selectedOrder && (
              <>
                <Dialog.Title className="text-xl mb-4">Order Details</Dialog.Title>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <p>{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date</p>
                      <p>{formatDate(selectedOrder.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Customer</p>
                      <p>{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge
                        variant={
                          selectedOrder.status === "delivered"
                            ? "success"
                            : selectedOrder.status === "cancelled"
                            ? "error"
                            : "info"
                        }
                      >
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Delivery Address</p>
                    <p className="text-sm">{selectedOrder.address}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Order Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                      <span className="text-sm">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
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
