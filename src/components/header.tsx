'use client';
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, Grid, Info, Mail, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./theme-toggle";
import RssLink from "./rss-link";
import Search from "./search";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/categories", label: "Categories", icon: Grid },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/discover", label: "Discover", icon: Compass },
  ];

  // Active link detection
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
        aria-label="Main Navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Main Navigation */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                aria-label="Home page"
              >
                <Image
                  src="/logo.png"
                  alt="Blog Logo"
                  width={100}
                  height={100}
                  className="rounded-md object-contain"
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary relative px-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md ${
                      activePath === link.href
                        ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                        : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Search */}
              <div className="hidden md:block w-full max-w-sm">
                <Search />
              </div>

              {/* RSS and Theme Toggle */}
              <div className="flex items-center gap-2">
                <RssLink />
                <ThemeToggle />
              </div>

              {/* Mobile Menu Toggle - Only visible on larger mobile devices */}
              <button
                className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-foreground md:hidden lg:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={toggleMobileMenu}
                aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay - Modal style */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-40"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            >
              <div
                className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-background shadow-lg border-l overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                aria-label="Mobile Navigation"
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">Menu</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-full hover:bg-muted"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col divide-y">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`p-4 flex items-center gap-3 text-sm font-medium transition-colors hover:bg-muted ${
                        activePath === link.href ? "text-primary bg-primary/10" : "text-foreground/80"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  ))}
                  <div className="p-4">
                    <Search />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - Fixed at bottom of screen */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
        <nav className="flex justify-around items-center h-16">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center p-2 w-full h-full transition-colors ${
                activePath === link.href
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground/80"
              }`}
            >
              <link.icon size={20} />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}