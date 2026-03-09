import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { Menu, X, Phone, Mail, Facebook, Instagram, Twitter, Youtube, ChevronDown } from 'lucide-react';
import logo from "../assets/SVUCE.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Bar with Social Media and Contact */}
      <div className="bg-iare-blue text-white py-4 text-xs hidden lg:block">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Social Media Links */}
            <div className="flex items-center gap-6">
              <a href="https://www.facebook.com/SVUCE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-iare-yellow transition-colors">
                <Facebook size={14} />
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/svuce/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-iare-yellow transition-colors">
                <Instagram size={14} />
                <span>Instagram</span>
              </a>
              <a href="https://twitter.com/SVUCE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-iare-yellow transition-colors">
                <Twitter size={14} />
                <span>Twitter</span>
              </a>
              <a href="https://www.youtube.com/user/SVUCE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-iare-yellow transition-colors">
                <Youtube size={14} />
                <span>YouTube</span>
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-6 mr-4">
              <a href="tel:+918772289561" className="flex items-center gap-2 hover:text-iare-yellow transition-colors">
                <Phone size={14} />
                <span>+91-877-2289561</span>
              </a>
              <a href="mailto:principal@svuce.edu.in" className="flex items-center gap-2 hover:text-iare-yellow transition-colors">
                <Mail size={14} />
                <span>principal@svuce.edu.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-[5px] border-iare-blue">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="SVUCE Logo"
                className="h-14 md:h-16 w-auto transition-transform group-hover:scale-105"
              />
              <div>
                <div className="text-xl md:text-2xl font-bold text-iare-blue leading-tight">
                  SVUCE
                </div>
                <div className="text-xs text-gray-600 hidden md:block">
                  Sri Venkateswara University College of Engineering
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {[
                  { path: "/", label: "Home" },
                  { path: "/about-us", label: "About Us" },
                  { path: "/departments", label: "Departments" },
                  { path: "/academics", label: "Academics" },
                  { path: "/placements", label: "Placements" },
                  { path: "/news", label: "News & Events" },
                  { path: "/contact", label: "Contact" },
                ].map(({ path, label }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive(path)
                        ? 'text-iare-blue bg-blue-50'
                        : 'text-gray-700 hover:text-iare-blue hover:bg-gray-50'
                        }`}
                    >
                      <m.span
                        initial={false}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                      >
                        {label}
                      </m.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-900" />
              ) : (
                <Menu size={24} className="text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={`lg:hidden border-t border-gray-100 bg-white ${mobileMenuOpen ? 'block' : 'hidden'
            }`}
        >
          <ul className="py-2">
            {[
              { path: "/", label: "Home" },
              { path: "/about-us", label: "About Us" },
              { path: "/departments", label: "Departments" },
              { path: "/academics", label: "Academics" },
              { path: "/placements", label: "Placements" },
              { path: "/news", label: "News & Events" },
              { path: "/contact", label: "Contact" },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-6 py-3 text-sm font-medium transition-all ${isActive(path)
                    ? 'text-iare-blue bg-blue-50 border-l-4 border-iare-blue'
                    : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Contact Info */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <a href="tel:+918772289561" className="hover:text-iare-blue">+91-877-2289561</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <a href="mailto:principal@svuce.edu.in" className="hover:text-iare-blue">principal@svuce.edu.in</a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
