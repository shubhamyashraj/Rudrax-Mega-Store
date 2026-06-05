import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, ReturnRequest, ReturnStatus, ReturnInventoryAction, ShippingAddress } from '../models/types';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { useProduct } from './ProductContext';
import { useInventory } from './InventoryContext';
import { useCart } from './CartContext';
import { useCustomer } from './CustomerContext';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { collection, onSnapshot, setDoc, query, where, doc, updateDoc } from 'firebase/firestore';

interface OrderContextType {
  orders: Order[];
  returns: ReturnRequest[];
  placeOrder: (
    address: ShippingAddress,
    deliveryOption: string,
    paymentMethod: Order['paymentMethod'],
    couponCode?: string
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note: string) => Promise<void>;
  requestReturn: (orderId: string, productId: string, variantId: string, quantity: number, reason: string) => Promise<void>;
  processReturnRequest: (returnId: string, status: ReturnStatus, invAction: ReturnInventoryAction) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const { products, coupons } = useProduct();
  const { batches } = useInventory();
  const { cart, clearCart } = useCart();
  const { loyaltyPoints, setLoyaltyPoints } = useCustomer();

  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);

  // 1. Synchronize Orders
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    const isAdminUser = currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' || currentUser.role === 'Staff' || currentUser.role === 'OrderManager' || currentUser.role === 'InventoryManager';
    const ordersQuery = isAdminUser
      ? collection(db, 'orders')
      : query(collection(db, 'orders'), where('customerEmail', '==', currentUser.email));

    const unsub = onSnapshot(ordersQuery, (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Order);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsub();
  }, [currentUser]);

  // 2. Synchronize Returns
  useEffect(() => {
    if (!currentUser) {
      setReturns([]);
      return;
    }

    const isAdminUser = currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' || currentUser.role === 'Staff' || currentUser.role === 'OrderManager' || currentUser.role === 'InventoryManager';
    const returnsQuery = isAdminUser
      ? collection(db, 'returns')
      : query(collection(db, 'returns'), where('customerEmail', '==', currentUser.email));

    const unsub = onSnapshot(returnsQuery, (snapshot) => {
      const items: ReturnRequest[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as ReturnRequest);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReturns(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'returns');
    });

    return () => unsub();
  }, [currentUser]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return;
    const updated = {
      ...ord,
      status,
      timeline: [...ord.timeline, { status, timestamp: new Date().toISOString(), note }]
    };
    try {
      await setDoc(doc(db, 'orders', orderId), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const placeOrder = async (
    address: ShippingAddress,
    deliveryOption: string,
    paymentMethod: Order['paymentMethod'],
    couponCode?: string
  ) => {
    if (!currentUser) {
      return {
        success: false,
        error: "Login is compulsory to place an order. Please sign in to proceed."
      };
    }

    // 1. Verify Stock for all items in Cart
    for (const item of cart) {
      const prod = products.find(p => p.id === item.productId);
      const vr = prod?.variants.find(v => (v.variantId || v.id) === item.variantId);
      const totalAvailable = batches
        .filter(b => b.productId === item.productId && b.variantId === item.variantId)
        .reduce((sum, b) => sum + b.quantity, 0);

      if (!prod || !vr || totalAvailable < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for SKU: ${vr?.sku || item.variantId}. Available: ${totalAvailable}, Requested: ${item.quantity}`
        };
      }
    }

    // 2. FIFO Stock deduction & build order items records
    const orderItems: Order['items'] = [];
    const modifiedBatches = [...batches];
    let subtotal = 0;

    for (const item of cart) {
      let remainingToDeduct = item.quantity;
      const itemBatches = modifiedBatches
        .filter(b => b.productId === item.productId && b.variantId === item.variantId && b.quantity > 0)
        .sort((a, b) => new Date(a.mfgDate).getTime() - new Date(b.mfgDate).getTime());

      for (const batch of itemBatches) {
        if (remainingToDeduct <= 0) break;
        const batchIndexInMain = modifiedBatches.findIndex(mb => mb.id === batch.id);

        if (batch.quantity >= remainingToDeduct) {
          modifiedBatches[batchIndexInMain] = {
            ...batch,
            quantity: batch.quantity - remainingToDeduct
          };

          orderItems.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: remainingToDeduct,
            purchasePrice: batch.sellingPrice,
            batchId: batch.id
          });

          subtotal += remainingToDeduct * batch.sellingPrice;
          remainingToDeduct = 0;
        } else {
          const quantityTaken = batch.quantity;
          modifiedBatches[batchIndexInMain] = {
            ...batch,
            quantity: 0
          };

          orderItems.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: quantityTaken,
            purchasePrice: batch.sellingPrice,
            batchId: batch.id
          });

          subtotal += quantityTaken * batch.sellingPrice;
          remainingToDeduct -= quantityTaken;
        }
      }
    }

    // 3. Calculators
    const taxRate = settings.defaultTaxRate;
    const calculatedTax = parseFloat(((subtotal * taxRate) / 100).toFixed(2));

    let discount = 0;
    if (couponCode) {
      const activeCoupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
      if (activeCoupon && subtotal >= activeCoupon.minOrderValue) {
        discount = parseFloat(((subtotal * activeCoupon.discountPercent) / 100).toFixed(2));
      }
    }

    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const finalTotal = parseFloat((subtotal + calculatedTax + shippingFee - discount).toFixed(2));

    // 4. Record new Order
    const newOrderId = `RDX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: newOrderId,
      orderId: newOrderId,
      customerId: currentUser.uid,
      customerEmail: currentUser.email,
      customerName: currentUser.name || "Valued Customer",
      customerPhone: currentUser.phone || address.phone || "+91 98765 43210",
      shippingAddress: address,
      deliveryOption,
      items: orderItems,
      subtotal,
      tax: calculatedTax,
      shippingFee,
      discount,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'Pending',
      status: "Pending",
      timeline: [
        { status: "Pending", timestamp: new Date().toISOString(), note: "Invoice generated successfully. Awaiting operator confirmation." }
      ],
      createdAt: new Date().toISOString(),
      couponUsed: couponCode
    };

    try {
      // Deduct stock in Firestore
      for (const mb of modifiedBatches) {
        const orig = batches.find(o => o.id === mb.id);
        if (orig && orig.quantity !== mb.quantity) {
          await setDoc(doc(db, 'batches', mb.id), mb);
        }
      }
      // Save order to Firestore
      await setDoc(doc(db, 'orders', newOrderId), newOrder);

      // Create an inventory transaction tracking item for OUT
      for (const item of orderItems) {
        const trId = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
        await setDoc(doc(db, 'inventoryTransactions', trId), {
          transactionId: trId,
          type: 'OUT',
          variantId: item.variantId,
          batchId: item.batchId,
          quantity: item.quantity,
          userId: currentUser.uid,
          timestamp: new Date().toISOString(),
          reason: `Customer Purchase. Order ID: ${newOrderId}`
        });
      }

    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${newOrderId}`);
      return { success: false, error: "Firebase transaction failed. Try again." };
    }

    // Add loyalty points to Firestore and local fallback
    const earnedPoints = Math.floor(finalTotal * (settings.loyaltyPointsPerDollar / 100));
    const nextPoints = loyaltyPoints + earnedPoints;

    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        loyaltyPoints: nextPoints,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error updating points in Firestore: ", e);
    }

    setLoyaltyPoints(nextPoints);
    localStorage.setItem('rdx_points_v1', String(nextPoints));

    clearCart();
    return { success: true, orderId: newOrderId };
  };

  const requestReturn = async (orderId: string, productId: string, variantId: string, quantity: number, reason: string) => {
    if (!currentUser) return;

    const exists = returns.some(r => r.orderId === orderId && r.productId === productId && r.variantId === variantId);
    if (exists) return;

    const orderRef = orders.find(o => o.id === orderId);
    if (!orderRef) return;

    const matchItem = orderRef.items.find(i => i.productId === productId && i.variantId === variantId);
    if (!matchItem) return;

    const refundAmount = parseFloat((matchItem.purchasePrice * quantity).toFixed(2));
    const retId = `RET-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRequest: ReturnRequest = {
      id: retId,
      returnId: retId,
      orderId,
      customerId: currentUser.uid,
      productId,
      variantId,
      quantity,
      reason,
      status: "Pending",
      inventoryAction: "None",
      refundAmount,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'returns', newRequest.id), newRequest);
      // update order return flag
      await setDoc(doc(db, 'orders', orderId), { ...orderRef, returnRequested: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `returns/${newRequest.id}`);
    }
  };

  const processReturnRequest = async (returnId: string, status: ReturnStatus, invAction: ReturnInventoryAction) => {
    if (!currentUser) return;

    const itemTarget = returns.find(r => r.id === returnId);
    if (!itemTarget) return;

    const updatedRet = {
      ...itemTarget,
      status,
      inventoryAction: invAction,
      processedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'returns', returnId), updatedRet);

      if (status === "Closed" && invAction !== "None") {
        if (invAction === "Restored") {
          const batchTarget = batches.find(b => b.productId === itemTarget.productId && b.variantId === itemTarget.variantId && b.isActive);
          if (batchTarget) {
            await setDoc(doc(db, 'batches', batchTarget.id), {
              ...batchTarget,
              quantity: batchTarget.quantity + itemTarget.quantity
            });
          } else {
            const firstAvailableIndex = batches.findIndex(b => b.productId === itemTarget.productId && b.variantId === itemTarget.variantId);
            if (firstAvailableIndex > -1) {
              const b = batches[firstAvailableIndex];
              await setDoc(doc(db, 'batches', b.id), {
                ...b,
                quantity: b.quantity + itemTarget.quantity
              });
            }
          }

          // Create an inventory transaction tracking item for RETURN/IN
          const trId = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
          await setDoc(doc(db, 'inventoryTransactions', trId), {
            transactionId: trId,
            type: 'RETURN',
            variantId: itemTarget.variantId,
            batchId: batches.find(b => b.productId === itemTarget.productId && b.variantId === itemTarget.variantId)?.id || 'unknown',
            quantity: itemTarget.quantity,
            userId: currentUser.uid,
            timestamp: new Date().toISOString(),
            reason: `Restored returned inventory to stock. Return ID: ${returnId}`
          });
        }
        await updateOrderStatus(itemTarget.orderId, 'Returned', `Return approved. Refund of ₹${itemTarget.refundAmount} initialized via original payment mode.`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `returns/${returnId}`);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      returns,
      placeOrder,
      updateOrderStatus,
      requestReturn,
      processReturnRequest
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
}
