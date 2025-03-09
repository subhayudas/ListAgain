"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Filter, Search, X, ChevronDown } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from '@/components/ui/separator'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  condition: string
  description: string
  category_id: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [condition, setCondition] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  // Add sort state
  const [sortBy, setSortBy] = useState<string>("newest")
  const productsPerPage = 9
  // Add debounce state for search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  // Add effect to handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [search])

  // Update fetchProducts to run when any filter changes
  useEffect(() => {
    setCurrentPage(1)
    fetchProducts()
  }, [debouncedSearch, selectedCategory, condition, priceRange, sortBy])

  // Separate effect for pagination
  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  async function fetchProducts() {
    setLoading(true)
    
    // Add console logs to debug
    console.log("Fetching products with filters:", {
      search: debouncedSearch,
      category: selectedCategory,
      condition,
      priceRange
    });
    
    // Count total products for pagination
    let countQuery = supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('status', 'available')
      .gte('price', priceRange[0])
      .lte('price', priceRange[1])

    if (debouncedSearch) {
      countQuery = countQuery.ilike('title', `%${debouncedSearch}%`)
    }

    if (selectedCategory && selectedCategory !== 'all') {
      countQuery = countQuery.eq('category_id', selectedCategory)
    }

    if (condition && condition !== 'all') {
      countQuery = countQuery.eq('condition', condition)
    }

    const { count } = await countQuery
    setTotalProducts(count || 0)

    // Fetch products with pagination
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'available')
      .gte('price', priceRange[0])
      .lte('price', priceRange[1])
      .range((currentPage - 1) * productsPerPage, currentPage * productsPerPage - 1)
    
    // Apply sorting based on sortBy value
    if (sortBy === "newest") {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === "price-low") {
      query = query.order('price', { ascending: true })
    } else if (sortBy === "price-high") {
      query = query.order('price', { ascending: false })
    }

    if (debouncedSearch) {
      query = query.ilike('title', `%${debouncedSearch}%`)
    }

    if (selectedCategory && selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory)
    }

    if (condition && condition !== 'all') {
      query = query.eq('condition', condition)
    }

    const { data, error } = await query
    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setPriceRange([0, 100000])
    setCondition('all')
  }

  const applyFilters = () => {
    setCurrentPage(1)
    fetchProducts()
    setMobileFiltersOpen(false)
  }

 

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const FilterControls = () => {
    const [localSearch, setLocalSearch] = useState(search);
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setSearch(localSearch);
      }, 300);
      
      return () => clearTimeout(timer);
    }, [localSearch]);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setPriceRange(localPriceRange);
      }, 300);
      
      return () => clearTimeout(timer);
    }, [localPriceRange]);
    
    useEffect(() => {
      if (!search) {
        setLocalSearch('');
      }
    }, [search]);
    
    useEffect(() => {
      setLocalPriceRange(priceRange);
    }, [priceRange]);
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Search</h3>
            {localSearch && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2" 
                onClick={() => {
                  setLocalSearch('');
                  setSearch('');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Rest of the filter controls remain unchanged */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Category</h3>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Price Range</h3>
            <Slider
              defaultValue={[0, 100000]}
              max={100000}
              step={1000}
              value={localPriceRange}
              onValueChange={setLocalPriceRange}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{localPriceRange[0]}</span>
              <span>₹{localPriceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Condition</h3>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Condition</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={resetFilters} variant="outline" className="w-full">
            Reset Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Browse Products</h1>
        
        {/* Mobile filter button */}
        <div className="md:hidden">
          <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>
                  Refine your product search
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4">
                <FilterControls />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64 shrink-0 sticky top-24 self-start">
          <div className="bg-card rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-8 text-xs"
              >
                Reset All
              </Button>
            </div>
            <Separator className="mb-4" />
            <FilterControls />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Results summary */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0}-
              {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/400'}
                          alt={product.title}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {product.condition}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                        <p className="text-xl font-bold mt-1 text-primary">₹{product.price}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="mt-auto pt-4">
                          <Button variant="outline" className="w-full mt-2">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
              <Button onClick={resetFilters} variant="outline" className="mt-4">
                Reset Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show first page, last page, current page, and pages around current
                  let pageToShow = 0; // Initialize with a default value instead of null
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    // Near start
                    if (i < 4) {
                      pageToShow = i + 1;
                    } else {
                      pageToShow = totalPages;
                    }
                  } else if (currentPage >= totalPages - 2) {
                    // Near end
                    if (i === 0) {
                      pageToShow = 1;
                    } else {
                      pageToShow = totalPages - 4 + i;
                    }
                  } else {
                    // Middle of pagination
                    if (i === 0) {
                      pageToShow = 1;
                    } else if (i === 4) {
                      pageToShow = totalPages;
                    } else {
                      pageToShow = currentPage - 1 + i;
                    }
                  }
                  
                  return (
                    <PaginationItem key={pageToShow}>
                      {pageToShow === 1 && currentPage > 3 && totalPages > 5 && (
                        <>
                          <PaginationLink 
                            onClick={() => handlePageChange(1)}
                            isActive={currentPage === 1}
                          >
                            1
                          </PaginationLink>
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center">...</span>
                          </PaginationItem>
                        </>
                      )}
                      
                      {pageToShow !== 1 && pageToShow !== totalPages && (
                        <PaginationLink 
                          onClick={() => handlePageChange(pageToShow)}
                          isActive={currentPage === pageToShow}
                        >
                          {pageToShow}
                        </PaginationLink>
                      )}
                      
                      {pageToShow === totalPages && currentPage < totalPages - 2 && totalPages > 5 && (
                        <>
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center">...</span>
                          </PaginationItem>
                          <PaginationLink 
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </>
                      )}
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}
