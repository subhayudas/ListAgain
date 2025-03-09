"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase/client'
import { uploadProductImage } from '@/lib/utils/upload'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

export default function SellPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    location: '',
    isNegotiable: true,
  })

  useEffect(() => {
    const checkUserAndFetchCategories = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      // Check if user profile exists
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (userError || !userProfile) {
        // Create user profile if it doesn't exist
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
          })

        if (createError) {
          console.error('Error creating user profile:', createError)
          toast.error('Error setting up user profile')
          router.push('/login')
          return
        }
      }

      fetchCategories()
    }

    checkUserAndFetchCategories()
  }, [user, router])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
    
    if (data) {
      setCategories(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }

    if (!formData.category || !formData.condition) {
      toast.error('Please select both category and condition')
      return
    }

    setLoading(true)
    try {
      // Upload images
      const imageUrls = []
      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image)

        if (uploadError) {
          toast.error(`Error uploading image: ${uploadError.message}`)
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        
        imageUrls.push(publicUrl)
      }

      // Create product listing
      const { error: insertError } = await supabase.from('products').insert({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        category_id: formData.category,
        seller_id: user.id,
        location: formData.location,
        is_negotiable: formData.isNegotiable,
        images: imageUrls,
        status: 'available'
      })

      if (insertError) {
        toast.error(`Error creating listing: ${insertError.message}`)
        throw insertError
      }

      toast.success('Listing created successfully!')
      router.push('/my-listings')
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a New Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isNegotiable}
              onCheckedChange={(checked) => setFormData({ ...formData, isNegotiable: checked })}
            />
            <Label>Price is negotiable</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </Button>
        </form>
      </div>
    </div>
  )
}