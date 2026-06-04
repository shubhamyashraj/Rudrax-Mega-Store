import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  size?: 'sm' | 'md';
}

export function StockBadge({
  stock,
  lowStockThreshold = 10,
  size = 'sm'
}: StockBadgeProps) {
  const sizeClasses = {
    sm: { text: 'text-xs', icon: 'w-3 h-3' },
    md: { text: 'text-sm', icon: 'w-4 h-4' }
  };

  if (stock === 0) {
    return (
      <div className="flex items-center gap-1 text-stock-out">
        <XCircle className={sizeClasses[size].icon} />
        <span className={`${sizeClasses[size].text} font-medium`}>
          Out of Stock
        </span>
      </div>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <div className="flex items-center gap-1 text-stock-low">
        <AlertCircle className={sizeClasses[size].icon} />
        <span className={`${sizeClasses[size].text} font-medium`}>
          Only {stock} left
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-stock-available">
      <CheckCircle className={sizeClasses[size].icon} />
      <span className={`${sizeClasses[size].text} font-medium`}>
        In Stock
      </span>
    </div>
  );
}
