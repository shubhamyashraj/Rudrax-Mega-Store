# Rudrax E-commerce Platform

A complete, production-ready e-commerce web application built with React, TypeScript, Tailwind CSS, and React Router.

## 🎯 Overview

Rudrax is a modern, full-featured e-commerce platform designed for retail customers, grocery buyers, and mobile-first users. The platform includes both customer-facing pages and a comprehensive admin panel for store operators.

## ✨ Features

### Customer Features
- **Home Page**: Hero slider, category navigation, featured products, best sellers, flash deals
- **Product Discovery**: Advanced filtering, sorting, search functionality
- **Product Details**: Image gallery, variants selection, ratings & reviews
- **Shopping Cart**: Add/remove items, quantity management, coupon codes
- **Checkout**: Multi-step checkout with address and payment options
- **Order Tracking**: Real-time order status with visual timeline
- **User Dashboard**: Profile, orders, addresses, wishlist, notifications
- **Authentication**: Login and registration pages

### Admin Features
- **Dashboard**: Sales analytics, revenue charts, inventory alerts
- **Category Management**: Create, edit, delete product categories
- **Product Management**: Full product catalog management with variants
- **Advanced Inventory**: FIFO-based batch tracking system
- **Order Management**: View, update, and track all customer orders
- **Customer Management**: Customer profiles, order history, spending analytics
- **Reports & Analytics**: Revenue trends, top products, category performance

## 🏗️ Architecture

### Frontend Stack
- **React 18.3.1**: Component-based UI
- **TypeScript**: Type-safe development
- **React Router 7**: Client-side routing with nested routes
- **Tailwind CSS v4**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization and charts
- **Sonner**: Toast notifications
- **Motion**: Smooth animations

### Project Structure
```
src/app/
├── components/
│   ├── ui/           # Reusable UI components
│   └── layout/       # Header, Footer
├── pages/            # Customer pages
│   └── admin/        # Admin panel pages
├── context/          # React context providers
├── data/             # Mock data
├── lib/              # Utility functions
└── routes.tsx        # Route configuration
```

## 📊 Data Models

### Product Structure
- Category → Product → Variants (e.g., Rice → Basmati Rice → 1kg/5kg/10kg)
- Rich product information: images, descriptions, specifications
- Rating and review counts
- Stock availability status

### Inventory Management
Advanced batch tracking with:
- Batch ID, purchase/selling prices
- Manufacturing and expiry dates
- Supplier information
- Quantity tracking
- FIFO (First-In-First-Out) methodology
- Low stock and near-expiry alerts

### Order Management
- Order statuses: Pending → Confirmed → Packed → Shipped → Delivered
- Customer information
- Payment method tracking
- Delivery address
- Order items with variants

## 🎨 Design System

### Color Palette
- **Primary**: #FF6B35 (Vibrant Orange)
- **Secondary**: #f5f5f5 (Light Gray)
- **Background**: #ffffff (White)
- **Destructive**: #dc2626 (Red)

### Components
- Buttons: Primary, Secondary, Outline, Ghost, Destructive variants
- Cards: Consistent card layouts across the platform
- Badges: Status indicators with color variants
- Inputs: Form controls with validation states
- Tables: Responsive data tables
- Dialogs: Modal windows for forms and details

## 🔄 User Flows

### Customer Journey
1. Browse products → Filter/Search → View details
2. Add to cart → Apply coupon → Checkout
3. Enter delivery address → Select payment → Place order
4. Track order → Receive delivery → Leave review

### Admin Workflow
1. Monitor dashboard → Check alerts
2. Manage inventory → Add batches → Track expiry
3. Process orders → Update status → Generate invoice
4. View reports → Analyze trends → Make decisions

## 📱 Responsive Design

- **Mobile-first**: Optimized for smartphones
- **Tablet**: Adjusted layouts for medium screens
- **Desktop**: Full-featured experience with sidebars
- **Collapsible menus**: Mobile navigation drawer

## 🔐 Payment Methods

- UPI (Google Pay, PhonePe, Paytm)
- Credit/Debit Cards (Visa, Mastercard, Rupay)
- Net Banking
- Cash on Delivery

## 📈 Analytics & Reports

- Revenue trend analysis
- Order volume tracking
- Category performance
- Top-selling products
- Customer lifetime value
- Inventory status reports

## 🚀 Getting Started

The application uses React Router for navigation. All routes are configured in `src/app/routes.tsx`:

**Customer Routes:**
- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders/:orderId` - Order tracking
- `/dashboard` - Customer dashboard
- `/login` - Login page
- `/register` - Registration page

**Admin Routes:**
- `/admin` - Admin dashboard
- `/admin/categories` - Category management
- `/admin/products` - Product management
- `/admin/inventory` - Inventory management
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/reports` - Reports & analytics

## 🎯 Key Highlights

1. **Production-Ready**: Complete implementation with all operational pages
2. **Advanced Inventory**: Unique FIFO-based batch tracking system
3. **Rich Analytics**: Comprehensive charts and business insights
4. **Mobile-Optimized**: Responsive design for all devices
5. **Type-Safe**: Full TypeScript implementation
6. **Accessible**: Built with Radix UI primitives
7. **Modern Stack**: Latest React, Router, and Tailwind versions

## 🔧 Technical Features

- **Context API**: Global cart state management
- **Mock Data**: Realistic sample data for products, orders, inventory
- **Route Guards**: Nested routes for admin panel
- **Form Validation**: Client-side validation on all forms
- **Error Handling**: 404 page and error states
- **Toast Notifications**: User feedback for actions
- **Loading States**: Smooth user experience

## 📦 Mock Data

The platform includes realistic mock data:
- **6 Products**: Across 8 categories
- **3 Sample Orders**: Different statuses
- **4 Inventory Batches**: With expiry tracking
- **8 Product Categories**: With icons and images

## 🎨 UI/UX Features

- Clean, modern design inspired by Amazon and Flipkart
- Card-based layouts for easy scanning
- Visual order tracking timeline
- Color-coded status badges
- Hover effects and transitions
- Skeleton loading states (via installed components)
- Accessible form controls

## 🔍 Search & Filter

**Product Listing Filters:**
- Category selection
- Brand filtering
- Price range slider
- Stock availability
- Sort options: Price, Rating, Discount

## 📊 Admin Dashboard Widgets

- Total Revenue with trend
- Total Orders count
- Product catalog size
- Customer base
- Low stock alerts
- Near expiry warnings
- Sales charts
- Category distribution

## 🛠️ Inventory Features

- Batch-level tracking
- FIFO inventory rotation
- Purchase vs. selling price
- Manufacturing date tracking
- Expiry date monitoring
- Supplier information
- Active batch indicators
- Stock value calculation

## 📝 Notes

- All images use Unsplash for demonstration
- Currency formatted in Indian Rupees (₹)
- Dates formatted in Indian locale
- Payment methods popular in India
- Mobile-first responsive breakpoints

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**
