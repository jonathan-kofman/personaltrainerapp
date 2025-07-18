import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

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

interface SettingsItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
  isDanger?: boolean;
}

const SettingsItem = ({ icon, title, onPress, showChevron = true, isDanger = false }: SettingsItemProps) => {
  const { theme, isDark } = useTheme();
  
  const itemStyles = StyleSheet.create({
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsItemText: {
      fontSize: 18,
      color: isDanger ? 'rgba(239, 68, 68, 0.9)' : theme.text,
      fontWeight: '500',
      marginLeft: 15,
    },
  });

  return (
    <TouchableOpacity style={itemStyles.settingsItem} onPress={onPress}>
      <View style={itemStyles.settingsItemLeft}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={isDanger ? 'rgba(239, 68, 68, 0.9)' : theme.text}
        />
        <Text style={itemStyles.settingsItemText}>{title}</Text>
      </View>
      {showChevron && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={theme.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

export default function DetailedSettingsScreen() {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark, setThemeMode, themeMode } = useTheme();

  // Dynamic gradient colors based on theme
  const gradientColors: readonly [string, string, string] = isDark 
    ? ['#1e293b', '#334155', '#475569'] // Dark theme colors
    : ['#f8fafc', '#e2e8f0', '#cbd5e1']; // Light theme colors

  // Dynamic sparkle color based on theme
  const sparkleColor = isDark 
    ? 'rgba(236, 72, 153, 0.9)' 
    : 'rgba(147, 51, 234, 0.9)';

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAccountSettings = () => {
    router.push('/profile/account-settings');
  };

  const handleHelpCenter = () => {
    console.log('Navigate to help center');
  };

  const handleTermsOfService = () => {
    console.log('Navigate to terms of service');
  };

  const handlePrivacyPolicy = () => {
    console.log('Navigate to privacy policy');
  };

  const handleCustomerSupport = () => {
    console.log('Navigate to customer support');
  };

  const handleNotificationSettings = () => {
    router.push('/notification-settings');
  };

  const handleSecuritySettings = () => {
    router.push('/security-settings');
  };

  const handleDataExport = () => {
    console.log('Navigate to data export');
  };

  const handleDeleteAccount = () => {
    console.log('Navigate to delete account');
  };

  const handleGoBack = () => {
    router.back();
  };

  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backButton: {
      padding: 8,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: 1,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
      marginLeft: 4,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    dangerSectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: 'rgba(239, 68, 68, 0.9)',
      marginBottom: 12,
      marginLeft: 4,
      textShadowColor: 'rgba(239, 68, 68, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    settingsSection: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    dangerSection: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
      shadowColor: 'rgba(239, 68, 68, 0.2)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    themeSection: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      padding: 20,
      marginBottom: 30,
    },
    themeTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    themeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    themeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeButtonActive: {
      backgroundColor: isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(147, 51, 234, 0.15)',
      borderColor: isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)',
    },
    themeButtonInactive: {
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    themeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
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
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity style={themedStyles.backButton} onPress={handleGoBack}>
                <Ionicons name="chevron-back" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={themedStyles.headerTitle}>Settings</Text>
              <View style={styles.spacer} />
            </View>

            {/* Theme Settings Section */}
            <View style={themedStyles.themeSection}>
              <Text style={themedStyles.themeTitle}>Appearance</Text>
              <View style={themedStyles.themeButtons}>
                <TouchableOpacity
                  style={[
                    themedStyles.themeButton,
                    themeMode === 'light' ? themedStyles.themeButtonActive : themedStyles.themeButtonInactive
                  ]}
                  onPress={() => setThemeMode('light')}
                >
                  <Ionicons name="sunny" size={20} color={theme.text} style={{ marginBottom: 4 }} />
                  <Text style={themedStyles.themeButtonText}>Light</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    themedStyles.themeButton,
                    themeMode === 'dark' ? themedStyles.themeButtonActive : themedStyles.themeButtonInactive
                  ]}
                  onPress={() => setThemeMode('dark')}
                >
                  <Ionicons name="moon" size={20} color={theme.text} style={{ marginBottom: 4 }} />
                  <Text style={themedStyles.themeButtonText}>Dark</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    themedStyles.themeButton,
                    themeMode === 'system' ? themedStyles.themeButtonActive : themedStyles.themeButtonInactive
                  ]}
                  onPress={() => setThemeMode('system')}
                >
                  <Ionicons name="phone-portrait" size={20} color={theme.text} style={{ marginBottom: 4 }} />
                  <Text style={themedStyles.themeButtonText}>System</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Settings Sections */}
            
            {/* Account Section */}
            <View style={styles.sectionContainer}>
              <Text style={themedStyles.sectionTitle}>Account</Text>
              <View style={themedStyles.settingsSection}>
                <SettingsItem
                  icon="person-outline"
                  title="Account Settings"
                  onPress={handleAccountSettings}
                />
                
                <SettingsItem
                  icon="notifications-outline"
                  title="Notification Settings"
                  onPress={handleNotificationSettings}
                />
                
                <SettingsItem
                  icon="shield-outline"
                  title="Security & Privacy"
                  onPress={handleSecuritySettings}
                />
              </View>
            </View>

            {/* Data Section */}
            <View style={styles.sectionContainer}>
              <Text style={themedStyles.sectionTitle}>Data</Text>
              <View style={themedStyles.settingsSection}>
                <SettingsItem
                  icon="download-outline"
                  title="Export Data"
                  onPress={handleDataExport}
                />
              </View>
            </View>

            {/* Support Section */}
            <View style={styles.sectionContainer}>
              <Text style={themedStyles.sectionTitle}>Support</Text>
              <View style={themedStyles.settingsSection}>
                <SettingsItem
                  icon="help-circle-outline"
                  title="Help Center"
                  onPress={handleHelpCenter}
                />
                
                <SettingsItem
                  icon="headset-outline"
                  title="Customer Support"
                  onPress={handleCustomerSupport}
                />
              </View>
            </View>

            {/* Legal Section */}
            <View style={styles.sectionContainer}>
              <Text style={themedStyles.sectionTitle}>Legal</Text>
              <View style={themedStyles.settingsSection}>
                <SettingsItem
                  icon="document-text-outline"
                  title="Terms of Service"
                  onPress={handleTermsOfService}
                />
                
                <SettingsItem
                  icon="lock-closed-outline"
                  title="Privacy Policy"
                  onPress={handlePrivacyPolicy}
                />
              </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.sectionContainer}>
              <Text style={themedStyles.dangerSectionTitle}>Danger Zone</Text>
              <View style={themedStyles.dangerSection}>
                <SettingsItem
                  icon="trash-outline"
                  title="Delete Account"
                  onPress={handleDeleteAccount}
                  showChevron={false}
                  isDanger={true}
                />
              </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  spacer: {
    width: 40, // Same width as back button for centering
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
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