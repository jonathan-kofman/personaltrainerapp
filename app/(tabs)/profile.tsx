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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Import theme hook
import { useTheme } from '../../contexts/ThemeContext';

// Import the new components
import WishlistComponent, { WishlistItem } from '../../components/WishlistComponent'
import WalletModal from '../../components/WalletModal';

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

export default function ProfileScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [gemBalance, setGemBalance] = useState(0);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    // Sample wishlist items - replace with actual data from your database
    {
      id: 1,
      name: "Wireless Headphones",
      price: "199.99",
      image: "https://via.placeholder.com/60x60"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "299.99",
      image: "https://via.placeholder.com/60x60"
    },
    {
      id: 3,
      name: "Coffee Maker",
      price: "149.99",
      image: "https://via.placeholder.com/60x60"
    }
  ]);
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  // Use theme hook
  const { theme, isDark } = useTheme();

  // Dynamic gradient colors based on theme
  const gradientColors: readonly [string, string, string] = isDark 
    ? ['#1e293b', '#334155', '#475569'] // Dark theme colors
    : ['#f8fafc', '#e2e8f0', '#cbd5e1']; // Light theme colors

  // Dynamic sparkle color based on theme
  const sparkleColor = isDark 
    ? 'rgba(236, 72, 153, 0.9)' 
    : 'rgba(147, 51, 234, 0.9)';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchWishlist(session.user.id);
        fetchGemBalance(session.user.id);
      }
    });

    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Profile fetch error:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    }
  };

  const fetchWishlist = async (userId: string) => {
    try {
      // Replace this with your actual wishlist fetch logic
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Wishlist fetch error:', error);
      } else {
        setWishlistItems(data || []);
      }
    } catch (error) {
      console.log('Error fetching wishlist:', error);
    }
  };

  const fetchGemBalance = async (userId: string) => {
    try {
      // Replace this with your actual gem balance fetch logic
      const { data, error } = await supabase
        .from('user_wallets')
        .select('gem_balance')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('Gem balance fetch error:', error);
        // Set default balance if no wallet exists
        setGemBalance(0);
      } else {
        setGemBalance(data?.gem_balance || 0);
      }
    } catch (error) {
      console.log('Error fetching gem balance:', error);
      setGemBalance(0);
    }
  };

  const handleAddFunds = async (amount: number) => {
    try {
      const newBalance = gemBalance + amount;
      
      // Update in database
      const { error } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: session?.user.id,
          gem_balance: newBalance,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.log('Error updating gem balance:', error);
        Alert.alert('Error', 'Failed to add gems. Please try again.');
      } else {
        setGemBalance(newBalance);
        setWalletModalVisible(false);
        Alert.alert('Success', `${amount} gems added to your wallet!`);
      }
    } catch (error) {
      console.log('Error adding funds:', error);
      Alert.alert('Error', 'Failed to add gems. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleEditProfile = () => {
    router.push('/profile/edit-profile');
  };

  const handlePreviewProfile = () => {
    router.push(`/profile-preview/${session?.user.id}`);
  };

  const handleSettings = () => {
    router.push('/profile/detailed-settings');
  };

  const handleRemoveFromWishlist = async (itemId: number) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.log('Error removing item:', error);
      } else {
        // Remove from local state
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.log('Error removing wishlist item:', error);
    }
  };

  if (!session) {
    return null;
  }

  // Create themed styles
  const themedStyles = StyleSheet.create({
    headerTitle: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: 1,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    walletButton: {
      position: 'relative',
      padding: 8,
      backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.15)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.4)',
    },
    gemBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: '#fbbf24',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    notificationButton: {
      position: 'relative',
      padding: 8,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    settingsButton: {
      padding: 8,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    notificationBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: 'rgba(236, 72, 153, 0.9)',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 30,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      shadowColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    profileImageContainer: {
      marginBottom: 20,
      shadowColor: isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: isDark ? 'rgba(236, 72, 153, 0.8)' : 'rgba(147, 51, 234, 0.8)',
    },
    displayName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 5,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    username: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 20,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(147, 51, 234, 0.2)',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderWidth: 2,
      borderColor: isDark ? 'rgba(236, 72, 153, 0.5)' : 'rgba(147, 51, 234, 0.4)',
      shadowColor: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(147, 51, 234, 0.3)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      flex: 1,
      maxWidth: 140,
    },
    previewProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderWidth: 2,
      borderColor: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(147, 51, 234, 0.3)',
      shadowColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      flex: 1,
      maxWidth: 140,
    },
    editProfileButtonText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
      textAlign: 'center',
    },
    previewProfileButtonText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
      textAlign: 'center',
    },
    signOutSection: {
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
    signOutButtonText: {
      fontSize: 18,
      color: theme.text,
      fontWeight: '500',
      marginLeft: 15,
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
              <Text style={themedStyles.headerTitle}>Profile</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={themedStyles.walletButton} 
                  onPress={() => setWalletModalVisible(true)}
                >
                  <Ionicons name="wallet-outline" size={24} color="#fbbf24" />
                  <View style={themedStyles.gemBadge}>
                    <Text style={styles.gemBadgeText}>{gemBalance.toFixed(0)}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={themedStyles.notificationButton} onPress={() => router.push('/notifications')}>
                  <Ionicons name="notifications-outline" size={24} color={theme.text} />
                  <View style={themedStyles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>3</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={themedStyles.settingsButton} onPress={handleSettings}>
                  <Ionicons name="settings-outline" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Section */}
            <View style={themedStyles.profileSection}>
              <View style={themedStyles.profileImageContainer}>
                <Image
                  source={
                    profile?.avatar_url 
                      ? { uri: profile.avatar_url }
                      : require('../../assets/default-avatar.jpeg')
                  }
                  style={themedStyles.profileImage}
                />
              </View>
              
              <Text style={themedStyles.displayName}>
                {profile?.display_name || profile?.full_name || profile?.username || 'User'}
              </Text>
              
              <Text style={themedStyles.username}>
                @{profile?.username || session.user.email?.split('@')[0] || 'username'}
              </Text>

              {/* Profile Action Buttons */}
              <View style={styles.profileButtonsContainer}>
                <TouchableOpacity style={themedStyles.editProfileButton} onPress={handleEditProfile}>
                  <Ionicons name="person-outline" size={18} color={theme.text} />
                  <Text style={themedStyles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={themedStyles.previewProfileButton} onPress={handlePreviewProfile}>
                  <Ionicons name="eye-outline" size={18} color={theme.text} />
                  <Text style={themedStyles.previewProfileButtonText}>Preview</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Wishlist Component */}
            <WishlistComponent
              wishlistItems={wishlistItems}
              onRemoveItem={handleRemoveFromWishlist}
              maxDisplayItems={3}
              showAddButton={true}
              showViewAll={true}
            />

            {/* Sign Out Section */}
            <View style={themedStyles.signOutSection}>
              <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={24} color={theme.textSecondary} />
                <Text style={themedStyles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Wallet Modal */}
        <WalletModal
          visible={walletModalVisible}
          onClose={() => setWalletModalVisible(false)}
          gemBalance={gemBalance}
          onAddFunds={handleAddFunds}
        />
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
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gemBadgeText: {
    color: '#1e293b',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 140,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
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