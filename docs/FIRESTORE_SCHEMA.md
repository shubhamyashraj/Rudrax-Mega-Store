# Firestore Collection Schema

The Firestore database leverages a normalized document model across six primary collections:

### 1. `products`
```json
{
  "id": "prod-1",
  "name": "Celeste Ceiling Fan",
  "brand": "Havells",
  "category": "Electronics",
  "subCategory": "Fans",
  "description": "...",
  "image": "...",
  "seoKeywords": "...",
  "rating": 4.8,
  "reviewsCount": 24,
  "specifications": {
    "Voltage": "220V",
    "Power": "75W"
  },
  "variants": [
    { "id": "var-1a", "name": "White 1200mm", "sku": "RDX-FAN-WHT", "barcode": "89020" }
  ]
}
```

### 2. `batches`
```json
{
  "id": "BAT-001",
  "productId": "prod-1",
  "variantId": "var-1a",
  "quantity": 10,
  "costPrice": 1800,
  "sellingPrice": 2200,
  "mfgDate": "2026-01-10",
  "expiryDate": "2028-01-10",
  "isActive": true
}
```

### 3. `orders`
- Stores all transaction items, tax invoices, shipping metrics, and chronological carrier events.

### 4. `returns`
- Handles reverse-logistics approval workflows with active batch restock tracking.

### 5. `coupons`
- Governs shopping cart promotion strategies and minimum checkout limits.

### 6. `settings`
- Maintains storewide attributes such as delivery parameters, TAX levels, and name identifiers.
