"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'  
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ExternalLink, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  condition: string
  seller: {
    phone: string
    id: string
  }
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:users!products_seller_id_fkey(
            id,
            phone,
            full_name
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(8)
    
      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden">
            <div className="aspect-[4/3] bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {products.map((product, index) => (
        <motion.div 
          key={product.id} 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <Link href={`/products/${product.id}`} className="block">
              <div className="aspect-[4/3] relative overflow-hidden group">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400'}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge className={cn(
                  "absolute top-2 right-2 transition-transform duration-300",
                  product.condition === "new" ? "bg-green-500/90" : 
                  product.condition === "like-new" ? "bg-blue-500/90" : 
                  "bg-amber-500/90"
                )}>
                  {product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')}
                </Badge>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium line-clamp-1 text-base">{product.title}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2 -mt-1">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-primary">₹{product.price}</p>
                <Button 
                  className="text-xs px-3 h-8 rounded-full" 
                  size="sm"
                  asChild
                >
                  <Link
                    href={`https://wa.me/${product.seller?.phone}?text=Hi, I'm interested in your ${product.title} listed for ₹${product.price} on ListAgain.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}