import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { products } from "../data/mockData";
import { Star, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { toast } from "sonner";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categoryParam = searchParams.get("category");

  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const categories = Array.from(new Set(products.map((p) => p.category)));

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

  let filteredProducts = products.filter((product) => {
    if (categoryParam && !product.category.toLowerCase().includes(categoryParam.toLowerCase())) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (inStockOnly && !product.inStock) {
      return false;
    }
    return true;
  });

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "discount") {
    filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl mb-2">
                {categoryParam ? `${categoryParam} Products` : "All Products"}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              <select
                className="h-10 px-3 rounded-lg border border-border bg-background"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            {(showFilters || window.innerWidth >= 1024) && (
              <aside className="w-full lg:w-64 flex-shrink-0">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="mb-4">Filters</h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-3 text-sm">Price Range</h4>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([Number(e.target.value), priceRange[1]])
                            }
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([priceRange[0], Number(e.target.value)])
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm">Category</h4>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <label key={category} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox.Root
                                className="w-5 h-5 border-2 border-border rounded flex items-center justify-center bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                              >
                                <Checkbox.Indicator>
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                              <span className="text-sm">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm">Brand</h4>
                        <div className="space-y-2">
                          {brands.map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox.Root
                                className="w-5 h-5 border-2 border-border rounded flex items-center justify-center bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                              >
                                <Checkbox.Indicator>
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                              <span className="text-sm">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm">Availability</h4>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox.Root
                            className="w-5 h-5 border-2 border-border rounded flex items-center justify-center bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            checked={inStockOnly}
                            onCheckedChange={(checked) => setInStockOnly(checked === true)}
                          >
                            <Checkbox.Indicator>
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          <span className="text-sm">In Stock Only</span>
                        </label>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setPriceRange([0, 2000]);
                          setSelectedBrands([]);
                          setSelectedCategories([]);
                          setInStockOnly(false);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            )}

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                        {!product.inStock && (
                          <Badge variant="default" className="absolute top-2 left-2">
                            Out of Stock
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
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your filters.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setPriceRange([0, 2000]);
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setInStockOnly(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
