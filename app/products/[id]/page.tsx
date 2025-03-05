"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string
  price: number
  condition: string
  images: string[]
  location: string
  is_negotiable: boolean
  created_at: string
  seller: {
    id: string
    full_name: string
    avatar_url: string
    rating: number
    phone: string  // Add phone field
  }
}

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  // Add console log to debug
  useEffect(() => {
    console.log('Current user:', user)
    console.log('Current product:', product)
  }, [user, product])

  useEffect(() => {
    fetchProduct()
  }, [id])

  // In the fetchProduct function, update the select query
  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(
          id,
          full_name,
          avatar_url,
          rating,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single()
  
    if (data) {
      console.log('Fetched product data:', data) // Debug log
      setProduct(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="aspect-video bg-muted rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={product.images[0] || 'https://via.placeholder.com/400'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">Condition: {product.condition}</p>
              <p className="text-muted-foreground">Location: {product.location}</p>
              {product.is_negotiable && (
                <p className="text-sm text-primary">Price is negotiable</p>
              )}
            </div>

            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Seller Information */}
            // In the seller information card section:
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={product.seller?.avatar_url || 'https://via.placeholder.com/100'}
                      alt={product.seller?.full_name || 'Seller'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.seller?.full_name || 'Anonymous Seller'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.seller?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rating: {product.seller?.rating || 'N/A'}/5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            
            <div className="space-y-3">
              {/* Remove nested condition temporarily for testing */}
              {user ? (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                  >
                    Buy Now - ${product.price}
                  </Button>
                  <Button 
                    className="w-full" 
                    size="lg"
                    asChild
                  >
                    <Link
                      href={`https://wa.me/${product.seller.phone}?text=Hi, I'm interested in your ${product.title} listed for $${product.price} on College Market.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact on WhatsApp
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href={`/messages?seller=${product.seller.id}&product=${product.id}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message Seller
                    </Link>
                  </Button>
                </>
              ) : (
                <Button className="w-full" size="lg" asChild>
                  <Link href="/login">Sign in to Purchase</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}