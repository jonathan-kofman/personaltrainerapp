// components/Account.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView, Text } from 'react-native'
import { CustomButton, CustomInput } from './CustomUI'
import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTheme } from '../contexts/ThemeContext'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [xHandle, setXHandle] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const { theme, isDark } = useTheme()

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, full_name, x_handle, avatar_url`)
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username || '')
        setFullName(data.full_name || '')
        setXHandle(data.x_handle || '')
        setAvatarUrl(data.avatar_url || '')
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error loading profile', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    full_name,
    x_handle,
    avatar_url,
  }: {
    username: string
    full_name: string
    x_handle: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        full_name,
        x_handle,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }

      Alert.alert('Success', 'Profile updated successfully!')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error updating profile', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    form: {
      flex: 1,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
    disabledInput: {
      color: theme.textSecondary,
      opacity: 0.6,
    },
    updateButton: {
      backgroundColor: isDark ? '#0A84FF' : '#007AFF',
      borderRadius: 8,
    },
    signOutButton: {
      borderColor: '#FF3B30',
      borderRadius: 8,
    },
    signOutButtonText: {
      color: '#FF3B30',
    },
  })

  return (
    <ScrollView contentContainerStyle={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>StreamApp Profile</Text>
        <Text style={themedStyles.subtitle}>Manage your account settings</Text>
      </View>

      <Avatar
        size={150}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url)
          updateProfile({ 
            username, 
            full_name: fullName, 
            x_handle: xHandle, 
            avatar_url: url 
          })
        }}
      />

      <View style={themedStyles.form}>
        <View style={themedStyles.verticallySpaced}>
          <CustomInput 
            label="Email" 
            value={session?.user?.email || ''} 
            onChangeText={() => {}} // No-op for disabled field
            disabled 
            inputStyle={themedStyles.disabledInput}
          />
        </View>

        <View style={themedStyles.verticallySpaced}>
          <CustomInput 
            label="Username" 
            value={username} 
            onChangeText={(text: string) => setUsername(text)} 
            placeholder="Enter your username"
          />
        </View>

        <View style={themedStyles.verticallySpaced}>
          <CustomInput 
            label="Full Name" 
            value={fullName} 
            onChangeText={(text: string) => setFullName(text)} 
            placeholder="Enter your full name"
          />
        </View>

        <View style={themedStyles.verticallySpaced}>
          <CustomInput 
            label="X Handle" 
            value={xHandle} 
            onChangeText={(text: string) => setXHandle(text)} 
            placeholder="@yourusername"
            autoCapitalize="none"
            leftIcon={<Ionicons name="logo-twitter" size={20} color={theme.textSecondary} />}
          />
        </View>

        <View style={[themedStyles.verticallySpaced, themedStyles.mt20]}>
          <CustomButton
            title={loading ? 'Updating...' : 'Update Profile'}
            onPress={() => updateProfile({ 
              username, 
              full_name: fullName, 
              x_handle: xHandle, 
              avatar_url: avatarUrl 
            })}
            disabled={loading}
            buttonStyle={themedStyles.updateButton}
            loading={loading}
          />
        </View>

        <View style={themedStyles.verticallySpaced}>
          <CustomButton 
            title="Sign Out" 
            onPress={async () => {
              await supabase.auth.signOut()
              router.replace('/') // This will redirect to auth screen
            }} 
            type="outline"
            buttonStyle={themedStyles.signOutButton}
            titleStyle={themedStyles.signOutButtonText}
          />
        </View>
      </View>
    </ScrollView>
  )
}