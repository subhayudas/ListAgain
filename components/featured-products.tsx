"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'  
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

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
    // Update the query to include seller information
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
        console.log('Fetched products:', data) // Debug log
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Update the card structure
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <Link href={`/products/${product.id}`}>
            <div className="aspect-square relative overflow-hidden">
              <img
                src={product.images[0] || 'https://via.placeholder.com/400'}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {product.condition}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{product.title}</h3>
              <p className="text-lg font-bold">${product.price}</p>
            </CardContent>
          </Link>
          <CardContent className="pt-0 px-4 pb-4">
            <Button 
              className="w-full" 
              size="sm"
              asChild
            >
              <Link
                href={`https://wa.me/${product.seller?.phone}?text=Hi, I'm interested in your ${product.title} listed for $${product.price} on College Market.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact on WhatsApp
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}