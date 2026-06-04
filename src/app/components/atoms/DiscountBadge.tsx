interface DiscountBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sale';
}

export function DiscountBadge({
  percentage,
  size = 'md',
  variant = 'default'
}: DiscountBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const variantClasses = {
    default: 'bg-discount text-white',
    sale: 'bg-sale-badge text-white'
  };

  return (
    <span className={`${sizeClasses[size]} ${variantClasses[variant]} font-bold rounded`}>
      {percentage}% OFF
    </span>
  );
}
