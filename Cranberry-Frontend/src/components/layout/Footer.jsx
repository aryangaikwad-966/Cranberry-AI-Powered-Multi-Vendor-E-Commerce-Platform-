import { Link } from 'react-router-dom';
import CranberryLogo from '../ui/Cranberrylogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'Electronics', href: '/shop?category=electronics' },
      { name: 'Fashion', href: '/shop?category=fashion' },
      { name: 'Home & Living', href: '/shop?category=home-living' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <CranberryLogo size={32} />
              <span className="font-display font-bold text-xl text-slate-900">
                Cranberry
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Your premium destination for quality products from trusted vendors worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 hover:text-[#0071E3] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 hover:text-[#0071E3] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 hover:text-[#0071E3] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 hover:text-[#0071E3] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-500">
              © {currentYear} Cranberry. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-slate-500">
                Secure payments powered by
              </span>
              <div className="flex items-center space-x-3">
                <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-xs font-medium text-slate-500">
                  VISA
                </div>
                <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-xs font-medium text-slate-500">
                  MC
                </div>
                <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-xs font-medium text-slate-500">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
