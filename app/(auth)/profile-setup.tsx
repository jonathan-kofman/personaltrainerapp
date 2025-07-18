import React, { useState, useEffect, useRef } from 'react'
import { 
  Alert, 
  StyleSheet, 
  View, 
  Text, 
  StatusBar,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { CustomInput } from '../../components/CustomUI'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useTheme } from '../../contexts/ThemeContext'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

export default function ProfileSetup() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark } = useTheme();
  
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Black': require('../../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf'),
  });

  // Dynamic gradient colors based on theme
  const gradientColors: readonly [string, string, string] = isDark 
    ? ['#1e293b', '#334155', '#475569'] // Dark theme colors
    : ['#f8fafc', '#e2e8f0', '#cbd5e1']; // Light theme colors

  // Dynamic sparkle color based on theme
  const sparkleColor = isDark 
    ? 'rgba(236, 72, 153, 0.9)' 
    : 'rgba(147, 51, 234, 0.9)';

  // Dynamic accent colors
  const accentColor = isDark ? 'rgba(236, 72, 153, 0.9)' : 'rgba(147, 51, 234, 0.9)';
  const accentColorLight = isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(147, 51, 234, 0.2)';
  const accentColorMedium = isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)';

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeInAnim, fontsLoaded]);

  // Check username availability with debounce
  useEffect(() => {
    if (username.length >= 3) {
      const timer = setTimeout(() => {
        checkUsernameAvailability();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [username]);

  async function checkUsernameAvailability() {
    if (username.length < 3) return;
    
    setCheckingUsername(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned, username is available
        setUsernameAvailable(true);
      } else if (data) {
        // Username exists
        setUsernameAvailable(false);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
    
    setCheckingUsername(false);
  }

  function validateUsername(text: string) {
    // Remove invalid characters and convert to lowercase, limit to 20 characters
    const cleaned = text.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
    setUsername(cleaned);
  }

  async function completeProfileSetup() {
    if (!username || !displayName) {
      Alert.alert('Missing Information', 'Please fill in both username and display name.');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Username Too Short', 'Username must be at least 3 characters long.');
      return;
    }

    if (usernameAvailable === false) {
      Alert.alert('Username Taken', 'This username is already taken. Please choose another.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'User session not found. Please sign in again.');
        router.replace('/(auth)/signin');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username.toLowerCase(),
          display_name: displayName.trim()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      } else {
        Alert.alert(
          'Welcome! 🎉', 
          'Your profile has been set up successfully!',
          [
            { 
              text: 'Continue', 
              onPress: () => {
                router.replace('/(tabs)/home');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  }

  if (!fontsLoaded) {
    return null;
  }

  // Username status icon and color
  const getUsernameStatus = () => {
    if (username.length < 3) {
      return { icon: null, color: theme.textSecondary };
    }
    if (checkingUsername) {
      return { icon: 'time-outline', color: theme.textSecondary };
    }
    if (usernameAvailable === true) {
      return { icon: 'checkmark-circle-outline', color: '#22c55e' };
    }
    if (usernameAvailable === false) {
      return { icon: 'close-circle-outline', color: '#ef4444' };
    }
    return { icon: null, color: theme.textSecondary };
  };

  const usernameStatus = getUsernameStatus();

  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: screenWidth < 375 ? 24 : 28,
      fontFamily: 'PlayfairDisplay-Black',
      color: theme.text,
      marginBottom: 8,
      letterSpacing: 1.8,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      textAlign: 'center',
    },
    primaryButton: {
      backgroundColor: accentColorLight,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderWidth: 2,
      borderColor: accentColorMedium,
      shadowColor: accentColorLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
    },
    disabledButton: {
      opacity: 0.6,
    },
    primaryButtonText: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    iconBackground: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: accentColorLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      borderWidth: 2,
      borderColor: accentColorMedium,
    },
    usernameHint: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'left',
      marginTop: 6,
      fontStyle: 'italic',
    },
    usernameStatus: {
      fontSize: 13,
      textAlign: 'left',
      marginTop: 6,
      fontWeight: '500',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderRadius: 25,
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderWidth: 2,
      borderColor: theme.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    secondaryButtonText: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      letterSpacing: 0.3,
    },
  });

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Animated sparkles - positioned responsively */}
          <AnimatedSparkle size={8} style={{ position: 'absolute', top: '10%', left: '10%' }} delay={0} color={sparkleColor} />
          <AnimatedSparkle size={12} style={{ position: 'absolute', top: '15%', right: '8%' }} delay={200} color={sparkleColor} />
          <AnimatedSparkle size={6} style={{ position: 'absolute', top: '25%', left: '15%' }} delay={400} color={sparkleColor} />
          <AnimatedSparkle size={10} style={{ position: 'absolute', top: '35%', right: '12%' }} delay={600} color={sparkleColor} />
          <AnimatedSparkle size={14} style={{ position: 'absolute', top: '45%', left: '8%' }} delay={800} color={sparkleColor} />
          <AnimatedSparkle size={9} style={{ position: 'absolute', top: '60%', right: '20%' }} delay={1000} color={sparkleColor} />
          <AnimatedSparkle size={7} style={{ position: 'absolute', top: '70%', left: '12%' }} delay={1200} color={sparkleColor} />
          <AnimatedSparkle size={11} style={{ position: 'absolute', top: '80%', right: '10%' }} delay={1400} color={sparkleColor} />

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
              <View style={styles.header}>
                <View style={themedStyles.iconContainer}>
                  <View style={themedStyles.iconBackground}>
                    <Ionicons name="person-add-outline" size={32} color={accentColor} />
                  </View>
                </View>

                <Text style={themedStyles.title}>Set Up Your Profile</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.verticallySpaced}>
                  <View style={styles.inputContainer}>
                    <CustomInput
                      label="Username"
                      leftIcon={<Ionicons name="at-outline" size={20} color={theme.textSecondary} />}
                      onChangeText={validateUsername}
                      value={username}
                      placeholder="your_username"
                      autoCapitalize="none"
                    />
                    {usernameStatus.icon && (
                      <View style={styles.statusIcon}>
                        <Ionicons 
                          name={usernameStatus.icon as any} 
                          size={20} 
                          color={usernameStatus.color} 
                        />
                      </View>
                    )}
                  </View>
                  <Text style={themedStyles.usernameHint}>
                    Lowercase letters, numbers, and underscores only
                  </Text>
                  {username.length >= 3 && (
                    <Text style={[themedStyles.usernameStatus, { color: usernameStatus.color }]}>
                      {checkingUsername 
                        ? 'Checking availability...'
                        : usernameAvailable === true 
                          ? '✓ Username available'
                          : usernameAvailable === false 
                            ? '✗ Username already taken'
                            : ''
                      }
                    </Text>
                  )}
                </View>

                <View style={styles.verticallySpaced}>
                  <CustomInput
                    label="Display Name"
                    leftIcon={<Ionicons name="person-outline" size={20} color={theme.textSecondary} />}
                    onChangeText={(text: string) => setDisplayName(text.slice(0, 30))}
                    value={displayName}
                    placeholder="Your Display Name"
                  />
                </View>

                <View style={[styles.verticallySpaced, styles.mt20]}>
                  <TouchableOpacity 
                    style={[
                      themedStyles.primaryButton, 
                      (loading || !username || !displayName || usernameAvailable === false || username.length < 3) && themedStyles.disabledButton
                    ]} 
                    disabled={loading || !username || !displayName || usernameAvailable === false || username.length < 3}
                    onPress={completeProfileSetup}
                  >
                    <Text style={themedStyles.primaryButtonText}>
                      {loading ? 'Setting Up Profile...' : 'Save & Complete Setup'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.verticallySpaced, styles.mt15]}>
                  <TouchableOpacity 
                    style={themedStyles.secondaryButton}
                    onPress={() => router.replace('/(tabs)/home')}
                    disabled={loading}
                  >
                    <Text style={themedStyles.secondaryButtonText}>
                      Setup Later
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: screenHeight * 0.85,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    minHeight: screenHeight * 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 8,
    paddingBottom: 8,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  mt15: {
    marginTop: 15,
  },
  inputContainer: {
    position: 'relative',
  },
  statusIcon: {
    position: 'absolute',
    right: 15,
    top: 45, // Adjust based on your CustomInput height
    zIndex: 1,
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