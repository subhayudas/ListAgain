"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, ExternalLink, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Here you would typically send this to your backend or newsletter service
    toast.success(`Thanks for subscribing with ${email}!`)
    setEmail('')
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border/40 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ListAgain
              </Link>
            </motion.div>
            <p className="text-muted-foreground text-sm">
              The premier marketplace for college students to buy and sell items within their community. Safe, easy, and sustainable.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </motion.a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/products", label: "Browse Products" },
                { href: "/sell", label: "Sell an Item" },
                { href: "/my-listings", label: "My Listings" },
                { href: "/profile", label: "My Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <ChevronRight size={14} className="mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: "#", label: "Help Center" },
                { href: "#", label: "Safety Tips" },
                { href: "#", label: "Community Guidelines" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <ChevronRight size={14} className="mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
            <div className="pt-4 space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">BIT mesra, Ranchi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">9123388359</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">contact@listagain.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with copyright and secondary links */}
        <div className="pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {currentYear} ListAgain. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center">
                Made with ❤️ for college communities
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}