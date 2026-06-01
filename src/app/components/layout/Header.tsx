import { Link } from "react-router";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useState } from "react";

export function Header() {
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        🎉 Grand Opening Sale! Get up to 50% OFF on selected items
      </div>

      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-xl">R</span>
                </div>
                <span className="text-2xl tracking-tight">Rudrax</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link to="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
                <Link to="/products?category=offers" className="hover:text-primary transition-colors">
                  Offers
                </Link>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  My Account
                </Link>
              </nav>
            </div>

            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <User className="w-5 h-5" />
                  Login
                </Button>
              </Link>

              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMenu(!showMenu)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {showMenu && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-3">
              <Link to="/products" className="py-2 hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/products?category=offers" className="py-2 hover:text-primary transition-colors">
                Offers
              </Link>
              <Link to="/dashboard" className="py-2 hover:text-primary transition-colors">
                My Account
              </Link>
              <Link to="/login" className="py-2 hover:text-primary transition-colors">
                Login
              </Link>
            </nav>
          )}
        </div>

        <div className="bg-secondary py-3 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              <Link to="/products?category=groceries" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🛒 Groceries
              </Link>
              <Link to="/products?category=fruits" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🥬 Fruits & Vegetables
              </Link>
              <Link to="/products?category=dairy" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🥛 Dairy & Eggs
              </Link>
              <Link to="/products?category=beverages" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🥤 Beverages
              </Link>
              <Link to="/products?category=snacks" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🍪 Snacks
              </Link>
              <Link to="/products?category=personal-care" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🧴 Personal Care
              </Link>
              <Link to="/products?category=home-care" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                🧹 Home Care
              </Link>
              <Link to="/products?category=baby-care" className="whitespace-nowrap hover:text-primary transition-colors text-sm">
                👶 Baby Care
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
