import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Image,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../lib/imageUpload'
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

// Star shape component
const StarShape = ({ size = 6, color }: { size?: number; color: string }) => {
  return (
    <View style={[styles.star, { width: size, height: size }]}>
      <View style={[styles.starLine, styles.starVertical, { height: size, backgroundColor: color }]} />
      <View style={[styles.starLine, styles.starHorizontal, { width: size, backgroundColor: color }]} />
      <View style={[styles.starLine, styles.starDiagonal1, { width: size * 0.7, backgroundColor: color }]} />
      <View style={[styles.starLine, styles.starDiagonal2, { width: size * 0.7, backgroundColor: color }]} />
    </View>
  );
};

// Animated Star component
const AnimatedSparkle = ({ size = 6, style = {}, delay = 0, color }: { 
  size?: number; 
  style?: any; 
  delay?: number; 
  color: string; 
}) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, [fadeAnim, rotateAnim, delay]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[
        { 
          opacity: fadeAnim,
          transform: [{ rotate: rotation }]
        }, 
        style
      ]} 
    >
      <StarShape size={size} color={color} />
    </Animated.View>
  );
};

interface SocialLinkInputProps {
  platform: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const SocialLinkInput = ({ platform, icon, value, onChangeText, placeholder }: SocialLinkInputProps) => {
  const { theme, isDark } = useTheme();
  
  const socialStyles = StyleSheet.create({
    socialLinkContainer: {
      marginBottom: 15,
    },
    socialLinkHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    socialLinkLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 8,
    },
    socialLinkInput: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.text,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
    },
  });

  return (
    <View style={socialStyles.socialLinkContainer}>
      <View style={socialStyles.socialLinkHeader}>
        <Ionicons name={icon as any} size={20} color={theme.text} />
        <Text style={socialStyles.socialLinkLabel}>{platform}</Text>
      </View>
      <TextInput
        style={socialStyles.socialLinkInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
      />
    </View>
  );
};

