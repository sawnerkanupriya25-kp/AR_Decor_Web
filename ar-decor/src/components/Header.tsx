'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-bold text-gradient-gold">
              AR DECOR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/balloon-decor"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              Balloon Decor
            </Link>
            <Link
              href="/wedding-entries"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              Wedding Entries
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/book-now"
              className="btn-premium"
            >
              BOOK NOW
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black/95 backdrop-blur-md"
        >
          <nav className="flex flex-col px-4 py-6 space-y-4">
            <Link
              href="/"
              className="text-white hover:text-[#D4AF37] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/balloon-decor"
              className="text-white hover:text-[#D4AF37] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Balloon Decor
            </Link>
            <Link
              href="/wedding-entries"
              className="text-white hover:text-[#D4AF37] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Wedding Entries
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-[#D4AF37] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-[#D4AF37] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/book-now"
              className="btn-premium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              BOOK NOW
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
