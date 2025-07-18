import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Star shape component
const StarShape = ({ size = 6 }) => {
  return (
    <View style={[styles.star, { width: size, height: size }]}>
      <View style={[styles.starLine, styles.starVertical, { height: size }]} />
      <View style={[styles.starLine, styles.starHorizontal, { width: size }]} />
      <View style={[styles.starLine, styles.starDiagonal1, { width: size * 0.7 }]} />
      <View style={[styles.starLine, styles.starDiagonal2, { width: size * 0.7 }]} />
    </View>
  );
};

// Animated Star component
const AnimatedSparkle = ({ size = 6, style = {}, delay = 0 }) => {
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
      <StarShape size={size} />
    </Animated.View>
  );
};

// Logo component with subtle animation
const LogoIcon = ({ size = 180 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [scaleAnim]);

  return (
    <Animated.View 
      style={[
        styles.logoImageContainer, 
        { 
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <Image
        source={require('../../assets/logo.png')} // Replace with your logo path
        style={{
          width: size,
          height: size,
          resizeMode: 'contain',
        }}
      />
    </Animated.View>
  );
};

interface WelcomeScreenProps {
  onLogin: () => void;
}

export default function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  
  const [fontsLoaded] = useFonts({
      'PlayfairDisplay-Black': require('../../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf'),
      'PlayfairDisplay-BlackItalic': require('../../assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeInAnim, fontsLoaded]);

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#F3E8FF', '#E879F9', '#C084FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Original scattered stars */}
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 120, left: 50 }} delay={0} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: 180, right: 80 }} delay={200} />
        <AnimatedSparkle size={16} style={{ position: 'absolute', top: 250, left: 80 }} delay={400} />
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: 320, right: 120 }} delay={600} />
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: 400, left: 60 }} delay={800} />
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: 480, right: 100 }} delay={1000} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: 580, left: 120 }} delay={1200} />
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: 650, right: 60 }} delay={1400} />
        
        {/* Stars around and on top of the logo area */}
        {/* Top of logo */}
        <AnimatedSparkle size={18} style={{ position: 'absolute', top: height * 0.15, left: width * 0.5 - 9 }} delay={300} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: height * 0.12, left: width * 0.4 }} delay={500} />
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: height * 0.18, right: width * 0.35 }} delay={700} />
        
        {/* Left side of logo */}
        <AnimatedSparkle size={16} style={{ position: 'absolute', top: height * 0.25, left: width * 0.15 }} delay={900} />
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: height * 0.32, left: width * 0.2 }} delay={1100} />
        <AnimatedSparkle size={12} style={{ position: 'absolute', top: height * 0.38, left: width * 0.12 }} delay={1300} />
        
        {/* Right side of logo */}
        <AnimatedSparkle size={14} style={{ position: 'absolute', top: height * 0.28, right: width * 0.18 }} delay={1500} />
        <AnimatedSparkle size={11} style={{ position: 'absolute', top: height * 0.35, right: width * 0.15 }} delay={1700} />
        <AnimatedSparkle size={13} style={{ position: 'absolute', top: height * 0.42, right: width * 0.22 }} delay={1900} />
        
        {/* Around the logo corners */}
        <AnimatedSparkle size={9} style={{ position: 'absolute', top: height * 0.22, left: width * 0.25 }} delay={2100} />
        <AnimatedSparkle size={15} style={{ position: 'absolute', top: height * 0.45, left: width * 0.28 }} delay={2300} />
        <AnimatedSparkle size={8} style={{ position: 'absolute', top: height * 0.24, right: width * 0.28 }} delay={2500} />
        <AnimatedSparkle size={11} style={{ position: 'absolute', top: height * 0.47, right: width * 0.25 }} delay={2700} />
        
        {/* Additional stars near the app name */}
        <AnimatedSparkle size={10} style={{ position: 'absolute', top: height * 0.52, left: width * 0.15 }} delay={2900} />
        <AnimatedSparkle size={13} style={{ position: 'absolute', top: height * 0.55, right: width * 0.18 }} delay={3100} />
        
        <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <LogoIcon size={220} />
          </View>

          {/* App Name */}
          <Text style={styles.appName}>Gem</Text>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 10, // Reduced from 30 to bring logo closer to text
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 90,
    fontFamily: 'PlayfairDisplay-Black',
    color: 'white',
    marginBottom: 100,
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    // Add a second shadow for thickness effect
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
    minWidth: 180,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  getStartedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    minWidth: 180,
  },
  getStartedButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Star styles
  star: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  starLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    shadowColor: 'white',
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