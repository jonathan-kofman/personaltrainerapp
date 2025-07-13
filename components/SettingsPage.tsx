import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onLogout }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [locationSharing, setLocationSharing] = React.useState(true);
  const [autoAccept, setAutoAccept] = React.useState(false);

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          label: 'Push Notifications',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          label: 'Email Notifications',
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
      ],
    },
    {
      title: 'Privacy & Location',
      items: [
        {
          label: 'Share Location',
          type: 'switch',
          value: locationSharing,
          onValueChange: setLocationSharing,
        },
        {
          label: 'Show Online Status',
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
      ],
    },
    {
      title: 'Booking Preferences',
      items: [
        {
          label: 'Auto-Accept Requests',
          type: 'switch',
          value: autoAccept,
          onValueChange: setAutoAccept,
        },
        {
          label: 'Minimum Notice (hours)',
          type: 'text',
          value: '2',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          label: 'Edit Profile',
          type: 'button',
          onPress: () => Alert.alert('Info', 'Navigate to Profile page'),
        },
        {
          label: 'Change Password',
          type: 'button',
          onPress: () => Alert.alert('Info', 'Password change feature'),
        },
        {
          label: 'Privacy Policy',
          type: 'button',
          onPress: () => Alert.alert('Info', 'Privacy policy link'),
        },
        {
          label: 'Terms of Service',
          type: 'button',
          onPress: () => Alert.alert('Info', 'Terms of service link'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    switch (item.type) {
      case 'switch':
        return (
          <View key={index} style={styles.settingItem}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#E0E0E0', true: '#000' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        );
      case 'text':
        return (
          <View key={index} style={styles.settingItem}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        );
      case 'button':
        return (
          <TouchableOpacity key={index} style={styles.settingItem} onPress={item.onPress}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, index) => renderSettingItem(item, index))}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  backText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  settingArrow: {
    fontSize: 18,
    color: '#666',
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsPage; 