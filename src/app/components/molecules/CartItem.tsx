import { Minus, Plus, Trash2 } from 'lucide-react';
import { Price } from '../atoms/Price';

export interface CartItemType {
  id: string;
  productId: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  stock: number;
}

interface CartItemProps {
  item: CartItemType;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onMoveToWishlist?: (id: string) => void;
}

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onMoveToWishlist
}: CartItemProps) {
  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      onQuantityChange?.(item.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange?.(item.id, item.quantity - 1);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex gap-4">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Brand */}
        <div className="mb-2">
          {item.brand && (
            <p className="text-xs text-muted-foreground">{item.brand}</p>
          )}
          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
          {item.variant && (
            <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <Price
            price={item.price}
            originalPrice={item.originalPrice}
            size="sm"
            showDiscount={false}
          />
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="font-bold text-lg">
            ₹{subtotal.toFixed(2)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-3">
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="text-sm text-danger hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          )}
          {onMoveToWishlist && (
            <button
              onClick={() => onMoveToWishlist(item.id)}
              className="text-sm text-primary hover:underline"
            >
              Move to Wishlist
            </button>
          )}
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="text-xs text-warning mt-2">
            Maximum available quantity: {item.stock}
          </p>
        )}
      </div>
    </div>
  );
}
