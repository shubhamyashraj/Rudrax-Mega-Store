import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { FiltersSidebar } from '../components/organisms/FiltersSidebar';
import { Product } from '../components/molecules/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export function ProductListingPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('popular');

  // Mock filters
  const filters = [
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox' as const,
      options: [
        { id: 'rice', label: 'Rice & Rice Products', count: 145 },
        { id: 'dal', label: 'Dal & Pulses', count: 89 },
        { id: 'oil', label: 'Oil & Ghee', count: 67 },
        { id: 'spices', label: 'Spices & Masalas', count: 123 },
        { id: 'atta', label: 'Atta & Flours', count: 54 }
      ]
    },
    {
      id: 'brand',
      label: 'Brand',
      type: 'checkbox' as const,
      options: [
        { id: 'india-gate', label: 'India Gate', count: 45 },
        { id: 'tata', label: 'Tata Sampann', count: 38 },
        { id: 'fortune', label: 'Fortune', count: 52 },
        { id: 'aashirvaad', label: 'Aashirvaad', count: 41 },
        { id: 'dawat', label: 'Daawat', count: 29 }
      ]
    },
    {
      id: 'price',
      label: 'Price Range',
      type: 'range' as const,
      min: 0,
      max: 2000
    },
    {
      id: 'discount',
      label: 'Discount',
      type: 'radio' as const,
      options: [
        { id: '50+', label: '50% or more', count: 12 },
        { id: '40+', label: '40% or more', count: 28 },
        { id: '30+', label: '30% or more', count: 45 },
        { id: '20+', label: '20% or more', count: 78 },
        { id: '10+', label: '10% or more', count: 126 }
      ]
    },
    {
      id: 'rating',
      label: 'Customer Rating',
      type: 'radio' as const,
      options: [
        { id: '4+', label: '4★ & above', count: 234 },
        { id: '3+', label: '3★ & above', count: 389 },
        { id: '2+', label: '2★ & above', count: 445 },
        { id: '1+', label: '1★ & above', count: 478 }
      ]
    },
    {
      id: 'availability',
      label: 'Availability',
      type: 'checkbox' as const,
      options: [
        { id: 'in-stock', label: 'In Stock', count: 432 },
        { id: 'out-of-stock', label: 'Out of Stock', count: 46 }
      ]
    }
  ];

  // Mock products
  const allProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1} - Premium Quality Item`,
    brand: ['India Gate', 'Tata Sampann', 'Fortune', 'Aashirvaad'][i % 4],
    image: `https://images.unsplash.com/photo-${1586201375761 + i}?w=400&h=400&fit=crop`,
    price: Math.floor(Math.random() * 500) + 100,
    originalPrice: Math.floor(Math.random() * 700) + 150,
    rating: Math.floor(Math.random() * 2) + 3.5,
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    stock: Math.floor(Math.random() * 100),
    category: 'Grocery'
  }));

  const handleFilterChange = (filterId: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      if (checked) {
        return { ...prev, [filterId]: [...current, value] };
      } else {
        return { ...prev, [filterId]: current.filter(v => v !== value) };
      }
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={3}
        wishlistCount={5}
        onCartClick={() => console.log('Cart')}
        onWishlistClick={() => console.log('Wishlist')}
        onProfileClick={() => console.log('Profile')}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-4">
            <a href="#" className="hover:text-primary">Home</a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-primary">Grocery & Staples</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">Rice & Rice Products</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Rice & Rice Products</h1>
              <p className="text-muted-foreground">
                Showing {allProducts.length} products
              </p>
            </div>

            {/* Sort and Filter (Mobile) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-4 overflow-x-auto">
              <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { id: 'popular', label: 'Popularity' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Customer Rating' },
                  { id: 'newest', label: 'Newest First' }
                ].map((sort) => (
                  <button
                    key={sort.id}
                    onClick={() => setSortBy(sort.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      sortBy === sort.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4">
                <FiltersSidebar
                  filters={filters}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </aside>

            {/* Filters Sidebar - Mobile */}
            {showFilters && (
              <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background overflow-y-auto">
                  <FiltersSidebar
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClearAll={handleClearAll}
                    onClose={() => setShowFilters(false)}
                    isMobile
                  />
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              <ProductGrid
                products={allProducts}
                columns={3}
                onAddToCart={(product) => console.log('Add to cart:', product)}
                onWishlist={(product) => console.log('Add to wishlist:', product)}
                onProductClick={(product) => console.log('Product clicked:', product)}
              />

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
