interface PriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscount?: boolean;
}

export function Price({
  price,
  originalPrice,
  currency = '₹',
  size = 'md',
  showDiscount = true
}: PriceProps) {
  const sizeClasses = {
    sm: { current: 'text-sm', original: 'text-xs' },
    md: { current: 'text-lg', original: 'text-sm' },
    lg: { current: 'text-xl', original: 'text-base' },
    xl: { current: 'text-2xl', original: 'text-lg' }
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`${sizeClasses[size].current} font-bold text-price`}>
        {currency}{price.toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span className={`${sizeClasses[size].original} line-through text-muted-foreground`}>
            {currency}{originalPrice.toFixed(2)}
          </span>
          {showDiscount && (
            <span className="text-sm font-semibold text-success bg-success/10 px-2 py-0.5 rounded">
              {discountPercentage}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
