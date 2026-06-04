import { ChevronRight } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount?: number;
  description?: string;
}

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
  variant?: 'default' | 'compact';
}

export function CategoryCard({
  category,
  onClick,
  variant = 'default'
}: CategoryCardProps) {
  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick?.(category)}
        className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            {category.productCount !== undefined && (
              <p className="text-xs text-muted-foreground">
                {category.productCount} products
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(category)}
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1">{category.name}</h3>
          {category.productCount !== undefined && (
            <p className="text-sm opacity-90">
              {category.productCount} products
            </p>
          )}
        </div>
      </div>

      {/* Description (if provided) */}
      {category.description && (
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </div>
      )}
    </div>
  );
}
