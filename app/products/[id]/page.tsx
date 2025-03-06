"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { MessageCircle, Heart, Share2, AlertCircle, Star, MapPin, Tag, ArrowLeft, Phone } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

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
    phone: string
    email: string
  }
}

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlist, setIsWishlist] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

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
      console.log('Fetched product data:', data)
      setProduct(data)
    }
    setLoading(false)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out this ${product?.title} for $${product?.price}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  function toggleWishlist() {
    setIsWishlist(!isWishlist)
    // Add logic to save to wishlist in database
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-xl" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-4 bg-muted rounded w-2/4" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Product Images - Left Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted/20 border">
              <img
                src={product.images[selectedImageIndex] || 'https://via.placeholder.com/600'}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`aspect-square rounded-lg overflow-hidden border cursor-pointer 
                    ${selectedImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details - Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">{product.condition}</Badge>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={toggleWishlist}
                  >
                    <Heart className={`h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                {product.is_negotiable && (
                  <Badge variant="secondary">Negotiable</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
                <span className="mx-2">•</span>
                <span>Posted {format(new Date(product.created_at), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="seller" className="flex-1">Seller</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-4">
                <div className="prose prose-sm max-w-none">
                  <p>{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-medium">{product.condition}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{product.location}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Negotiable</span>
                    <span className="font-medium">{product.is_negotiable ? 'Yes' : 'No'}</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="seller" className="pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage 
                      src={product.seller?.avatar_url || 'https://via.placeholder.com/100'} 
                      alt={product.seller?.full_name || 'Seller'} 
                    />
                    <AvatarFallback>{product.seller?.full_name?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{product.seller?.full_name || 'Anonymous Seller'}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.seller?.rating || 0) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground'}`} 
                        />
                      ))}
                      <span className="text-sm ml-1">{product.seller?.rating || 'N/A'}/5</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Email:</span> {product.seller?.email}
                </p>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {user ? (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-base" 
                    size="lg"
                  >
                    Buy Now - ${product.price.toFixed(2)}
                  </Button>
                  
                  <Button 
                    className="w-full bg-[#25D366] hover:bg-[#20BD5C] h-12 text-base flex items-center gap-2" 
                    size="lg"
                    asChild
                  >
                    <Link
                      href={`https://wa.me/${product.seller.phone}?text=Hi, I'm interested in your ${product.title} listed for $${product.price} on College Market.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp Seller
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-12 text-base" size="lg" asChild>
                    <Link href={`/messages?seller=${product.seller.id}&product=${product.id}`}>
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Message Seller
                    </Link>
                  </Button>
                </>
              ) : (
                <Button className="w-full h-12 text-base" size="lg" asChild>
                  <Link href="/login">Sign in to Purchase</Link>
                </Button>
              )}
            </div>
            
            <div className="rounded-lg bg-muted p-4 mt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Safety Tips
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Meet in a public place</li>
                <li>• Check the item before paying</li>
                <li>• Don't pay in advance</li>
                <li>• Report suspicious behavior</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Related Products Section - Would be implemented with actual data */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* This would be populated with actual related products */}
            <div className="text-center text-muted-foreground p-8 border rounded-lg">
              Related products would appear here
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}