import { Redirect, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import WelcomeScreen from '../components/welcome/WelcomeScreen'

export default function AuthScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return null // or loading screen
  }

  if (session) {
    return <Redirect href="/(tabs)/home" />
  }

  // Navigate to signin screen when login is pressed
  return <WelcomeScreen onLogin={() => router.push('/(auth)/signin')} />
}