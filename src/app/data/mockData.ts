export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  inStock: boolean;
  variants?: { name: string; options: string[] }[];
  specifications?: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
  items: { productId: string; name: string; quantity: number; price: number; variant?: string }[];
  total: number;
  address: string;
  paymentMethod: string;
}

export interface InventoryBatch {
  batchId: string;
  productId: string;
  variantId: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  supplier: string;
  isActive: boolean;
}

export const categories: Category[] = [
  { id: "1", name: "Groceries", icon: "🛒", image: "https://images.unsplash.com/photo-1542838132-92c53300491e" },
  { id: "2", name: "Fruits & Vegetables", icon: "🥬", image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c" },
  { id: "3", name: "Dairy & Eggs", icon: "🥛", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da" },
  { id: "4", name: "Beverages", icon: "🥤", image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22" },
  { id: "5", name: "Snacks", icon: "🍪", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087" },
  { id: "6", name: "Personal Care", icon: "🧴", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03" },
  { id: "7", name: "Home Care", icon: "🧹", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba" },
  { id: "8", name: "Baby Care", icon: "👶", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Basmati Rice Premium",
    category: "Groceries",
    brand: "India Gate",
    price: 899,
    originalPrice: 1099,
    discount: 18,
    rating: 4.5,
    reviewCount: 1243,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
    ],
    description: "Premium quality aged basmati rice with extra long grains. Perfect for biryanis and pulaos.",
    inStock: true,
    variants: [{ name: "Weight", options: ["1kg", "5kg", "10kg"] }],
    specifications: {
      "Brand": "India Gate",
      "Type": "Basmati Rice",
      "Origin": "India",
      "Shelf Life": "12 months",
    },
  },
  {
    id: "2",
    name: "Fresh Organic Milk",
    category: "Dairy & Eggs",
    brand: "Amul",
    price: 62,
    rating: 4.7,
    reviewCount: 2341,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b",
    ],
    description: "Farm fresh organic milk, rich in calcium and proteins. 100% pure and unadulterated.",
    inStock: true,
    variants: [{ name: "Size", options: ["500ml", "1L", "2L"] }],
    specifications: {
      "Brand": "Amul",
      "Fat Content": "Full Cream",
      "Type": "Organic",
      "Shelf Life": "3 days",
    },
  },
  {
    id: "3",
    name: "Red Onions",
    category: "Fruits & Vegetables",
    brand: "Fresh Farms",
    price: 45,
    rating: 4.3,
    reviewCount: 543,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb",
    images: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb",
    ],
    description: "Fresh red onions sourced directly from farms. Rich in flavor and nutrients.",
    inStock: true,
    variants: [{ name: "Weight", options: ["500g", "1kg", "2kg"] }],
    specifications: {
      "Type": "Red Onions",
      "Origin": "India",
      "Organic": "No",
    },
  },
  {
    id: "4",
    name: "Coca Cola Soft Drink",
    category: "Beverages",
    brand: "Coca Cola",
    price: 80,
    originalPrice: 100,
    discount: 20,
    rating: 4.6,
    reviewCount: 3421,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7",
    images: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7",
    ],
    description: "Refreshing carbonated soft drink. Perfect for any occasion.",
    inStock: true,
    variants: [{ name: "Size", options: ["250ml", "500ml", "1L", "2L"] }],
    specifications: {
      "Brand": "Coca Cola",
      "Type": "Carbonated Drink",
      "Sugar Content": "10.6g per 100ml",
    },
  },
  {
    id: "5",
    name: "Potato Chips Classic Salted",
    category: "Snacks",
    brand: "Lays",
    price: 20,
    rating: 4.4,
    reviewCount: 5234,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
    images: [
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
    ],
    description: "Crispy and crunchy potato chips with perfect salt seasoning.",
    inStock: true,
    variants: [{ name: "Size", options: ["25g", "50g", "100g"] }],
    specifications: {
      "Brand": "Lays",
      "Flavor": "Classic Salted",
      "Shelf Life": "6 months",
    },
  },
  {
    id: "6",
    name: "Dove Shampoo",
    category: "Personal Care",
    brand: "Dove",
    price: 285,
    originalPrice: 320,
    discount: 11,
    rating: 4.5,
    reviewCount: 1876,
    image: "https://images.unsplash.com/photo-1571781418606-70265b9cce90",
    images: [
      "https://images.unsplash.com/photo-1571781418606-70265b9cce90",
    ],
    description: "Nourishing shampoo for soft and silky hair. Suitable for all hair types.",
    inStock: true,
    variants: [{ name: "Size", options: ["180ml", "340ml", "650ml"] }],
    specifications: {
      "Brand": "Dove",
      "Hair Type": "All Hair Types",
      "Ingredients": "Natural Extracts",
    },
  },
];

export const orders: Order[] = [
  {
    id: "ORD001234",
    customerId: "CUST001",
    customerName: "Rajesh Kumar",
    date: "2026-05-28",
    status: "delivered",
    items: [
      { productId: "1", name: "Basmati Rice Premium - 5kg", quantity: 1, price: 899, variant: "5kg" },
      { productId: "2", name: "Fresh Organic Milk - 1L", quantity: 2, price: 62, variant: "1L" },
    ],
    total: 1023,
    address: "123 MG Road, Bangalore, Karnataka - 560001",
    paymentMethod: "UPI",
  },
  {
    id: "ORD001235",
    customerId: "CUST002",
    customerName: "Priya Sharma",
    date: "2026-05-30",
    status: "shipped",
    items: [
      { productId: "3", name: "Red Onions - 1kg", quantity: 2, price: 45, variant: "1kg" },
      { productId: "4", name: "Coca Cola - 2L", quantity: 3, price: 80, variant: "2L" },
    ],
    total: 330,
    address: "456 Park Street, Mumbai, Maharashtra - 400001",
    paymentMethod: "Card",
  },
  {
    id: "ORD001236",
    customerId: "CUST003",
    customerName: "Amit Patel",
    date: "2026-05-31",
    status: "pending",
    items: [
      { productId: "5", name: "Potato Chips - 100g", quantity: 5, price: 20, variant: "100g" },
      { productId: "6", name: "Dove Shampoo - 340ml", quantity: 1, price: 285, variant: "340ml" },
    ],
    total: 385,
    address: "789 Station Road, Delhi - 110001",
    paymentMethod: "Cash on Delivery",
  },
];

export const inventoryBatches: InventoryBatch[] = [
  {
    batchId: "BATCH001",
    productId: "1",
    variantId: "1kg",
    purchasePrice: 750,
    sellingPrice: 899,
    quantity: 150,
    manufacturingDate: "2026-03-15",
    expiryDate: "2027-03-15",
    supplier: "Rice Mills Ltd",
    isActive: true,
  },
  {
    batchId: "BATCH002",
    productId: "1",
    variantId: "5kg",
    purchasePrice: 3500,
    sellingPrice: 4299,
    quantity: 80,
    manufacturingDate: "2026-03-20",
    expiryDate: "2027-03-20",
    supplier: "Rice Mills Ltd",
    isActive: true,
  },
  {
    batchId: "BATCH003",
    productId: "2",
    variantId: "1L",
    purchasePrice: 48,
    sellingPrice: 62,
    quantity: 200,
    manufacturingDate: "2026-05-28",
    expiryDate: "2026-06-03",
    supplier: "Amul Dairy",
    isActive: true,
  },
  {
    batchId: "BATCH004",
    productId: "3",
    variantId: "1kg",
    purchasePrice: 32,
    sellingPrice: 45,
    quantity: 50,
    manufacturingDate: "2026-05-29",
    expiryDate: "2026-06-15",
    supplier: "Fresh Farms",
    isActive: true,
  },
];
