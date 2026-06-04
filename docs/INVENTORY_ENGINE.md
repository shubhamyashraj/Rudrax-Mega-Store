# FIFO Inventory System & Expiry Engine

Rudrax operates on a strict **First-In, First-Out (FIFO)** selling mechanism to prevent stock spoilage, prioritize oldest physical batches, and ensure accurate cost-of-goods-sold calculations.

## Architectural Flow
1. **Dynamic Priority Queue**:
   - For every product variant SKU requested, the engine pools all batches with quantity > 0.
   - Sorts chronologically ascending by `mfgDate` or `packagingDate`.
   - The first element of this sorted index receives the priority flag `isActive` set to true.
2. **Order Stock Allocation**:
   - Order matching iterates systematically over the priority batch queue.
   - Full or partial quantity is deducted from the oldest active batch.
   - If a batch hits 0, the next chronological batch immediately inherits active priority.
3. **Return Restocking**:
   - Approved items can be returned to inventory. The allocator automatically restocks the returned unit count back into the active batch.
