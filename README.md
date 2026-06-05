# Rudrax Mega Store

A premium, production-ready Multi-category Ecommerce Platform built with unified state architecture, real-time Firestore database writes, sequential FIFO inventory engines, and comprehensive back-office operations.

## Project Scope
- **Project Name**: Rudrax Mega Store
- **Brand Name**: Rudrax
- **Platform Type**: Multi-category Ecommerce Platform

## Core Operational Features
- **Branding & Visuals**: Slate accents and elegant modern typography.
- **Single Source of Truth Routing**: Uses modern React Router bindings (`useNavigate`, `useLocation`) eliminating overlapping state-synchronizer effects.
- **Advanced Context Architecture**: Separated into 7 specialized contexts:
  - `SettingsContext`: System configs & shipping standard pricing definitions.
  - `AuthContext`: Operator & customer firebase authentications with SuperAdmin bootstrap detectors.
  - `ProductContext`: General catalog indices & coupon parameters.
  - `InventoryContext`: Chronological procurement batches & low-stock warnings.
  - `CartContext`: In-memory local storage caches with quantity thresholds.
  - `CustomerContext`: Address lists & client profiles directory syncing.
  - `OrderContext`: Strict inventory write transactions & returning modules.
- **Sequential FIFO Consumption**: Auto-sorts existing batches chronologically by manufacturing date to target first-in, first-out stock draw.
- **Return Processing & Inventory Actions**: Supports return claim creations with RESTORE-TO-STOCK or SCRAP item disposition selections.

---

## Migration Architecture Notes

### Refactoring Navigation
- Removed manual `RouteSync` refs.
- Derived `activePage` and `activeAdminTab` dynamically from URL segments (`location.pathname`).
- Consolidated navigation setters to invoke direct Router mappings (`navigate(...)`).

### Decoupling States
- Separated standard `StateContext.tsx` into 7 modular, nested contexts to avoid circular dependencies.
- Calculated variant aggregate quantities dynamically at render-time, completely preventing infinite document writing loops.

### Type Upgrades
- Added `Variant`, `Product`, `Batch`, and `Order` attributes such as `postalCode`, `taxPercent`, `variantId`, `mrp`, and `qrcode` while retaining complete backwards compatibility with existing seeds for immediate compile success.
