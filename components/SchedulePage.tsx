import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface SchedulePageProps {
  onBack: () => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ onBack }) => {
  const scheduleData = [
    { day: 'Monday', time: '6:00 AM - 8:00 PM', available: true },
    { day: 'Tuesday', time: '6:00 AM - 8:00 PM', available: true },
    { day: 'Wednesday', time: '6:00 AM - 8:00 PM', available: true },
    { day: 'Thursday', time: '6:00 AM - 8:00 PM', available: true },
    { day: 'Friday', time: '6:00 AM - 8:00 PM', available: true },
    { day: 'Saturday', time: '8:00 AM - 6:00 PM', available: true },
    { day: 'Sunday', time: 'Closed', available: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Schedule</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Schedule Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <View style={styles.scheduleContainer}>
            {scheduleData.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.dayContainer}>
                  <Text style={styles.dayText}>{item.day}</Text>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: item.available ? '#34C759' : '#FF3B30' }
                  ]} />
                </View>
                <Text style={[
                  styles.timeText,
                  { color: item.available ? '#000' : '#666' }
                ]}>
                  {item.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              • You can modify your availability in the Profile section{'\n'}
              • Clients can only book sessions during your available hours{'\n'}
              • You'll receive notifications for new booking requests{'\n'}
              • You can accept or decline requests within 24 hours
            </Text>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  scheduleContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SchedulePage; 