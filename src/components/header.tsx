'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import ThemeToggle from "./theme-toggle"
import RssLink from "./rss-link"
import Search from "./search"
import { Menu } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize and set mobile state
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isMobile, isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-12 md:h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Hamburger menu for mobile */}
            {isMobile && (
              <button 
                onClick={toggleMenu} 
                className="text-foreground/80 hover:text-blue-900 transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu size={20} />
              </button>
            )}
            
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Blog Logo" 
                width={isMobile ? 200 : 309} 
                height={isMobile ? 42 : 65} 
                className="rounded-md" 
              />
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors">
                Home
              </Link>
              <Link
                href="/categories"
                className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/discover"
                className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/about"
                className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search - visible on desktop, hidden on mobile */}
            <div className="hidden md:block w-full max-w-sm">
              <Search />
            </div>
            {/* RSS Link - visible on desktop, hidden on mobile */}
            <div className="hidden md:block">
              <RssLink />
            </div>
            {/* Theme toggle - always visible */}
            <div className="block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu - only rendered on mobile devices */}
      {isMobile && (
        <>
          <div className={`
            fixed left-0 top-12 h-[calc(100vh-3rem)] w-64 bg-background 
            transform transition-transform duration-300 ease-in-out z-40
            border-r shadow-lg
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="p-4 flex flex-col gap-4">
              {/* Mobile search */}
              <div className="mb-4">
                <Search />
              </div>
              
              {/* Mobile navigation links */}
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  href="/categories"
                  className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
                  onClick={closeMenu}
                >
                  Categories
                </Link>
                <Link
                  href="/discover"
                  className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
                  onClick={closeMenu}
                >
                  Discover
                </Link>
                <Link
                  href="/about"
                  className="text-lg uppercase font-bold text-foreground/80 hover:text-blue-900 transition-colors"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </nav>

              {/* Mobile RSS link */}
              <div className="mt-4">
                <RssLink />
              </div>
            </div>
          </div>

          {/* Overlay to close menu when clicking outside - only rendered on mobile */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-30"
              onClick={closeMenu}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </header>
  )
}