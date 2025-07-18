import React, { useState, useEffect, useRef } from 'react'
import { 
  Alert, 
  StyleSheet, 
  View, 
  Text, 
  Dimensions,
  StatusBar,
  Animated,
  TouchableOpacity
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { CustomButton, CustomInput } from '../../components/CustomUI'
import { router, Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useTheme } from '../../contexts/ThemeContext'

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

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
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

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      // Check if the error is related to email verification
      if (error.message.includes('Email not confirmed') || 
          error.message.includes('email_not_confirmed') ||
          error.message.includes('not confirmed')) {
        
        // Redirect to email verification screen with email and password
        Alert.alert(
          'Email Not Verified', 
          'Please verify your email address to continue.',
          [
            {
              text: 'Verify Now',
              onPress: () => {
                router.push({
                  pathname: '/(auth)/verification',
                  params: { 
                    email: email, 
                    password: password,
                    fromSignIn: 'true'
                  }
                });
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        // Handle other sign-in errors normally
        Alert.alert('Sign In Error', error.message)
      }
    } else {
      router.replace('/(tabs)/home')
    }
    setLoading(false)
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert(
        'Email Required', 
        'Please enter your email address first, then tap "Forgot Password?"'
      );
      return;
    }

    setResetLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      Alert.alert('Reset Password Error', error.message);
    } else {
      Alert.alert(
        'Password Reset Email Sent',
        `We've sent a password reset link to ${email}. Please check your email and follow the instructions to reset your password.`,
        [
          {
            text: 'OK',
            onPress: () => console.log('Password reset email sent')
          }
        ]
      );
    }
    
    setResetLoading(false);
  }

  if (!fontsLoaded) {
    return null;
  }

  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: 42,
      fontFamily: 'PlayfairDisplay-Black',
      color: theme.text,
      marginBottom: 12,
      letterSpacing: 2,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: 'center',
      fontWeight: '300',
      letterSpacing: 0.5,
    },
    primaryButton: {
      backgroundColor: accentColorLight,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 60,
      borderWidth: 2,
      borderColor: accentColorMedium,
      shadowColor: accentColorLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledButton: {
      opacity: 0.6,
    },
    primaryButtonText: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
      marginTop: 8,
      marginBottom: 8,
    },
    forgotPasswordText: {
      fontSize: 15,
      color: accentColor,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    signUpText: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    signUpLinkText: {
      fontSize: 16,
      color: accentColor,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Animated sparkles */}
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 100, left: 30 }} delay={0} color={sparkleColor} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: 150, right: 40 }} delay={200} color={sparkleColor} />
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: 200, left: 60 }} delay={400} color={sparkleColor} />
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: 300, right: 50 }} delay={600} color={sparkleColor} />
        <AnimatedSparkle size={16} style={{ position: 'absolute', top: 450, left: 40 }} delay={800} color={sparkleColor} />
        <AnimatedSparkle size={9} style={{ position: 'absolute', top: 550, right: 70 }} delay={1000} color={sparkleColor} />
        <AnimatedSparkle size={11} style={{ position: 'absolute', top: 650, left: 50 }} delay={1200} color={sparkleColor} />
        <AnimatedSparkle size={13} style={{ position: 'absolute', top: 750, right: 30 }} delay={1400} color={sparkleColor} />

        <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
          {/* Back Button */}
          <TouchableOpacity style={themedStyles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={themedStyles.title}>Welcome Back</Text>
            <Text style={themedStyles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <CustomInput
                label="Email"
                leftIcon={<Ionicons name="mail-outline" size={20} color={theme.textSecondary} />}
                onChangeText={(text: string) => setEmail(text)}
                value={email}
                placeholder="your-email@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.verticallySpaced}>
              <CustomInput
                label="Password"
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />}
                onChangeText={(text: string) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Enter your password"
                autoCapitalize="none"
              />
            </View>

            {/* Forgot Password Link */}
            <View style={themedStyles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword} disabled={resetLoading}>
                <Text style={themedStyles.forgotPasswordText}>
                  {resetLoading ? 'Sending...' : 'Forgot Password?'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.verticallySpaced, styles.mt20]}>
              <TouchableOpacity 
                style={[themedStyles.primaryButton, loading && themedStyles.disabledButton]} 
                disabled={loading || !email || !password}
                onPress={() => signInWithEmail()}
              >
                <Text style={themedStyles.primaryButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={themedStyles.signUpText}>Don't have an account? </Text>
              <Link href="/(auth)/signup" style={styles.signUpLink}>
                <Text style={themedStyles.signUpLinkText}>Sign Up</Text>
              </Link>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  formContainer: {
    width: '100%',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  signUpLink: {
    marginLeft: 4,
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