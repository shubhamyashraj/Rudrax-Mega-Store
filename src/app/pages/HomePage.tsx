import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { CategoryCard } from '../components/molecules/CategoryCard';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { Product } from '../components/molecules/ProductCard';
import { ChevronRight, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function HomePage() {
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  // Mock categories data
  const categories = [
    {
      id: '1',
      name: 'Grocery & Staples',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      productCount: 1250
    },
    {
      id: '2',
      name: 'Fruits & Vegetables',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=400&fit=crop',
      productCount: 450
    },
    {
      id: '3',
      name: 'Dairy & Bakery',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop',
      productCount: 320
    },
    {
      id: '4',
      name: 'Personal Care',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      productCount: 580
    },
    {
      id: '5',
      name: 'Household Items',
      image: 'https://images.unsplash.com/photo-1600087626014-e652e18bbfae?w=400&h=400&fit=crop',
      productCount: 720
    },
    {
      id: '6',
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1622484211220-d2970b2efb1a?w=400&h=400&fit=crop',
      productCount: 280
    },
    {
      id: '7',
      name: 'Snacks & Foods',
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
      productCount: 890
    },
    {
      id: '8',
      name: 'Baby Care',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
      productCount: 210
    }
  ];

  // Mock products data
  const bestSellers: Product[] = [
    {
      id: '1',
      name: 'Premium Basmati Rice - 5kg',
      brand: 'India Gate',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      price: 599,
      originalPrice: 699,
      rating: 4.5,
      reviewCount: 1250,
      stock: 50,
      category: 'Grocery'
    },
    {
      id: '2',
      name: 'Fresh Milk - 1 Liter',
      brand: 'Amul',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      price: 65,
      originalPrice: 70,
      rating: 4.8,
      reviewCount: 3200,
      stock: 100,
      category: 'Dairy'
    },
    {
      id: '3',
      name: 'Whole Wheat Bread',
      brand: 'Britannia',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
      price: 45,
      originalPrice: 50,
      rating: 4.3,
      reviewCount: 850,
      stock: 80,
      category: 'Bakery'
    },
    {
      id: '4',
      name: 'Extra Virgin Olive Oil - 500ml',
      brand: 'Figaro',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
      price: 425,
      originalPrice: 550,
      rating: 4.6,
      reviewCount: 620,
      stock: 35,
      category: 'Grocery'
    }
  ];

  const flashDeals: Product[] = [
    {
      id: '5',
      name: 'Fortune Sunflower Oil - 1L',
      brand: 'Fortune',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
      price: 150,
      originalPrice: 200,
      rating: 4.4,
      reviewCount: 1500,
      stock: 120,
      category: 'Grocery'
    },
    {
      id: '6',
      name: 'Toor Dal - 1kg',
      brand: 'Tata Sampann',
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop',
      price: 140,
      originalPrice: 180,
      rating: 4.5,
      reviewCount: 920,
      stock: 60,
      category: 'Grocery'
    },
    {
      id: '7',
      name: 'Organic Green Tea - 100 Bags',
      brand: 'Lipton',
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop',
      price: 199,
      originalPrice: 280,
      rating: 4.7,
      reviewCount: 430,
      stock: 45,
      category: 'Beverages'
    },
    {
      id: '8',
      name: 'Cashew Nuts - 500g',
      brand: 'Nutraj',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&h=400&fit=crop',
      price: 450,
      originalPrice: 600,
      rating: 4.8,
      reviewCount: 680,
      stock: 30,
      category: 'Snacks'
    }
  ];

  const newArrivals: Product[] = [
    {
      id: '9',
      name: 'Quinoa - 500g',
      brand: 'Organic India',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      price: 280,
      originalPrice: 320,
      rating: 4.6,
      reviewCount: 150,
      stock: 25,
      category: 'Grocery'
    },
    {
      id: '10',
      name: 'Almond Milk - 1L',
      brand: 'Raw Pressery',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
      price: 220,
      originalPrice: 250,
      rating: 4.5,
      reviewCount: 95,
      stock: 40,
      category: 'Dairy'
    },
    {
      id: '11',
      name: 'Protein Bar - Pack of 6',
      brand: 'RiteBite',
      image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=400&h=400&fit=crop',
      price: 360,
      originalPrice: 420,
      rating: 4.4,
      reviewCount: 210,
      stock: 55,
      category: 'Snacks'
    },
    {
      id: '12',
      name: 'Cold Pressed Coconut Oil - 500ml',
      brand: 'KLF',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
      price: 320,
      originalPrice: 380,
      rating: 4.7,
      reviewCount: 340,
      stock: 35,
      category: 'Grocery'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onCartClick={() => console.log('Cart clicked')}
        onWishlistClick={() => console.log('Wishlist clicked')}
        onProfileClick={() => console.log('Profile clicked')}
        onSearch={(query) => console.log('Search:', query)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Banner */}
              <div className="md:col-span-2 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Fresh Groceries<br />Delivered to Your Door
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Get up to 50% off on your first order
                </p>
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors">
                  Shop Now
                </button>
              </div>

              {/* Side Banners */}
              <div className="flex flex-col gap-4">
                <div className="bg-success/10 border-2 border-success rounded-xl p-6 flex-1">
                  <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
                  <p className="text-sm text-muted-foreground mb-3">On orders above ₹500</p>
                  <a href="#" className="text-success font-semibold flex items-center gap-1 text-sm">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="bg-warning/10 border-2 border-warning rounded-xl p-6 flex-1">
                  <h3 className="font-bold text-lg mb-2">Daily Deals</h3>
                  <p className="text-sm text-muted-foreground mb-3">New offers every day</p>
                  <a href="#" className="text-warning font-semibold flex items-center gap-1 text-sm">
                    Explore Deals <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-5 h-5" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => console.log('Category clicked:', category)}
              />
            ))}
          </div>
        </section>

        {/* Flash Deals */}
        <section className="bg-gradient-to-r from-discount/10 to-discount/5 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-discount text-white p-2 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Flash Deals</h2>
                  <p className="text-sm text-muted-foreground">Limited time offers</p>
                </div>
              </div>
              <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            <ProductGrid
              products={flashDeals}
              columns={4}
              onAddToCart={(product) => console.log('Add to cart:', product)}
              onWishlist={(product) => console.log('Add to wishlist:', product)}
              onProductClick={(product) => console.log('Product clicked:', product)}
            />
          </div>
        </section>

        {/* Best Sellers */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Best Sellers</h2>
                <p className="text-sm text-muted-foreground">Top rated products</p>
              </div>
            </div>
            <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-5 h-5" />
            </a>
          </div>
          <ProductGrid
            products={bestSellers}
            columns={4}
            onAddToCart={(product) => console.log('Add to cart:', product)}
            onWishlist={(product) => console.log('Add to wishlist:', product)}
            onProductClick={(product) => console.log('Product clicked:', product)}
          />
        </section>

        {/* New Arrivals */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-success text-success-foreground p-2 rounded-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">New Arrivals</h2>
                  <p className="text-sm text-muted-foreground">Fresh additions to our store</p>
                </div>
              </div>
              <a href="#" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            <ProductGrid
              products={newArrivals}
              columns={4}
              onAddToCart={(product) => console.log('Add to cart:', product)}
              onWishlist={(product) => console.log('Add to wishlist:', product)}
              onProductClick={(product) => console.log('Product clicked:', product)}
            />
          </div>
        </section>

        {/* Features Banner */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">100% Fresh Products</h3>
              <p className="text-sm text-muted-foreground">
                Quality guaranteed on every purchase
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Same-day delivery on most orders
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Multiple payment options available
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
