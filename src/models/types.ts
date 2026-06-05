// Project Name: Rudrax Mega Store
// Brand Name: Rudrax
// Platform Type: Multi-category Ecommerce Platform

export type UserRole = 'Customer' | 'Staff' | 'InventoryManager' | 'OrderManager' | 'Admin' | 'SuperAdmin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  loyaltyPoints: number;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  addressId?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string; // upgraded
  zipCode?: string; // backwards compatibility mapping
  country?: string;
  landmark?: string;
  addressType?: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface Variant {
  id: string; // existing
  variantId?: string; // upgraded
  productId?: string;
  name: string; // existing, e.g. "1kg", "5kg", "500g"
  sku: string; // existing SKU code
  barcode: string; // existing Barcode number
  qrcode?: string; // upgraded
  stock: number; // existing Aggregate stock
  attributes?: Record<string, string>; // upgraded
  mrp?: number; // upgraded
  sellingPrice?: number; // upgraded
  costPrice?: number; // upgraded
  activeBatchId?: string; // upgraded
  totalStock?: number; // upgraded
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out Of Stock'; // upgraded
}

export interface Product {
  id: string; // existing
  name: string; // existing
  slug?: string; // upgraded
  brand: string; // existing
  category: string; // existing
  subCategory: string; // existing
  categoryId?: string; // upgraded
  subcategoryId?: string; // upgraded
  brandId?: string; // upgraded
  vendorId?: string; // upgraded
  description: string; // existing
  image: string; // existing, main image
  images?: string[]; // upgraded, multiple images
  rating: number; // existing
  reviewsCount: number; // existing
  variants: Variant[]; // existing, inline list
  seoKeywords: string; // existing
  specifications: Record<string, string>; // existing
  status?: 'Active' | 'Inactive'; // upgraded
  visibility?: 'Public' | 'Hidden'; // upgraded
  tags?: string[]; // upgraded
  createdAt?: string; // upgraded
  updatedAt?: string; // upgraded
  createdBy?: string; // upgraded
  updatedBy?: string; // upgraded
}

export interface Batch {
  id: string; // existing
  batchId?: string; // upgraded
  productId: string; // existing
  variantId: string; // existing
  purchasePrice: number; // existing
  costPrice?: number; // upgraded
  sellingPrice: number; // existing
  quantity: number; // existing, available in batch
  initialQuantity: number; // existing
  reservedQty?: number; // upgraded
  damagedQty?: number; // upgraded
  returnedQty?: number; // upgraded
  availableQty?: number; // upgraded
  mfgDate: string; // existing
  expiryDate: string; // existing
  purchaseDate?: string; // upgraded
  taxPercent: number; // existing
  hsnCode: string; // existing
  supplier: string; // existing
  isActive: boolean; // existing
  status?: 'Fresh' | 'Expiring' | 'Expired' | 'Damaged' | 'Returned'; // upgraded
}

export interface InventoryTransaction {
  transactionId: string;
  type: 'IN' | 'OUT' | 'ADJUST' | 'RETURN';
  variantId: string;
  batchId: string;
  quantity: number;
  userId: string;
  timestamp: string;
  reason: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out For Delivery' | 'Delivered' | 'Cancelled' | 'Returned' | 'Completed';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  purchasePrice: number;
  batchId: string;
}

export interface Order {
  id: string; // existing
  orderId?: string; // upgraded
  customerId?: string; // upgraded
  customerEmail: string; // existing
  customerName: string; // existing
  customerPhone: string; // existing
  shippingAddress: ShippingAddress; // upgraded type
  deliveryOption: string; // existing
  items: OrderItem[]; // existing
  subtotal: number; // existing
  tax: number; // existing
  shippingFee: number; // existing
  shippingCharge?: number; // upgraded mapping
  discount: number; // existing
  total: number; // existing
  grandTotal?: number; // upgraded mapping
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet' | 'Cash On Delivery';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed' | 'Refunded'; // child of Order
  transactionId?: string; // upgraded
  invoiceNumber?: string; // upgraded
  awbNumber?: string; // upgraded
  shipmentPartner?: string; // upgraded
  status: OrderStatus; // existing
  orderStatus?: OrderStatus; // upgraded mapping
  timeline: OrderTimeline[]; // existing
  createdAt: string; // existing
  couponUsed?: string; // existing
  returnRequested?: boolean; // existing
}

export type ReturnStatus = 'Pending' | 'Approved' | 'Picked Up' | 'Inspected' | 'Refunded' | 'Closed' | 'Confirmed';
export type ReturnInventoryAction = 'Restored' | 'Scrap' | 'None';

export interface ReturnRequest {
  id: string; // existing
  returnId?: string; // upgraded
  orderId: string; // existing
  customerId?: string; // upgraded
  productId: string; // existing
  variantId: string; // existing
  quantity: number; // existing
  reason: string; // existing
  images?: string[]; // upgraded
  pickupDate?: string; // upgraded
  pickupStatus?: 'Pending' | 'Dispatched' | 'Completed'; // upgraded
  inspectionStatus?: 'Pending' | 'Passed' | 'Failed'; // upgraded
  refundStatus?: 'Pending' | 'Approved' | 'Refunded'; // upgraded
  status: ReturnStatus; // existing
  inventoryAction: ReturnInventoryAction; // existing
  refundAmount: number; // existing
  createdAt: string; // existing
  processedAt?: string; // existing
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
  bootstrapComplete?: boolean;
}

export interface StoreAnalytics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockAlerts: number;
  salesByDate: Record<string, number>;
}
