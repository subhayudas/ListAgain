"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Camera, User, ShoppingBag, Heart, MessageCircle, Settings, LogOut, Upload, CheckCircle, Star, Calendar, Phone, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { AnimatedButton } from '@/components/ui/animated-button'

interface UserProfile {
  id: string
  full_name: string
  avatar_url: string | null
  student_id: string | null
  phone: string | null
  bio: string | null
  rating: number | null
  location: string | null
}

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  status: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [savedProducts, setSavedProducts] = useState<Product[]>([])
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    full_name: '',
    avatar_url: null,
    student_id: null,
    phone: null,
    bio: null,
    rating: null,
    location: null
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchUserProducts()
      fetchSavedProducts()
    }
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, images, status')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) throw error
      if (data) setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  async function fetchSavedProducts() {
    try {
      // This is a placeholder - you would need to implement a saved/favorites table
      // For now, we'll just use some of the user's own products as a demo
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, images, status')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(2)

      if (error) throw error
      if (data) setSavedProducts(data)
    } catch (error) {
      console.error('Error fetching saved products:', error)
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    setUpdating(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          student_id: profile.student_id,
          phone: profile.phone,
          bio: profile.bio,
          location: profile.location
        })
        .eq('id', user?.id)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files.length) return

    setUploadingAvatar(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`

    try {
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update the user profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id)

      if (updateError) throw updateError

      // Update local state
      setProfile({ ...profile, avatar_url: publicUrl })
      toast.success('Avatar updated successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* New Profile Header - Redesigned */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Banner Background with Gradient */}
              <div className="h-40 bg-gradient-to-r from-primary to-secondary opacity-80"></div>
              
              <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
                  {/* Avatar with Upload Button */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl">
                        {profile.full_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:scale-110 transition-transform">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploadingAvatar}
                      />
                      {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </label>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{user?.email}</span>
                      </div>
                      {profile.location && (
                        <div className="flex items-center sm:ml-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/my-listings">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        My Listings
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {/* Activity Summary - New Section replacing Bio */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Activity Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                            <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                            <span className="text-2xl font-bold">{products.length}</span>
                            <span className="text-sm text-muted-foreground">Listings</span>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                            <Heart className="h-8 w-8 text-primary mb-2" />
                            <span className="text-2xl font-bold">{savedProducts.length}</span>
                            <span className="text-sm text-muted-foreground">Saved</span>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                            <MessageCircle className="h-8 w-8 text-primary mb-2" />
                            <span className="text-2xl font-bold">0</span>
                            <span className="text-sm text-muted-foreground">Messages</span>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                            <Star className="h-8 w-8 text-primary mb-2" />
                            <span className="text-2xl font-bold">{profile.rating || 0}</span>
                            <span className="text-sm text-muted-foreground">Rating</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Listings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Existing products section - unchanged */}
                        {products.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {products.map((product) => (
                              <Link href={`/products/${product.id}`} key={product.id}>
                                <div className="group relative rounded-lg overflow-hidden">
                                  <div className="aspect-square bg-muted">
                                    <img 
                                      src={product.images[0] || 'https://via.placeholder.com/200'} 
                                      alt={product.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="p-2">
                                    <p className="font-medium truncate">{product.title}</p>
                                    <p className="text-primary font-bold">₹{product.price}</p>
                                  </div>
                                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                    {product.status}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">You haven't listed any products yet</p>
                            <Button asChild className="mt-4">
                              <Link href="/sell">Create a Listing</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {/* Account Stats - New Section replacing Profile Completion */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Calendar className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Member Since</p>
                                <p className="text-xs text-muted-foreground">
                                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Phone className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Contact</p>
                                <p className="text-xs text-muted-foreground">
                                  {profile.phone || 'Not provided'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <CreditCard className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Student ID</p>
                                <p className="text-xs text-muted-foreground">
                                  {profile.student_id || 'Not provided'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                        <AnimatedButton asChild containerClassName="w-full mb-2">
                            <Link href="/sell">
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Create New Listing
                            </Link>
                          </AnimatedButton>
                          
                          <AnimatedButton asChild variant="outline" containerClassName="w-full mb-2">
                            <Link href="/my-listings">
                              <User className="h-4 w-4 mr-2" />
                              View All Listings
                            </Link>
                          </AnimatedButton>
                          
                          <AnimatedButton asChild variant="outline" containerClassName="w-full">
                            <Link href="/messages">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Messages
                            </Link>
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            {/* Rest of the tabs remain unchanged */}
            {/* My Listings Tab */}
            <TabsContent value="listings">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>My Listings</CardTitle>
                      <CardDescription>Manage all your product listings</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/sell">Create New</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                          <Link href={`/products/${product.id}`} key={product.id}>
                            <div className="group relative rounded-lg overflow-hidden border border-border">
                              <div className="aspect-square bg-muted">
                                <img 
                                  src={product.images[0] || 'https://via.placeholder.com/200'} 
                                  alt={product.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-3">
                                <p className="font-medium truncate">{product.title}</p>
                                <p className="text-primary font-bold">₹{product.price}</p>
                              </div>
                              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                {product.status}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">You haven't listed any products yet</p>
                        <Button asChild>
                          <Link href="/sell">Create a Listing</Link>
                        </Button>
                      </div>
                    )}
                    
                    {products.length > 0 && (
                      <div className="mt-6 text-center">
                        <Button asChild variant="outline">
                          <Link href="/my-listings">View All Listings</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Saved Items Tab */}
            <TabsContent value="saved">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedProducts.map((product) => (
                          <Link href={`/products/${product.id}`} key={product.id}>
                            <div className="group relative rounded-lg overflow-hidden border border-border">
                              <div className="aspect-square bg-muted">
                                <img 
                                  src={product.images[0] || 'https://via.placeholder.com/200'} 
                                  alt={product.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-3">
                                <p className="font-medium truncate">{product.title}</p>
                                <p className="text-primary font-bold">${product.price}</p>
                              </div>
                              <div className="absolute top-2 right-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm">
                                  <Heart className="h-4 w-4 fill-primary text-primary" />
                                </Button>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">You haven't saved any items yet</p>
                        <Button asChild>
                          <Link href="/products">Browse Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={updateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={profile.bio || ''}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="Tell others about yourself"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location || ''}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          placeholder="Your city or campus location"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={profile.student_id || ''}
                          onChange={(e) => setProfile({ ...profile, student_id: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>

                      <Button type="submit" disabled={updating}>
                        {updating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}

// Helper function to calculate profile completion percentage
function calculateProfileCompletion() {
  // This would be implemented to calculate the percentage based on filled fields
  return 75; // Example value
}
