import { Link } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { products, categories } from "../data/mockData";
import { Star, ShoppingCart, ArrowRight, TrendingUp, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomePage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const bestSellers = products.slice(0, 4);
  const flashDeals = products.filter(p => p.discount && p.discount > 15);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4">
          <section className="py-8">
            <Slider {...sliderSettings}>
              <div>
                <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                  <div className="absolute inset-0 flex items-center px-12">
                    <div className="text-white max-w-xl">
                      <h1 className="text-5xl mb-4">Welcome to Rudrax</h1>
                      <p className="text-xl mb-6 opacity-90">Fresh groceries delivered to your doorstep in minutes</p>
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                        Shop Now <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-r from-green-600 to-teal-600">
                  <div className="absolute inset-0 flex items-center px-12">
                    <div className="text-white max-w-xl">
                      <h1 className="text-5xl mb-4">50% OFF Flash Sale</h1>
                      <p className="text-xl mb-6 opacity-90">Limited time offer on selected products</p>
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                        Grab Deals <Zap className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-r from-orange-600 to-red-600">
                  <div className="absolute inset-0 flex items-center px-12">
                    <div className="text-white max-w-xl">
                      <h1 className="text-5xl mb-4">Fresh & Organic</h1>
                      <p className="text-xl mb-6 opacity-90">100% fresh fruits and vegetables from local farms</p>
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                        Explore <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>
          </section>

          <section className="py-12">
            <h2 className="text-3xl mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="text-center"
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="text-4xl mb-2">{category.icon}</div>
                      <p className="text-sm">{category.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl">Flash Deals</h2>
              </div>
              <Link to="/products?filter=deals">
                <Button variant="ghost">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {flashDeals.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <Link to={`/products/${product.id}`}>
                    <div className="relative h-48 bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount && (
                        <Badge variant="error" className="absolute top-2 right-2">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="mb-1 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h2 className="text-3xl">Best Sellers</h2>
              </div>
              <Link to="/products?filter=bestsellers">
                <Button variant="ghost">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <Link to={`/products/${product.id}`}>
                    <div className="relative h-48 bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="mb-1 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-3xl mb-6">Why Choose Rudrax?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h3 className="mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your orders delivered within 30 minutes in select areas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="mb-2">Fresh Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    100% fresh products sourced directly from trusted suppliers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h3 className="mb-2">Best Prices</h3>
                  <p className="text-sm text-muted-foreground">
                    Competitive prices with regular discounts and offers
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
