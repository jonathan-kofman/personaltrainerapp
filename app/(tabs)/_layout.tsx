import { Tabs } from 'expo-router'
import { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext'

interface CustomTabIconProps {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  outlineName: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function TabLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, isDark } = useTheme()

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
    return null
  }

  if (!session) {
    return <Redirect href="/" />
  }

  // Dynamic colors based on theme
  const accentColor = isDark ? 'rgba(236, 72, 153, 0.9)' : 'rgba(147, 51, 234, 0.9)'
  const accentColorLight = isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(147, 51, 234, 0.2)'
  const accentColorMedium = isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)'
  const accentColorShadow = isDark ? 'rgba(236, 72, 153, 0.8)' : 'rgba(147, 51, 234, 0.6)'

  const tabBarBackgroundColor = isDark 
    ? 'rgba(30, 41, 59, 0.9)' 
    : 'rgba(248, 250, 252, 0.95)'
  
  const tabBarBorderColor = isDark 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.1)'

  const activeTintColor = isDark ? '#ec4899' : '#9333ea'
  const inactiveTintColor = isDark ? '#ffffff' : '#64748b'

  const CustomTabIcon = ({ focused, name, outlineName, color }: CustomTabIconProps) => (
    <View
      style={{
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: focused ? accentColorLight : 'transparent',
        borderWidth: focused ? 1 : 0,
        borderColor: focused ? accentColorMedium : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: focused ? accentColorShadow : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: focused ? 0.4 : 0,
        shadowRadius: focused ? 8 : 0,
        elevation: focused ? 6 : 0,
      }}
    >
      <Ionicons 
        name={focused ? name : outlineName} 
        size={24} 
        color={color}
      />
    </View>
  )

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarShowLabel: false, // Remove text labels
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 90,
          backgroundColor: tabBarBackgroundColor,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderWidth: 1,
          borderColor: tabBarBorderColor,
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: isDark ? 0.3 : 0.2,
          shadowRadius: 20,
          elevation: 15,
          paddingBottom: 25,
          paddingTop: 15,
          paddingHorizontal: 5,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 2,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabIcon 
              focused={focused}
              name="home"
              outlineName="home-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabIcon 
              focused={focused}
              name="compass"
              outlineName="compass-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="go-live"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabIcon 
              focused={focused}
              name="videocam"
              outlineName="videocam-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabIcon 
              focused={focused}
              name="person"
              outlineName="person-outline"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}