import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Package, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import CranberryLogo from '../ui/Cranberrylogo';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isVendor, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const categories = [
    { name: 'Electronics', href: '/shop?category=electronics' },
    { name: 'Fashion', href: '/shop?category=fashion' },
    { name: 'Home & Living', href: '/shop?category=home-living' },
    { name: 'Beauty', href: '/shop?category=beauty' },
  ];

  return (
    <header className="sticky top-0 z-50 glass" data-testid="main-header">
      {/* Top bar */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2"
              data-testid="logo-link"
            >
              <CranberryLogo size={32} />

              <span className="font-display font-bold text-xl text-slate-900">
                Cranberry
              </span>
            </Link>


            {/* Search bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-lg mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#0071E3] rounded-full transition-all outline-none text-sm"
                  data-testid="search-input"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                data-testid="wishlist-link"
              >
                <Heart className="h-5 w-5 text-slate-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#0071E3] text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                data-testid="cart-link"
              >
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#0071E3] text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-full transition-colors"
                      data-testid="user-menu-trigger"
                    >
                      <img
                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full bg-slate-100"
                      />
                      <ChevronDown className="h-4 w-4 text-slate-600 hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium text-slate-900">{user?.name}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />

                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="admin-dashboard-link">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}

                    {isVendor && (
                      <DropdownMenuItem onClick={() => navigate('/vendor')} data-testid="vendor-dashboard-link">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Vendor Dashboard
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => navigate('/orders')} data-testid="orders-link">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="profile-link">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/settings')} data-testid="settings-link">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="logout-button">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-slate-600 hover:text-slate-900"
                    data-testid="login-button"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-6"
                    data-testid="register-button"
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-slate-600" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category navigation - Desktop */}
      <nav className="hidden md:block border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="text-sm text-slate-600 hover:text-[#0071E3] transition-colors"
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/shop"
              className="text-sm text-slate-600 hover:text-[#0071E3] transition-colors"
              data-testid="all-products-link"
            >
              All Products
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#0071E3] rounded-full transition-all outline-none text-sm"
                  data-testid="mobile-search-input"
                />
              </div>
            </form>

            {/* Mobile categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block py-2 text-slate-600 hover:text-[#0071E3] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/shop"
                className="block py-2 text-slate-600 hover:text-[#0071E3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
