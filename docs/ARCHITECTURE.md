# System Architecture: Rudrax Mega Store

The system is engineered as an offline-first, client-supported web application operating on a React single-view setup that integrates serverless document storage (Google Cloud Firestore).

## Key Layers
1. **Presentation Layer (React & Vite)**:
   - Atomic design structure separating UI components, layouts, custom hooks, and state context wrappers.
   - Tailored typography utilizing visual fonts paired with a modern high-contrast aesthetic.
2. **Business Engine Layer (FIFO Inventory System)**:
   - Dynamic batch priority index using chronological sorting over manufacturing or packaging dates.
   - Stock movement controllers detailing incoming batch logistics, warehouse actions, and return cycles.
3. **Persistance Hook (Firestore Link)**:
   - Native real-time multi-document synchronization for live synchronization of core entities.
   - Declarative write-through interfaces allowing immediate client persistence and background syncing.
