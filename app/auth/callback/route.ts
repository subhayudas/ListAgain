import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Check if user profile exists, if not create one
      const { data: userData } = await supabase.auth.getUser()
      
      if (userData.user) {
        // Check if user exists in the users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', userData.user.id)
          .single()
          
        if (!existingUser) {
          // Create user profile
          await supabase.from('users').insert({
            id: userData.user.id,
            email: userData.user.email,
            full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name,
            avatar_url: userData.user.user_metadata?.avatar_url
          })
        }
      }
    }
  }

  // Redirect to the home page after successful authentication
  return NextResponse.redirect(new URL('/', request.url))
}