export default function EditProfileScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profile, setProfile] = useState({
    display_name: '', // Changed from full_name to display_name
    username: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
  });
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark } = useTheme();

  // Dynamic gradient colors based on theme
  const gradientColors: readonly [string, string, string] = isDark 
    ? ['#1e293b', '#334155', '#475569'] // Dark theme colors
    : ['#f8fafc', '#e2e8f0', '#cbd5e1']; // Light theme colors

  // Dynamic sparkle color based on theme
  const sparkleColor = isDark 
    ? 'rgba(236, 72, 153, 0.9)' 
    : 'rgba(147, 51, 234, 0.9)';

  // Dynamic accent colors
  const accentColor = isDark ? 'rgba(236, 72, 153, 0.8)' : 'rgba(147, 51, 234, 0.8)';
  const accentColorLight = isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(147, 51, 234, 0.2)';
  const accentColorMedium = isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)';

  useEffect(() => {
    const initializeScreen = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        await fetchProfile(session.user.id);
      }
      
      setIsInitializing(false);
      
      // Start fade in animation after data is loaded
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    };

    initializeScreen();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Profile fetch error:', error);
      } else if (data) {
        setProfile({
          display_name: data.display_name || '', // Changed from full_name to display_name
          username: data.username || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          banner_url: data.banner_url || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
          tiktok: data.tiktok || '',
          youtube: data.youtube || '',
        });
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        Alert.alert('Error', 'Failed to save profile');
        console.log('Save error:', error);
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
      console.log('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (type: 'avatar' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && session?.user?.id) {
      setLoading(true);
      
      try {
        // Upload image to Supabase Storage
        const bucket = type === 'avatar' ? 'avatars' : 'banners';
        const imageUrl = await uploadImage(result.assets[0].uri, bucket, session.user.id);
        
        if (imageUrl) {
          // Update profile with new image URL
          if (type === 'avatar') {
            setProfile(prev => ({ ...prev, avatar_url: imageUrl }));
          } else {
            setProfile(prev => ({ ...prev, banner_url: imageUrl }));
          }
          
          // Also update the database immediately
          const updateField = type === 'avatar' ? 'avatar_url' : 'banner_url';
          const { error } = await supabase
            .from('profiles')
            .update({ [updateField]: imageUrl })
            .eq('id', session.user.id);
            
          if (error) {
            console.error('Error updating profile image:', error);
            Alert.alert('Error', 'Failed to update profile image');
          }
        } else {
          Alert.alert('Error', 'Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    bannerOverlay: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
      borderRadius: 20,
      padding: 8,
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: accentColor,
    },
    avatarOverlay: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: accentColor,
      borderRadius: 15,
      padding: 6,
    },
    formSection: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    textInput: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 15,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    saveButton: {
      backgroundColor: accentColorLight,
      borderRadius: 15,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      borderWidth: 2,
      borderColor: accentColorMedium,
      shadowColor: accentColorLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: theme.text,
      fontSize: 18,
      fontWeight: 'bold',
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  });

  // Show loading state with same background to prevent white flash
  if (!session || isInitializing) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Show the same sparkles even during loading */}
          <AnimatedSparkle size={8} style={{ position: 'absolute', top: 80, left: 30 }} delay={0} color={sparkleColor} />
          <AnimatedSparkle size={12} style={{ position: 'absolute', top: 140, right: 40 }} delay={200} color={sparkleColor} />
          <AnimatedSparkle size={10} style={{ position: 'absolute', top: 200, left: 50 }} delay={400} color={sparkleColor} />
          <AnimatedSparkle size={14} style={{ position: 'absolute', top: 280, right: 60 }} delay={600} color={sparkleColor} />
          
          <View style={styles.loadingContainer}>
            
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Animated sparkles scattered around */}
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 80, left: 30 }} delay={0} color={sparkleColor} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: 140, right: 40 }} delay={200} color={sparkleColor} />
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: 200, left: 50 }} delay={400} color={sparkleColor} />
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: 280, right: 60 }} delay={600} color={sparkleColor} />
        <AnimatedSparkle size={9} style={{ position: 'absolute', top: 360, left: 40 }} delay={800} color={sparkleColor} />
        <AnimatedSparkle size={11} style={{ position: 'absolute', top: 440, right: 50 }} delay={1000} color={sparkleColor} />
        <AnimatedSparkle size={13} style={{ position: 'absolute', top: 520, left: 60 }} delay={1200} color={sparkleColor} />
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 600, right: 30 }} delay={1400} color={sparkleColor} />

        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={28} color={theme.text} />
              </TouchableOpacity>
              <Text style={themedStyles.headerTitle}>Edit Profile</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Banner Section */}
              <View style={styles.bannerSection}>
                <TouchableOpacity 
                  style={styles.bannerContainer}
                  onPress={() => pickImage('banner')}
                >
                  {profile.banner_url ? (
                    <Image source={{ uri: profile.banner_url }} style={styles.bannerImage} />
                  ) : (
                    <Image 
                      source={require('../../assets/default-banner.png')} 
                      style={styles.bannerImage} 
                    />
                  )}
                  <View style={themedStyles.bannerOverlay}>
                    <Ionicons name="camera" size={24} color="white" />
                  </View>
                </TouchableOpacity>

                {/* Profile Picture */}
                <TouchableOpacity 
                  style={styles.avatarContainer}
                  onPress={() => pickImage('avatar')}
                >
                  <Image
                    source={
                      profile.avatar_url 
                        ? { uri: profile.avatar_url }
                        : require('../../assets/default-avatar.jpeg')
                    }
                    style={themedStyles.avatarImage}
                  />
                  <View style={themedStyles.avatarOverlay}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Form Section */}
              <View style={themedStyles.formSection}>
                {/* Display Name */}
                <View style={styles.inputContainer}>
                  <Text style={themedStyles.inputLabel}>Display Name</Text>
                  <TextInput
                    style={themedStyles.textInput}
                    value={profile.display_name}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, display_name: text }))}
                    placeholder="Enter your display name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                {/* Username */}
                <View style={styles.inputContainer}>
                  <Text style={themedStyles.inputLabel}>Username</Text>
                  <TextInput
                    style={themedStyles.textInput}
                    value={profile.username}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, username: text }))}
                    placeholder="Enter your username"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                  />
                </View>

                {/* Bio */}
                <View style={styles.inputContainer}>
                  <Text style={themedStyles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[themedStyles.textInput, styles.bioInput]}
                    value={profile.bio}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Social Links */}
                <View style={styles.socialLinksSection}>
                  <Text style={themedStyles.sectionTitle}>Social Links</Text>
                  
                  <SocialLinkInput
                    platform="Instagram"
                    icon="logo-instagram"
                    value={profile.instagram}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, instagram: text }))}
                    placeholder="@username or full URL"
                  />

                  <SocialLinkInput
                    platform="Twitter"
                    icon="logo-twitter"
                    value={profile.twitter}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, twitter: text }))}
                    placeholder="@username or full URL"
                  />

                  <SocialLinkInput
                    platform="TikTok"
                    icon="logo-tiktok"
                    value={profile.tiktok}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, tiktok: text }))}
                    placeholder="@username or full URL"
                  />

                  <SocialLinkInput
                    platform="YouTube"
                    icon="logo-youtube"
                    value={profile.youtube}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, youtube: text }))}
                    placeholder="Channel name or full URL"
                  />
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                  style={[themedStyles.saveButton, loading && themedStyles.saveButtonDisabled]} 
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Text style={themedStyles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bannerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  socialLinksSection: {
    marginTop: 10,
  },
  // Star styles
  star: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  starLine: {
    position: 'absolute',
    shadowColor: 'rgba(236, 72, 153, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  starVertical: {
    width: 2,
    top: 0,
  },
  starHorizontal: {
    height: 2,
    left: 0,
  },
  starDiagonal1: {
    height: 2,
    transform: [{ rotate: '45deg' }],
  },
  starDiagonal2: {
    height: 2,
    transform: [{ rotate: '-45deg' }],
  },
});