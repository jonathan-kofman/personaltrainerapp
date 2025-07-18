import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

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

export default function NotificationsScreen() {
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
  const accentColor = isDark ? 'rgba(236, 72, 153, 0.9)' : 'rgba(147, 51, 234, 0.9)';
  const accentColorLight = isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(147, 51, 234, 0.2)';
  const accentColorMedium = isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)';
  const accentColorGlow = isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(147, 51, 234, 0.15)';

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
    mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      padding: 40,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      minHeight: height * 0.7,
    },
    bellGlow: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: accentColorGlow,
      shadowColor: accentColorMedium,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      zIndex: -1,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 15,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    subtitle: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 25,
      fontWeight: '500',
    },
    description: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 10,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      minWidth: 200,
    },
    featureText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
      fontWeight: '500',
    },
    comingSoonButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: accentColorLight,
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderWidth: 2,
      borderColor: accentColorMedium,
      shadowColor: accentColorLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    comingSoonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
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
        {/* Animated sparkles scattered around */}
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 80, left: 30 }} delay={0} color={sparkleColor} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: 140, right: 40 }} delay={200} color={sparkleColor} />
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: 200, left: 50 }} delay={400} color={sparkleColor} />
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: 280, right: 60 }} delay={600} color={sparkleColor} />
        <AnimatedSparkle size={9} style={{ position: 'absolute', top: 360, left: 40 }} delay={800} color={sparkleColor} />
        <AnimatedSparkle size={11} style={{ position: 'absolute', top: 440, right: 50 }} delay={1000} color={sparkleColor} />
        <AnimatedSparkle size={13} style={{ position: 'absolute', top: 520, left: 60 }} delay={1200} color={sparkleColor} />
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 600, right: 30 }} delay={1400} color={sparkleColor} />
        <AnimatedSparkle size={15} style={{ position: 'absolute', top: 680, left: 70 }} delay={1600} color={sparkleColor} />

        <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={themedStyles.headerTitle}>Notifications</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {/* Main Content */}
            <View style={themedStyles.mainContent}>
              <View style={styles.iconContainer}>
                <View style={styles.notificationIconWrapper}>
                  <Ionicons name="notifications" size={64} color={accentColor} />
                  <View style={themedStyles.bellGlow} />
                </View>
              </View>

              <Text style={themedStyles.title}>🔔 Notifications Coming Soon!</Text>
              
              <Text style={themedStyles.subtitle}>Stay updated with the latest</Text>
              
              <View style={styles.descriptionContainer}>
                <Text style={themedStyles.description}>
                  Get notified when your favorite streamers go live, receive updates on new content, 
                  and never miss out on the action!
                </Text>
              </View>

              <View style={styles.featuresList}>
                <View style={themedStyles.featureItem}>
                  <Ionicons name="radio" size={20} color={accentColor} />
                  <Text style={themedStyles.featureText}>Live stream alerts</Text>
                </View>
                
                <View style={themedStyles.featureItem}>
                  <Ionicons name="heart" size={20} color={accentColor} />
                  <Text style={themedStyles.featureText}>Follower updates</Text>
                </View>
                
                <View style={themedStyles.featureItem}>
                  <Ionicons name="chatbubbles" size={20} color={accentColor} />
                  <Text style={themedStyles.featureText}>Chat mentions</Text>
                </View>
              </View>

              <TouchableOpacity style={themedStyles.comingSoonButton}>
                <Ionicons name="time" size={18} color={theme.text} />
                <Text style={themedStyles.comingSoonText}>Coming Soon</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  notificationIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  featuresList: {
    alignItems: 'flex-start',
    marginBottom: 30,
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