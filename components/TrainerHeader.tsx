import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TrainerHeaderProps {
  trainerName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const TrainerHeader: React.FC<TrainerHeaderProps> = ({
  trainerName,
  currentPage,
  onNavigate,
  onLogout,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleProfilePress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionPress = (option: string) => {
    setDropdownVisible(false);
    if (option === 'Logout') {
      onLogout();
    } else {
      // Map options to page keys
      const pageMap: { [key: string]: string } = {
        'Dashboard': 'dashboard',
        'Bookings': 'bookings',
        'Clients': 'clients',
        'Schedule': 'schedule',
        'Earnings': 'earnings',
        'Profile': 'profile',
        'Settings': 'settings',
        'Trainers': 'trainers',
        'Analytics': 'analytics',
      };
      const pageKey = pageMap[option];
      if (pageKey) {
        onNavigate(pageKey);
      }
    }
  };

  // Get initials from trainer name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const currentPageTitle = () => {
    const titleMap: { [key: string]: string } = {
      'dashboard': 'TrainerX Pro',
      'bookings': 'Booking Requests',
      'clients': 'My Clients',
      'schedule': 'Schedule',
      'earnings': 'Earnings',
      'profile': 'Profile',
      'settings': 'Settings',
      'trainers': 'Personal Trainers',
      'analytics': 'Analytics',
    };
    return titleMap[currentPage] || 'TrainerX Pro';
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>{currentPageTitle()}</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Text style={styles.profileInitial}>{getInitials(trainerName)}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Dropdown */}
      {dropdownVisible && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity 
            style={styles.dropdownBackdrop} 
            onPress={() => setDropdownVisible(false)}
          />
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Dashboard')}
            >
              <Text style={styles.dropdownItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Bookings')}
            >
              <Text style={styles.dropdownItemText}>Booking Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Clients')}
            >
              <Text style={styles.dropdownItemText}>My Clients</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Schedule')}
            >
              <Text style={styles.dropdownItemText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Earnings')}
            >
              <Text style={styles.dropdownItemText}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Profile')}
            >
              <Text style={styles.dropdownItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Settings')}
            >
              <Text style={styles.dropdownItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Trainers')}
            >
              <Text style={styles.dropdownItemText}>Personal Trainers</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Analytics')}
            >
              <Text style={styles.dropdownItemText}>Analytics</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Logout')}
            >
              <Text style={[styles.dropdownItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 180,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  logoutText: {
    color: '#FF3B30',
  },
});

export default TrainerHeader;