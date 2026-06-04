import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Rating } from '../components/atoms/Rating';
import { Price } from '../components/atoms/Price';
import { StockBadge } from '../components/atoms/StockBadge';
import { ReviewCard, Review } from '../components/molecules/ReviewCard';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { Product } from '../components/molecules/ProductCard';
import { ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, Check } from 'lucide-react';
import { useState } from 'react';

export function ProductDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('5kg');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Mock product data
  const product = {
    id: '1',
    name: 'Premium Basmati Rice',
    brand: 'India Gate',
    rating: 4.5,
    reviewCount: 1250,
    price: 599,
    originalPrice: 699,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop&sat=-100',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop&contrast=110',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop&brightness=90'
    ],
    variants: [
      { id: '1kg', label: '1 kg', price: 150, stock: 100 },
      { id: '2kg', label: '2 kg', price: 280, stock: 80 },
      { id: '5kg', label: '5 kg', price: 599, stock: 50 },
      { id: '10kg', label: '10 kg', price: 1150, stock: 25 }
    ],
    description: 'India Gate Premium Basmati Rice is aged for a minimum of 1.5 years which makes it extra long grain with superior aroma. It is naturally aromatic rice that has delicious taste, superior aroma, and distinct flavor. The long grain rice, when cooked is fluffy, aromatic and absolutely non-sticky.',
    features: [
      'Long Grain Rice',
      'Aged for 1.5 years',
      'Superior Aroma',
      'Non-Sticky when cooked',
      'Rich in Nutrients',
      '100% Natural'
    ],
    specifications: {
      'Weight': '5 kg',
      'Brand': 'India Gate',
      'Type': 'Basmati Rice',
      'Country of Origin': 'India',
      'Shelf Life': '12 Months',
      'Storage': 'Store in cool dry place'
    }
  };

  // Mock reviews
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Priya Sharma',
      rating: 5,
      title: 'Excellent Quality Rice',
      comment: 'This is the best basmati rice I have ever purchased. Long grains, perfect aroma, and cooks beautifully every time. Highly recommended!',
      date: '15 May 2026',
      verified: true,
      helpful: 45
    },
    {
      id: '2',
      userName: 'Raj Kumar',
      rating: 4,
      title: 'Good but slightly expensive',
      comment: 'Quality is great, rice is aromatic and tasty. However, it is a bit pricey compared to other brands.',
      date: '10 May 2026',
      verified: true,
      helpful: 28
    },
    {
      id: '3',
      userName: 'Anita Desai',
      rating: 5,
      title: 'Worth every penny',
      comment: 'My family loves this rice. We have been using it for years and it never disappoints. The grains are long and separate beautifully.',
      date: '5 May 2026',
      verified: true,
      helpful: 62
    }
  ];

  // Mock related products
  const relatedProducts: Product[] = [
    {
      id: '2',
      name: 'Royal Basmati Rice - 5kg',
      brand: 'Daawat',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      price: 550,
      originalPrice: 650,
      rating: 4.4,
      reviewCount: 890,
      stock: 60,
      category: 'Grocery'
    },
    {
      id: '3',
      name: 'Brown Basmati Rice - 5kg',
      brand: 'India Gate',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&hue=30',
      price: 650,
      originalPrice: 750,
      rating: 4.6,
      reviewCount: 450,
      stock: 40,
      category: 'Grocery'
    },
    {
      id: '4',
      name: 'Classic Basmati Rice - 5kg',
      brand: 'Fortune',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&sat=-50',
      price: 499,
      originalPrice: 599,
      rating: 4.3,
      reviewCount: 720,
      stock: 80,
      category: 'Grocery'
    },
    {
      id: '5',
      name: 'Premium Basmati Rice - 10kg',
      brand: 'India Gate',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      price: 1150,
      originalPrice: 1350,
      rating: 4.5,
      reviewCount: 980,
      stock: 25,
      category: 'Grocery'
    }
  ];

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
          <nav className="text-sm text-muted-foreground mb-6">
            <a href="#" className="hover:text-primary">Home</a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-primary">Grocery</a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-primary">Rice</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Brand and Name */}
              <p className="text-muted-foreground mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="mb-4">
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="md"
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <Price
                  price={product.price}
                  originalPrice={product.originalPrice}
                  size="xl"
                />
              </div>

              {/* Stock */}
              <div className="mb-6">
                <StockBadge stock={product.stock} size="md" />
              </div>

              {/* Variant Selector */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                        selectedVariant === variant.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold">{variant.label}</div>
                      <div className="text-sm text-muted-foreground">₹{variant.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center border border-border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted"
                  >
                    -
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="p-3 border border-border rounded-lg hover:bg-muted">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 border border-border rounded-lg hover:bg-muted">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Buy Now */}
              <button className="w-full bg-warning text-white py-3 px-6 rounded-lg font-bold hover:bg-warning/90 mb-6">
                Buy Now
              </button>

              {/* Features */}
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">On orders above ₹500</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-muted-foreground">7 days return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">100% secure transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">Quality Assured</p>
                      <p className="text-sm text-muted-foreground">100% authentic products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-12">
            <div className="border-b border-border mb-6">
              <div className="flex gap-6">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-1 font-medium capitalize transition-colors border-b-2 ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'description' && (
                <div>
                  <p className="text-foreground mb-6">{product.description}</p>
                  <h3 className="font-bold text-lg mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                          <td className="py-3 px-4 font-medium">{key}</td>
                          <td className="py-3 px-4">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-2xl mb-1">Customer Reviews</h3>
                      <div className="flex items-center gap-3">
                        <Rating rating={product.rating} size="lg" />
                        <span className="text-muted-foreground">
                          Based on {product.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90">
                      Write a Review
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onHelpful={(id) => console.log('Helpful:', id)}
                        onNotHelpful={(id) => console.log('Not helpful:', id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <ProductGrid
              products={relatedProducts}
              columns={4}
              onAddToCart={(product) => console.log('Add to cart:', product)}
              onWishlist={(product) => console.log('Wishlist:', product)}
              onProductClick={(product) => console.log('Product:', product)}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
