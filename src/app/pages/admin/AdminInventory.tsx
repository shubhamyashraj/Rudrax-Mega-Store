import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { inventoryBatches, products } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Plus, AlertTriangle, TrendingDown, Package } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

export default function AdminInventory() {
  const [batches, setBatches] = useState(inventoryBatches);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    variantId: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
    supplier: "",
  });

  const totalStockValue = batches.reduce(
    (sum, batch) => sum + batch.purchasePrice * batch.quantity,
    0
  );
  const lowStockCount = batches.filter((batch) => batch.quantity < 50).length;
  const nearExpiryCount = batches.filter((batch) => {
    const expiryDate = new Date(batch.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays < 30 && diffDays > 0;
  }).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch = {
      batchId: `BATCH${String(batches.length + 1).padStart(3, "0")}`,
      productId: formData.productId,
      variantId: formData.variantId,
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      manufacturingDate: formData.manufacturingDate,
      expiryDate: formData.expiryDate,
      supplier: formData.supplier,
      isActive: true,
    };
    setBatches([...batches, newBatch]);
    toast.success("Batch added successfully!");
    setDialogOpen(false);
    setFormData({
      productId: "",
      variantId: "",
      purchasePrice: "",
      sellingPrice: "",
      quantity: "",
      manufacturingDate: "",
      expiryDate: "",
      supplier: "",
    });
  };

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return { label: "Expired", variant: "error" as const };
    if (diffDays < 30) return { label: `${diffDays}d left`, variant: "warning" as const };
    return { label: "Good", variant: "success" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Advanced batch tracking and FIFO management</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Batch
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Stock Value</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl mb-1">{formatCurrency(totalStockValue)}</div>
            <div className="text-xs text-muted-foreground">Across {batches.length} batches</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Low Stock Alerts</span>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl mb-1">{lowStockCount}</div>
            <div className="text-xs text-muted-foreground">Items below 50 units</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Near Expiry</span>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-3xl mb-1">{nearExpiryCount}</div>
            <div className="text-xs text-muted-foreground">Expires within 30 days</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3>Batch Inventory</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm">Batch ID</th>
                  <th className="px-6 py-3 text-left text-sm">Product</th>
                  <th className="px-6 py-3 text-left text-sm">Variant</th>
                  <th className="px-6 py-3 text-left text-sm">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm">Purchase Price</th>
                  <th className="px-6 py-3 text-left text-sm">Selling Price</th>
                  <th className="px-6 py-3 text-left text-sm">Mfg Date</th>
                  <th className="px-6 py-3 text-left text-sm">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {batches.map((batch) => {
                  const expiryStatus = getExpiryStatus(batch.expiryDate);
                  return (
                    <tr key={batch.batchId} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{batch.batchId}</span>
                          {batch.isActive && (
                            <Badge variant="success" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{getProductName(batch.productId)}</td>
                      <td className="px-6 py-4 text-sm">{batch.variantId}</td>
                      <td className="px-6 py-4 text-sm">{batch.supplier}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{batch.quantity}</span>
                          {batch.quantity < 50 && (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatCurrency(batch.purchasePrice)}</td>
                      <td className="px-6 py-4 text-sm">{formatCurrency(batch.sellingPrice)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(batch.manufacturingDate)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(batch.expiryDate)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3>FIFO Inventory Management</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The system automatically follows First-In-First-Out (FIFO) methodology for inventory management:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Oldest batches are sold first based on manufacturing date</li>
              <li>Active batch indicator shows which batch is currently being sold</li>
              <li>Low stock alerts trigger when batch quantity falls below 50 units</li>
              <li>Near expiry alerts for products expiring within 30 days</li>
              <li>Automatic batch rotation ensures minimal wastage</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            <Dialog.Title className="text-xl mb-4">Add New Batch</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Product</label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Variant"
                  value={formData.variantId}
                  onChange={(e) => setFormData({ ...formData, variantId: e.target.value })}
                  placeholder="e.g., 1kg, 500ml"
                  required
                />
                <Input
                  label="Purchase Price"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  required
                />
                <Input
                  label="Selling Price"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  required
                />
                <Input
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
                <Input
                  label="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  required
                />
                <Input
                  label="Manufacturing Date"
                  type="date"
                  value={formData.manufacturingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturingDate: e.target.value })
                  }
                  required
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Add Batch
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
