
"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingBag, Search, MessageCircle, Shield, ArrowRight, Star, TrendingUp, Users, Clock, ChevronRight } from 'lucide-react';
import FeaturedProducts from '@/components/featured-products';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Pacifico, Montserrat } from 'next/font/google';

// Load Pacifico font for the brand name
const pacifico = Pacifico({ 
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

// Load Montserrat for headings
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Animated background component with improved visuals
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating paths animation */}
      <FloatingPathsBackground />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50">
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/20 mix-blend-multiply filter blur-[80px]"
          animate={{
            y: [0, 50, -50, 0],
            x: [0, 30, -30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-secondary/20 mix-blend-multiply filter blur-[60px]"
          animate={{
            y: [0, -40, 40, 0],
            x: [0, -30, 30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-3/4 left-1/3 w-72 h-72 rounded-full bg-blue-400/20 mix-blend-multiply filter blur-[70px]"
          animate={{
            y: [0, 60, -60, 0],
            x: [0, -40, 40, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
    </div>
  );
}

// Floating paths animation component
function FloatingPathsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-60">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}

// Fix the TypeScript error by properly typing the position parameter
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-primary" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.15 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.4, 0.6, 0.4],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Testimonial component
function Testimonial({ name, role, quote, rating, delay = 0 }: {
  name: string;
  role: string;
  quote: string;
  rating: number;
  delay?: number;
}) {
  return (
    <motion.div 
      className="bg-background rounded-xl p-6 shadow-md border border-border/50 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-1 mb-4 text-yellow-500">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      <p className="text-muted-foreground mb-6 flex-grow italic">&ldquo;{quote}&rdquo;</p>
      <div className="mt-auto">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
}

// Stats counter with animation
function StatCounter({ value, label, icon, delay = 0 }: {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-4xl font-bold mb-2">{count.toLocaleString()}+</h3>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
}

// How it works step component
function HowItWorksStep({ number, title, description, icon, delay = 0 }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div 
      className="flex gap-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

// Category card component
function CategoryCard({ name, image, count, delay = 0 }: {
  name: string;
  image: string;
  count: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl aspect-square"
    >
      <Link href={`/category/${name.toLowerCase()}`} className="block h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <p className="text-sm opacity-80">{count} items</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className={`relative ${pacifico.variable} ${montserrat.variable}`}>
      <AnimatedBackground />
      
      {/* Hero Section - Improved with better positioning and animations */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <motion.span 
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your Marketplace, Reimagined
              </motion.span>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-montserrat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Buy & Sell With <span className="font-pacifico gradient-text">ListAgain</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The easiest way to buy, sell, and discover items in your community. Join thousands of users trading safely with ListAgain.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Button asChild size="lg" className="px-8 rounded-full">
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 rounded-full">
                  <Link href="/sell">Start Selling</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl h-[400px]">
                {/* Replacing the static image with Spline animation */}
                <spline-viewer url="https://prod.spline.design/hIrvPul2e31PJe0o/scene.splinecode"></spline-viewer>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-6 -left-6 bg-background rounded-lg p-4 shadow-lg z-20 flex items-center gap-3 border border-border/50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Listings</p>
                  <p className="text-lg font-bold">2,500+</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-lg z-20 flex items-center gap-3 border border-border/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Happy Users</p>
                  <p className="text-lg font-bold">10,000+</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter 
              value={15000} 
              label="Active Users" 
              icon={<Users size={24} />} 
            />
            <StatCounter 
              value={25000} 
              label="Items Sold" 
              icon={<ShoppingBag size={24} />}
              delay={0.1} 
            />
            <StatCounter 
              value={500} 
              label="Daily Listings" 
              icon={<TrendingUp size={24} />}
              delay={0.2} 
            />
            <StatCounter 
              value={98} 
              label="Satisfaction Rate" 
              icon={<Star size={24} />}
              delay={0.3} 
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to start buying and selling on campus</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-12">
              <HowItWorksStep 
                number="1" 
                title="Create an account" 
                description="Sign up with your college email to verify your campus membership."
                icon={<Users size={20} className="text-primary" />}
              />
              <HowItWorksStep 
                number="2" 
                title="Browse or list items" 
                description="Search for what you need or list items you want to sell."
                icon={<Search size={20} className="text-primary" />}
                delay={0.1}
              />
              <HowItWorksStep 
                number="3" 
                title="Connect with buyers/sellers" 
                description="Use our secure messaging system to arrange details."
                icon={<MessageCircle size={20} className="text-primary" />}
                delay={0.2}
              />
              <HowItWorksStep 
                number="4" 
                title="Complete the transaction" 
                description="Meet on campus for a safe exchange and mark the listing as sold."
                icon={<ShoppingBag size={20} className="text-primary" />}
                delay={0.3}
              />
            </div>
            
            <motion.div
              className="relative hidden md:block"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Students exchanging items on campus" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Safety badge */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-background rounded-lg p-4 shadow-lg z-20 flex items-center gap-3 border border-border/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Safe Exchanges</p>
                  <p className="text-lg font-bold">On Campus</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section - Moved above Categories */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap justify-between items-end mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Listings</h2>
              <p className="text-xl text-muted-foreground">Recently added items from students on your campus</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group">
              <Link href="/products" className="flex items-center gap-2">
                View All
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          
          <FeaturedProducts />
        </div>
      </section>
      
      {/* Popular Categories Section - Now after Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
            <p className="text-xl text-muted-foreground">Discover items across these trending categories</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <CategoryCard 
              name="Bicycles" 
              image="https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              count={320}
            />
            <CategoryCard 
              name="Stationery" 
              image="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              count={450}
              delay={0.1}
            />
            <CategoryCard 
              name="Clothing" 
              image="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              count={580}
              delay={0.2}
            />
            <CategoryCard 
              name="Electronics" 
              image="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              count={420}
              delay={0.3}
            />
            <CategoryCard 
              name="Textbooks" 
              image="https://images.unsplash.com/photo-1588580000645-5e582b5b4b6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              count={350}
              delay={0.4}
            />
            <CategoryCard 
              name="Furniture" 
              image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              count={280}
              delay={0.5}
            />
          </div>
          
          {/* Category Highlights */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-background rounded-xl p-6 shadow-md border border-border/50 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Most Popular</h3>
                <p className="text-muted-foreground mb-4">Bicycles are our most traded item with over 300+ monthly listings</p>
                <Button asChild variant="outline" size="sm" className="group">
                  <Link href="/category/bicycles" className="flex items-center gap-2">
                    Browse Bicycles
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-background rounded-xl p-6 shadow-md border border-border/50 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Trending Now</h3>
                <p className="text-muted-foreground mb-4">Electronics are trending with high demand for laptops and accessories</p>
                <Button asChild variant="outline" size="sm" className="group">
                  <Link href="/category/electronics" className="flex items-center gap-2">
                    Browse Electronics
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-background rounded-xl p-6 shadow-md border border-border/50 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Seasonal Deals</h3>
                <p className="text-muted-foreground mb-4">End of semester textbook and stationery sales are happening now</p>
                <Button asChild variant="outline" size="sm" className="group">
                  <Link href="/category/textbooks" className="flex items-center gap-2">
                    Browse Textbooks
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full group">
              <Link href="/categories" className="flex items-center gap-2">
                View All Categories
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Testimonials content */}
          {/* ... */}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-primary/10 rounded-3xl p-12 md:p-16 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <motion.div 
                className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/30 mix-blend-multiply filter blur-[80px]"
                animate={{
                  y: [0, 50, -50, 0],
                  x: [0, -30, 30, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Buy or Sell with ListAgain?</h2>
                <p className="text-xl mb-8">Join thousands of people who are already saving money and making extra cash.</p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="px-8 rounded-full">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8 rounded-full">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center md:justify-end">
                <motion.div 
                  className="relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Students on campus" 
                    className="rounded-2xl shadow-xl max-w-full h-auto"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Add CSS for font classes */}
      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(90deg, #4F46E5 0%, #9333EA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .font-pacifico {
          font-family: var(--font-pacifico);
          font-weight: 400;
        }
        
        .font-montserrat {
          font-family: var(--font-montserrat);
        }
      `}</style>
    </div>
  );
}
