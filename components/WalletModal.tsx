import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface WalletModalProps {
  visible: boolean;
  onClose: () => void;
  gemBalance: number;
  onAddFunds: (amount: number) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ 
  visible, 
  onClose, 
  gemBalance, 
  onAddFunds 
}) => {
  const [addAmount, setAddAmount] = useState('');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const { theme, isDark } = useTheme();

  // Dynamic gradient colors based on theme
  const gradientColors: readonly [string, string, string] = isDark 
    ? ['#1e293b', '#334155', '#475569'] // Dark theme colors
    : ['#f8fafc', '#e2e8f0', '#cbd5e1']; // Light theme colors

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (amount && amount > 0) {
      onAddFunds(amount);
      setAddAmount('');
    } else {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to add.');
    }
  };

  const handleManageBalance = () => {
    onClose();
    router.push('/wallet-management');
  };

  const quickAmounts = [10, 25, 50, 100];

  // Create themed styles
  const themedStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      flex: 1,
    },
    walletModal: {
      maxHeight: height * 0.8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
    },
    walletModalGradient: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: 12,
      marginBottom: 20,
    },
    walletHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    walletTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    gemIconContainer: {
      backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.15)',
      borderRadius: 12,
      padding: 8,
      marginRight: 12,
    },
    walletTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      padding: 8,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 12,
    },
    balanceContainer: {
      alignItems: 'center',
      marginBottom: 30,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.3)',
    },
    balanceLabel: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    balanceDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fbbf24',
    },
    balanceUnit: {
      fontSize: 18,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    quickAmountsContainer: {
      marginBottom: 24,
    },
    quickAmountsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    quickAmountsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    quickAmountButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.08)',
      borderRadius: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.4)',
      gap: 6,
    },
    quickAmountText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fbbf24',
    },
    customAmountContainer: {
      marginBottom: 30,
    },
    customAmountTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.4)',
    },
    inputIcon: {
      marginRight: 12,
    },
    amountInput: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
      paddingVertical: 12,
    },
    actionButtonsContainer: {
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    addFundsButton: {
      backgroundColor: 'rgba(251, 191, 36, 0.8)',
    },
    manageButton: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    addFundsButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? 'white' : '#1e293b', // Always high contrast for the primary button
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={themedStyles.modalOverlay}>
        <TouchableOpacity 
          style={themedStyles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            themedStyles.walletModal,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={themedStyles.walletModalGradient}
          >
            {/* Handle */}
            <View style={themedStyles.modalHandle} />
            
            {/* Header */}
            <View style={themedStyles.walletHeader}>
              <View style={themedStyles.walletTitleContainer}>
                <View style={themedStyles.gemIconContainer}>
                  <Ionicons name="diamond" size={24} color="#fbbf24" />
                </View>
                <Text style={themedStyles.walletTitle}>Gem Wallet</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={themedStyles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Balance Display */}
            <View style={themedStyles.balanceContainer}>
              <Text style={themedStyles.balanceLabel}>Current Balance</Text>
              <View style={themedStyles.balanceDisplay}>
                <Ionicons name="diamond" size={32} color="#fbbf24" />
                <Text style={themedStyles.balanceAmount}>{gemBalance.toFixed(0)}</Text>
                <Text style={themedStyles.balanceUnit}>Gems</Text>
              </View>
            </View>

            {/* Quick Add Amounts */}
            <View style={themedStyles.quickAmountsContainer}>
              <Text style={themedStyles.quickAmountsTitle}>Quick Add</Text>
              <View style={themedStyles.quickAmountsGrid}>
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={themedStyles.quickAmountButton}
                    onPress={() => setAddAmount(amount.toString())}
                  >
                    <Ionicons name="diamond" size={16} color="#fbbf24" />
                    <Text style={themedStyles.quickAmountText}>{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Amount Input */}
            <View style={themedStyles.customAmountContainer}>
              <Text style={themedStyles.customAmountTitle}>Custom Amount</Text>
              <View style={themedStyles.inputContainer}>
                <Ionicons name="diamond" size={20} color="#fbbf24" style={themedStyles.inputIcon} />
                <TextInput
                  style={themedStyles.amountInput}
                  value={addAmount}
                  onChangeText={setAddAmount}
                  placeholder="Enter amount"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={themedStyles.actionButtonsContainer}>
              <TouchableOpacity
                style={[themedStyles.actionButton, themedStyles.addFundsButton]}
                onPress={handleAddFunds}
              >
                <Ionicons name="add-circle" size={20} color={isDark ? 'white' : '#1e293b'} />
                <Text style={themedStyles.addFundsButtonText}>Add Gems</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[themedStyles.actionButton, themedStyles.manageButton]}
                onPress={handleManageBalance}
              >
                <Ionicons name="settings" size={20} color={theme.text} />
                <Text style={themedStyles.actionButtonText}>Manage Balance</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WalletModal;
export type { WalletModalProps };