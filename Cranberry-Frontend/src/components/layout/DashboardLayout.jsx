import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  Store,
  BarChart3,
  DollarSign,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../ui/button';
import CranberryLogo from '../ui/Cranberrylogo';

const DashboardLayout = ({ type = 'vendor' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const vendorNavItems = [
    { name: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
    { name: 'Products', href: '/vendor/products', icon: Package },
    { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
    { name: 'Price Suggestions', href: '/vendor/price-suggest', icon: DollarSign },
    { name: 'Settings', href: '/vendor/settings', icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Vendors', href: '/admin/vendors', icon: Store },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Approvals', href: '/admin/approvals', icon: CheckCircle },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navItems = type === 'admin' ? adminNavItems : vendorNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid={`${type}-dashboard-layout`}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
            <Link to="/" className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center">
                <CranberryLogo size={32} />
              </span>
              {sidebarOpen && (
                <span className="font-display font-bold text-slate-900">
                  {type === 'admin' ? 'Admin' : 'Vendor'}
                </span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              data-testid="sidebar-toggle"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-slate-500" />
              ) : (
                <Menu className="h-5 w-5 text-slate-500" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/vendor' && item.href !== '/admin' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all ${isActive
                    ? 'bg-[#0071E3] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {sidebarOpen && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-slate-100">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                  alt={user?.name}
                  className="h-10 w-10 rounded-full bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                  data-testid="sidebar-logout"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full p-2.5 hover:bg-slate-100 rounded-xl transition-colors flex justify-center"
                data-testid="sidebar-logout-compact"
              >
                <LogOut className="h-5 w-5 text-slate-500" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-slate-100">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-600"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Store
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
