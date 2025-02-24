"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'

interface Request {
  id: string
  title: string
  description: string
  budget_min: number
  budget_max: number
  created_at: string
  user: {
    full_name: string
    avatar_url: string
  }
  category: {
    name: string
  }
}

export default function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        user:users(full_name, avatar_url),
        category:categories(name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (data) {
      setRequests(data)
    }
    setLoading(false)
  }

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(search.toLowerCase()) ||
    request.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Request Board</h1>
        {user && (
          <Button asChild>
            <Link href="/requests/new">Post a Request</Link>
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{request.title}</h3>
                    <p className="text-muted-foreground">{request.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">
                      ${request.budget_min} - ${request.budget_max}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      Posted by {request.user.full_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {request.category.name}
                    </span>
                    <Button variant="outline" asChild>
                      <Link href={`/requests/${request.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}