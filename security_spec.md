# Security Specification - Rudrax Retail Suite

## 1. Data Invariants

- **A product cannot be added or edited except by authenticated Administrators.** Customers only have read access to products.
- **A batch cannot be created, edited, or deleted except by authenticated Administrators.** Customers only have read access to batches so they can see aggregate stock and active selling prices.
- **An order can only be created by the authenticated user who owns it** (i.e. where the customer email or uid equals the logged-in user).
- **An order's status and timeline can only be updated by Administrators.** Customers cannot shortcut their order state (e.g., marking a package as Delivered or Completed).
- **A return request can only be submitted for existing, valid orders** and must be initiated by the owner of that order.
- **Rules must validate types and sizes.** ID fields down to variant IDs must be alphanumeric and properly sized to lock out Denial of Wallet memory/cycles leaks.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads represent real malicious requests designed to breach integrity and bypass business rules. They must be strictly blocks and return `PERMISSION_DENIED`.

1. **Spoofed Product Insertion (Client Injecting Products)**
   - Type: Bypass Roles
   - Goal: Non-admins trying to create new grocery products or items directly.
2. **Infinite Inventory Injection (Forged Batch Quantity)**
   - Type: Bypass Roles
   - Goal: Non-admins editing batch counts to forge available stock.
3. **Price Poisoning (Setting sellingPrice to ₹0)**
   - Type: Integrity Abuse
   - Goal: Non-admins modifying a batch's selling price to purchase products for free.
4. **Order State Shortcutting (Self-marking order as Completed/Delivered)**
   - Type: State Lock Modification
   - Goal: Forcing an order status to "Delivered" or "Completed" via client-side patch request to bypass paying.
5. **Billing Spoofing (Order creation with mismatched Total)**
   - Type: Financial Tampering
   - Goal: Submitting a successful payment order with a total price modified to ₹0.
6. **Timeline Forgery (Appending custom timeline milestones)**
   - Type: State Bypass
   - Goal: Inserting a timeline event stating "Order approved with 100% refund" to trick operators.
7. **Ad-hoc Coupon Creation (Infinite 100% Promo Coupons)**
   - Type: Role Privilege Escalation
   - Goal: Regular customers injecting active coupons with 100% discount.
8. **Owner Identity Spoofing (Hijacking other profiles)**
   - Type: Verification Failure
   - Goal: Creating an order with `customerEmail: admin@rudrax.com` from a regular customer account.
9. **Return Request Inflation (Refund amount higher than purchase price)**
   - Type: Identity & Value Poisoning
   - Goal: Regular customer registering a return request with a massive refund amount (e.g. ₹999,999).
10. **Immutable Field Tampering (Changing product's core details on update)**
    - Type: Integrity Abuse
    - Goal: Customers trying to rewrite product names or brands during client calls.
11. **Path Variable ID Injection (Extremely large ID exploitation)**
    - Type: Denial of Wallet / Crash
    - Goal: Creating an entity with an ID that has a 1MB string to exhaust Firestore memory.
12. **Unverified Email Signup Privileges (Privilege Escalation)**
    - Type: Spoof Attack and Verification Failure
    - Goal: Using an unverified email with standard claims matching an admin domain to gain write privileges.

---

## 3. Test Cases Configuration

The fortress security rules are implemented inside `/firestore.rules` and verified through our internal test runner to ensure Zero-Trust compliance. Allow update/write only if validated.
