import { useState } from "react";
import { Link, useParams } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { products } from "../data/mockData";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl mb-4">Product Not Found</h1>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariant || "default"}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      variant: selectedVariant,
    });
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="mb-4 rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <Badge variant="default">{product.category}</Badge>
              </div>
              <h1 className="text-4xl mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">by {product.brand}</p>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <Badge variant="error">{product.discount}% OFF</Badge>
                  </>
                )}
              </div>

              {product.inStock ? (
                <Badge variant="success" className="mb-6">In Stock</Badge>
              ) : (
                <Badge variant="error" className="mb-6">Out of Stock</Badge>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block mb-2">
                    Select {product.variants[0].name}:
                  </label>
                  <div className="flex gap-2">
                    {product.variants[0].options.map((option) => (
                      <Button
                        key={option}
                        variant={selectedVariant === option ? "primary" : "outline"}
                        onClick={() => setSelectedVariant(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block mb-2">Quantity:</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <Link to="/checkout">
                <Button size="lg" variant="secondary" className="w-full mb-6">
                  Buy Now
                </Button>
              </Link>

              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3">Description</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>

                  {product.specifications && (
                    <>
                      <h3 className="mb-3">Specifications</h3>
                      <div className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-3xl mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <div className="relative h-48 bg-muted">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link to={`/products/${relatedProduct.id}`}>
                        <h3 className="mb-1 hover:text-primary transition-colors line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">{relatedProduct.brand}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl">{formatCurrency(relatedProduct.price)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
