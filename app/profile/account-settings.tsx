import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import { CustomInput } from '../../components/CustomUI';

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

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  created_at: string;
}

export default function AccountSettingsScreen() {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDark } = useTheme();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

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
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    loadProfile();
  }, []);

  // Check username availability with debounce
  useEffect(() => {
    if (editingUsername && newUsername.length >= 3 && newUsername !== profile?.username) {
      const timer = setTimeout(() => {
        checkUsernameAvailability();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [newUsername, editingUsername]);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please sign in again.');
        router.replace('/(auth)/signin');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile information.');
      } else {
        setProfile(data);
        setNewUsername(data.username || '');
        setNewDisplayName(data.display_name || '');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
    
    setLoading(false);
  }

  async function checkUsernameAvailability() {
    if (newUsername.length < 3) return;
    
    setCheckingUsername(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername.toLowerCase())
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
    setNewUsername(cleaned);
  }

  async function saveUsername() {
    if (!profile || !newUsername) return;

    if (newUsername.length < 3) {
      Alert.alert('Username Too Short', 'Username must be at least 3 characters long.');
      return;
    }

    if (usernameAvailable === false) {
      Alert.alert('Username Taken', 'This username is already taken. Please choose another.');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername.toLowerCase() })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating username:', error);
        Alert.alert('Error', 'Failed to update username. Please try again.');
      } else {
        setProfile({ ...profile, username: newUsername.toLowerCase() });
        setEditingUsername(false);
        Alert.alert('Success', 'Username updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }

    setSaving(false);
  }

  async function saveDisplayName() {
    if (!profile || !newDisplayName.trim()) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: newDisplayName.trim() })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating display name:', error);
        Alert.alert('Error', 'Failed to update display name. Please try again.');
      } else {
        setProfile({ ...profile, display_name: newDisplayName.trim() });
        setEditingDisplayName(false);
        Alert.alert('Success', 'Display name updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }

    setSaving(false);
  }

  function cancelUsernameEdit() {
    setNewUsername(profile?.username || '');
    setEditingUsername(false);
    setUsernameAvailable(null);
  }

  function cancelDisplayNameEdit() {
    setNewDisplayName(profile?.display_name || '');
    setEditingDisplayName(false);
  }

  function handleGoBack() {
    router.back();
  }

  // Username status icon and color
  const getUsernameStatus = () => {
    if (!editingUsername || newUsername.length < 3) {
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
    infoSection: {
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
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 20,
      textShadowColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    infoRow: {
      marginBottom: 20,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '400',
    },
    editableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    editButton: {
      padding: 8,
      backgroundColor: accentColorLight,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: accentColorMedium,
    },
    saveButton: {
      backgroundColor: '#22c55e',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginLeft: 10,
    },
    cancelButton: {
      backgroundColor: '#ef4444',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginLeft: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    inputContainer: {
      flex: 1,
      marginRight: 10,
    },
    statusIcon: {
      position: 'absolute',
      right: 15,
      top: 45,
      zIndex: 1,
    },
    usernameHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
      fontStyle: 'italic',
    },
    usernameStatus: {
      fontSize: 12,
      marginTop: 4,
      fontWeight: '500',
    },
  });

  if (loading || !profile) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
          {/* Animated sparkles scattered around */}
          <AnimatedSparkle size={8} style={{ position: 'absolute', top: 80, left: 30 }} delay={0} color={sparkleColor} />
          <AnimatedSparkle size={12} style={{ position: 'absolute', top: 140, right: 40 }} delay={200} color={sparkleColor} />
          <AnimatedSparkle size={10} style={{ position: 'absolute', top: 200, left: 50 }} delay={400} color={sparkleColor} />
          <AnimatedSparkle size={14} style={{ position: 'absolute', top: 280, right: 60 }} delay={600} color={sparkleColor} />
          <AnimatedSparkle size={9} style={{ position: 'absolute', top: 360, left: 40 }} delay={800} color={sparkleColor} />
          <AnimatedSparkle size={11} style={{ position: 'absolute', top: 440, right: 50 }} delay={1000} color={sparkleColor} />
          <AnimatedSparkle size={13} style={{ position: 'absolute', top: 520, left: 60 }} delay={1200} color={sparkleColor} />
          <AnimatedSparkle size={8} style={{ position: 'absolute', top: 600, right: 30 }} delay={1400} color={sparkleColor} />

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
                <Text style={themedStyles.headerTitle}>Account</Text>
                <View style={styles.spacer} />
              </View>

              {/* Account Information Section */}
              <View style={themedStyles.infoSection}>
                <Text style={themedStyles.sectionTitle}>Account Information</Text>
                
                {/* Email */}
                <View style={themedStyles.infoRow}>
                  <Text style={themedStyles.infoLabel}>Email Address</Text>
                  <Text style={themedStyles.infoValue}>{profile.email}</Text>
                </View>

                {/* Username */}
                <View style={themedStyles.infoRow}>
                  <Text style={themedStyles.infoLabel}>Username</Text>
                  {editingUsername ? (
                    <View>
                      <View style={styles.editRow}>
                        <View style={themedStyles.inputContainer}>
                          <View style={styles.inputWithIcon}>
                            <CustomInput
                              value={newUsername}
                              onChangeText={validateUsername}
                              placeholder="your_username"
                              autoCapitalize="none"
                            />
                            {usernameStatus.icon && (
                              <View style={themedStyles.statusIcon}>
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
                          {newUsername.length >= 3 && newUsername !== profile.username && (
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
                        <View style={styles.actionButtons}>
                          <TouchableOpacity 
                            style={themedStyles.saveButton} 
                            onPress={saveUsername}
                            disabled={saving || !newUsername || newUsername.length < 3 || usernameAvailable === false}
                          >
                            <Text style={themedStyles.buttonText}>
                              {saving ? 'Saving...' : 'Save'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={themedStyles.cancelButton} 
                            onPress={cancelUsernameEdit}
                            disabled={saving}
                          >
                            <Text style={themedStyles.buttonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={themedStyles.editableRow}>
                      <Text style={themedStyles.infoValue}>
                        {profile.username || 'Not set'}
                      </Text>
                      <TouchableOpacity 
                        style={themedStyles.editButton} 
                        onPress={() => setEditingUsername(true)}
                      >
                        <Ionicons name="pencil" size={16} color={accentColor} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Display Name */}
                <View style={themedStyles.infoRow}>
                  <Text style={themedStyles.infoLabel}>Display Name</Text>
                  {editingDisplayName ? (
                    <View style={styles.editRow}>
                      <View style={themedStyles.inputContainer}>
                        <CustomInput
                          value={newDisplayName}
                          onChangeText={(text: string) => setNewDisplayName(text.slice(0, 30))}
                          placeholder="Your Display Name"
                        />
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={themedStyles.saveButton} 
                          onPress={saveDisplayName}
                          disabled={saving || !newDisplayName.trim()}
                        >
                          <Text style={themedStyles.buttonText}>
                            {saving ? 'Saving...' : 'Save'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={themedStyles.cancelButton} 
                          onPress={cancelDisplayNameEdit}
                          disabled={saving}
                        >
                          <Text style={themedStyles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={themedStyles.editableRow}>
                      <Text style={themedStyles.infoValue}>
                        {profile.display_name || 'Not set'}
                      </Text>
                      <TouchableOpacity 
                        style={themedStyles.editButton} 
                        onPress={() => setEditingDisplayName(true)}
                      >
                        <Ionicons name="pencil" size={16} color={accentColor} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Member Since */}
                <View style={themedStyles.infoRow}>
                  <Text style={themedStyles.infoLabel}>Member Since</Text>
                  <Text style={themedStyles.infoValue}>
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  editRow: {
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  inputWithIcon: {
    position: 'relative',
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