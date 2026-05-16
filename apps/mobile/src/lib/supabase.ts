import { createClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

// Handle deep links for OAuth callback
if (Capacitor.isNativePlatform()) {
  App.addListener('appUrlOpen', async ({ url }) => {
    if (url.includes('auth/callback') || url.includes('access_token')) {
      const urlObj = new URL(url)
      const params = new URLSearchParams(urlObj.hash.substring(1) || urlObj.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
      }
    }
  })
}

