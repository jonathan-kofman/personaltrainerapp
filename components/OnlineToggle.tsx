import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Animated,
  Alert 
} from 'react-native';
import { OnlineToggleProps } from '../types';

const OnlineToggle: React.FC<OnlineToggleProps> = ({ 
  isOnline, 
  onToggle, 
  locationLoading 
}) => {
  const [toggling, setToggling] = useState(false);
  const [slideAnimation] = useState(new Animated.Value(isOnline ? 1 : 0));

  const handleToggle = async () => {
    if (toggling) return;

    try {
      setToggling(true);
      
      // Animate the toggle
      Animated.timing(slideAnimation, {
        toValue: isOnline ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();

      await onToggle(!isOnline);
    } catch (error) {
      console.error('Error toggling online status:', error);
      
      // Revert animation on error
      Animated.timing(slideAnimation, {
        toValue: isOnline ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      Alert.alert('Error', 'Failed to update online status. Please try again.');
    } finally {
      setToggling(false);
    }
  };

  const toggleBackgroundColor = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F5F5F5', '#000'],
  });

  const toggleTranslateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 36],
  });

  const getStatusText = () => {
    if (toggling) return 'Updating...';
    if (locationLoading) return 'Getting location...';
    return isOnline ? 'You\'re Online' : 'You\'re Offline';
  };

  const getDescriptionText = () => {
    if (isOnline) {
      return 'Clients can see you and send booking requests';
    } else {
      return 'You won\'t receive new booking requests';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          <Text style={styles.descriptionText}>{getDescriptionText()}</Text>
        </View>
        
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, isOnline && styles.toggleButtonActive]}
            onPress={handleToggle}
            disabled={toggling || locationLoading}
            activeOpacity={0.8}
          >
            <Animated.View 
              style={[
                styles.toggleBackground, 
                { backgroundColor: toggleBackgroundColor }
              ]}
            >
              <Animated.View 
                style={[
                  styles.toggleCircle,
                  { transform: [{ translateX: toggleTranslateX }] }
                ]}
              >
                {(toggling || locationLoading) && (
                  <ActivityIndicator size="small" color="#666" />
                )}
              </Animated.View>
            </Animated.View>
            <Text style={[styles.toggleText, isOnline && styles.toggleTextActive]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {isOnline && (
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>
            You're visible to clients within your service area
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  toggleContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 100,
  },
  toggleButtonActive: {
    backgroundColor: '#000',
  },
  toggleBackground: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
    marginRight: 8,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  onlineText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
});

export default OnlineToggle;