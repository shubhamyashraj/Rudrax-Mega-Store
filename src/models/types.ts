export interface Variant {
  id: string;
  name: string; // e.g., "1kg", "5kg", "500g"
  sku: string; // SKU code
  barcode: string; // Barcode number
  stock: number; // Aggregate stock from all batches
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  variants: Variant[];
  seoKeywords: string;
  specifications: Record<string, string>;
}

export interface Batch {
  id: string; // e.g., "BATCH-A1"
  productId: string;
  variantId: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number; // Remaining qty in this batch
  initialQuantity: number; // For analytics
  mfgDate: string;
  expiryDate: string;
  taxPercent: number; // e.g. 18
  hsnCode: string; // e.g. 10063010
  supplier: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out For Delivery' | 'Delivered' | 'Returned' | 'Completed';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string; // e.g., "RDX-60421"
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  deliveryOption: string; // e.g., "Standard", "Express"
  items: {
    productId: string;
    variantId: string;
    quantity: number;
    purchasePrice: number; // At time of purchase (selling price of the batch used)
    batchId: string; // Specific batch drawn from (FIFO)
  }[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet' | 'Cash On Delivery';
  status: OrderStatus;
  timeline: OrderTimeline[];
  createdAt: string;
  couponUsed?: string;
  returnRequested?: boolean;
}

export type ReturnStatus = 'Pending' | 'Confirmed' | 'Picked Up' | 'Refunded' | 'Closed';
export type ReturnInventoryAction = 'Restored' | 'Scrap' | 'None';

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  quantity: number;
  reason: string;
  status: ReturnStatus;
  inventoryAction: ReturnInventoryAction;
  refundAmount: number;
  createdAt: string;
  processedAt?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  expiryDate: string;
}

export interface SystemSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  defaultTaxRate: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  loyaltyPointsPerDollar: number;
}
