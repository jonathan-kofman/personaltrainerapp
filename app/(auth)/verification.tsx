import React, { useState, useEffect, useRef } from 'react'
import { 
  Alert, 
  StyleSheet, 
  View, 
  Text, 
  StatusBar,
  Animated,
  TouchableOpacity,
  Linking
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useTheme } from '../../contexts/ThemeContext'

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

export default function EmailVerification() {
  const { email, password, fromSignIn } = useLocalSearchParams();
  const { theme, isDark } = useTheme();
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const [resendLoading, setResendLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
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

  // Get dynamic messaging based on where they came from
  const getSubtitleText = () => {
    if (isVerified) {
      return "Your email has been successfully verified. You can now access your account.";
    }
    
    if (fromSignIn === 'true') {
      return "Your email needs to be verified before you can sign in. We sent a verification link to:";
    }
    return "We sent a verification link to:";
  };

  const getTitleText = () => {
    if (isVerified) {
      return "Email Verified!";
    }
    
    if (fromSignIn === 'true') {
      return "Email Verification Required";
    }
    return "Check Your Email";
  };

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeInAnim, fontsLoaded]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsVerified(true);
          // Redirect to profile setup or home
          router.replace('/(auth)/profile-setup');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function resendVerificationEmail() {
    if (!email || typeof email !== 'string') {
      Alert.alert('Error', 'Email not found. Please go back and sign up again.');
      return;
    }

    setResendLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Verification email sent! Check your email and click the link to verify.');
    }
    setResendLoading(false);
  }

  async function checkVerificationStatus(silent = false) {
    if (!email || typeof email !== 'string') {
      if (!silent) {
        Alert.alert('Error', 'Email not found. Please go back and sign up again.');
      }
      return;
    }

    if (!password || typeof password !== 'string') {
      if (!silent) {
        Alert.alert('Error', 'Authentication error. Please go back and sign up again.');
      }
      return;
    }
  
    setCheckLoading(true);
    
    try {
      console.log('Checking verification for:', email);
      
      // Try to sign in - this will work if the email is verified
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // Check if the error is still about email verification
        if (error.message.includes('Email not confirmed') || 
            error.message.includes('email_not_confirmed') ||
            error.message.includes('not confirmed')) {
          
          if (!silent) {
            const message = fromSignIn === 'true' 
              ? 'Your email hasn\'t been verified yet. Please:\n\n1. Check your email (including spam folder)\n2. Click the verification link\n3. Try this button again'
              : 'Your email hasn\'t been verified yet. Please:\n\n1. Check your email (including spam folder)\n2. Click the verification link\n3. Try this button again';
              
            Alert.alert(
              'Not Verified Yet', 
              message,
              [{ text: 'OK' }]
            );
          }
        } else {
          // Some other error occurred
          console.error('Sign in error:', error);
          if (!silent) {
            Alert.alert('Error', error.message);
          }
        }
      } else if (data.user) {
        // Success! User is now signed in and verified
        setIsVerified(true);
        router.replace('/(auth)/profile-setup');
      }
      
    } catch (error) {
      console.error('Error checking verification:', error);
      if (!silent) {
        Alert.alert(
          'Error', 
          'Unable to check verification status. Please check your internet connection and try again.'
        );
      }
    }
    
    setCheckLoading(false);
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
      fontSize: 32,
      fontFamily: 'PlayfairDisplay-Black',
      color: theme.text,
      marginBottom: 12,
      letterSpacing: 1.5,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      fontWeight: '400',
      letterSpacing: 0.3,
      lineHeight: 24,
      marginBottom: 20,
    },
    emailText: {
      fontSize: 16,
      color: accentColor,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: 40,
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
      marginBottom: 16,
      width: '100%',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderWidth: 2,
      borderColor: accentColorMedium,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      width: '100%',
    },
    tertiaryButton: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 25,
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      width: '100%',
    },
    disabledButton: {
      opacity: 0.6,
    },
    primaryButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    secondaryButtonText: {
      color: accentColor,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    tertiaryButtonText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    iconBackground: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: accentColorLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    verifiedIcon: {
      backgroundColor: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
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
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: 80, left: 40 }} delay={0} color={sparkleColor} />
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: 130, right: 30 }} delay={200} color={sparkleColor} />
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 180, left: 70 }} delay={400} color={sparkleColor} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: 250, right: 60 }} delay={600} color={sparkleColor} />
        <AnimatedSparkle size={16} style={{ position: 'absolute', top: 350, left: 30 }} delay={800} color={sparkleColor} />
        <AnimatedSparkle size={11} style={{ position: 'absolute', top: 450, right: 80 }} delay={1000} color={sparkleColor} />
        <AnimatedSparkle size={9} style={{ position: 'absolute', top: 550, left: 50 }} delay={1200} color={sparkleColor} />
        <AnimatedSparkle size={13} style={{ position: 'absolute', top: 650, right: 40 }} delay={1400} color={sparkleColor} />

        <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
          {/* Back Button */}
          <TouchableOpacity style={themedStyles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.verificationContainer}>
            <View style={themedStyles.iconContainer}>
              <View style={[themedStyles.iconBackground, isVerified && themedStyles.verifiedIcon]}>
                <Ionicons 
                  name={isVerified ? "checkmark-circle-outline" : "mail-outline"} 
                  size={40} 
                  color={isVerified ? "#22c55e" : accentColor} 
                />
              </View>
            </View>

            <Text style={themedStyles.title}>
              {getTitleText()}
            </Text>
            <Text style={themedStyles.subtitle}>
              {getSubtitleText()}
            </Text>
            {!isVerified && <Text style={themedStyles.emailText}>{email}</Text>}
          </View>

          {/* Full-width button container */}
          <View style={styles.buttonContainer}>
            {isVerified ? (
              <TouchableOpacity 
                style={themedStyles.primaryButton}
                onPress={() => router.replace('/(auth)/profile-setup')}
              >
                <Text style={themedStyles.primaryButtonText}>
                  Continue to App
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  style={[themedStyles.primaryButton, checkLoading && themedStyles.disabledButton]} 
                  disabled={checkLoading}
                  onPress={() => checkVerificationStatus()}
                >
                  <Text style={themedStyles.primaryButtonText}>
                    {checkLoading ? 'Checking...' : 'I Verified My Email'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[themedStyles.secondaryButton, resendLoading && themedStyles.disabledButton]} 
                  disabled={resendLoading}
                  onPress={resendVerificationEmail}
                >
                  <Text style={themedStyles.secondaryButtonText}>
                    {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 0,
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