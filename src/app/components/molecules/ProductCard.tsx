import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Rating } from '../atoms/Rating';
import { Price } from '../atoms/Price';
import { StockBadge } from '../atoms/StockBadge';
import { DiscountBadge } from '../atoms/DiscountBadge';

export interface Product {
  id: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onWishlist,
  onQuickView,
  onClick
}: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image Section */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => onClick?.(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <DiscountBadge percentage={discountPercentage} size="sm" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWishlist(product);
              }}
              className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        )}

        {/* Name */}
        <h3
          className="font-medium text-sm line-clamp-2 mb-2 cursor-pointer hover:text-primary"
          onClick={() => onClick?.(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-2">
          <Rating
            rating={product.rating}
            size="sm"
            showNumber={false}
            reviewCount={product.reviewCount}
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <Price
            price={product.price}
            originalPrice={product.originalPrice}
            size="sm"
            showDiscount={false}
          />
        </div>

        {/* Stock Badge */}
        <div className="mb-3">
          <StockBadge stock={product.stock} />
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
