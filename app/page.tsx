
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingBag, Search, MessageCircle, Shield } from 'lucide-react';
import FeaturedProducts from '@/components/featured-products';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-primary/5 to-transparent rounded-3xl mb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ transform: 'scale(1.2)' }}>
          <spline-viewer 
            url="https://prod.spline.design/qxlBEWwHjFMewPSw/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Your College Marketplace
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Buy, sell, and discover items within your college community.
          </p>
          <div className="flex gap-6 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/sell">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        <Card className="p-8 text-center bg-background/50 hover:bg-background/80 transition-colors">
          <ShoppingBag className="w-10 h-10 mx-auto mb-6 text-primary" />
          <h3 className="text-lg font-medium mb-2">Easy Buying & Selling</h3>
          <p className="text-muted-foreground text-sm">
            Simple interface for seamless transactions
          </p>
        </Card>
        <Card className="p-8 text-center bg-background/50 hover:bg-background/80 transition-colors">
          <Search className="w-10 h-10 mx-auto mb-6 text-primary" />
          <h3 className="text-lg font-medium mb-2">Smart Search</h3>
          <p className="text-muted-foreground text-sm">
            Find exactly what you need
          </p>
        </Card>
        <Card className="p-8 text-center bg-background/50 hover:bg-background/80 transition-colors">
          <MessageCircle className="w-10 h-10 mx-auto mb-6 text-primary" />
          <h3 className="text-lg font-medium mb-2">Secure Messaging</h3>
          <p className="text-muted-foreground text-sm">
            Safe communication channels
          </p>
        </Card>
        <Card className="p-8 text-center bg-background/50 hover:bg-background/80 transition-colors">
          <Shield className="w-10 h-10 mx-auto mb-6 text-primary" />
          <h3 className="text-lg font-medium mb-2">Verified Users</h3>
          <p className="text-muted-foreground text-sm">
            Trade with confidence
          </p>
        </Card>
      </section>

      {/* Featured Products */}
      <section className="mb-24">
        <h2 className="text-3xl font-medium mb-12 text-center">Featured Products</h2>
        <FeaturedProducts />
      </section>

      {/* Categories */}
      <section className="mb-24">
        <h2 className="text-3xl font-medium mb-12 text-center">Popular Categories</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { name: 'Clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
            { name: 'Bicycles', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
            { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80' },
            { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80' },
            { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' }
          ].map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-background/50 hover:bg-background/80 transition-colors"
            >
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full opacity-80 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <h3 className="text-white text-xl font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}