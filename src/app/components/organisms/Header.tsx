import { ShoppingCart, Heart, User, Menu, MapPin } from 'lucide-react';
import { SearchBox } from '../molecules/SearchBox';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onMenuClick?: () => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onProfileClick?: () => void;
  onSearch?: (query: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({
  cartCount = 0,
  wishlistCount = 0,
  onMenuClick,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  onSearch,
  isLoggedIn = false,
  userName
}: HeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Deliver to: Mumbai 400001</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="hover:underline">Become a Seller</a>
            <a href="#" className="hover:underline">Help & Support</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">Rudrax</h1>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBox
              onSearch={onSearch}
              popularSearches={['Rice', 'Dal', 'Oil', 'Milk', 'Bread']}
              recentSearches={['Basmati Rice', 'Olive Oil']}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Profile */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-medium">
                {isLoggedIn ? userName : 'Login'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <SearchBox
            onSearch={onSearch}
            popularSearches={['Rice', 'Dal', 'Oil']}
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-6 overflow-x-auto py-3 text-sm">
            <a href="#" className="whitespace-nowrap hover:text-primary font-medium transition-colors">
              Grocery & Staples
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Fruits & Vegetables
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Dairy & Bakery
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Personal Care
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Household Items
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Beverages
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Snacks & Packaged Foods
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
