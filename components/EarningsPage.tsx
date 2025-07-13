import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TrainerStats } from '../types';

interface EarningsPageProps {
  stats: TrainerStats;
  onBack: () => void;
}

const EarningsPage: React.FC<EarningsPageProps> = ({ stats, onBack }) => {
  const earningsData = [
    { label: 'Today', amount: stats.todayEarnings, color: '#34C759' },
    { label: 'This Week', amount: stats.weeklyEarnings, color: '#000' },
    { label: 'This Month', amount: stats.monthlyEarnings, color: '#FF9500' },
  ];

  const statsData = [
    { label: 'Total Sessions', value: stats.totalSessions },
    { label: 'Active Clients', value: stats.activeClients },
    { label: 'Rating', value: `${stats.rating}/5.0` },
    { label: 'Total Reviews', value: stats.totalReviews },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Earnings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <View style={styles.earningsGrid}>
            {earningsData.map((item, index) => (
              <View key={index} style={styles.earningsCard}>
                <Text style={styles.earningsLabel}>{item.label}</Text>
                <Text style={[styles.earningsAmount, { color: item.color }]}>
                  ${item.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            {statsData.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              • Earnings are calculated based on completed sessions{'\n'}
              • Payments are processed weekly{'\n'}
              • You can view detailed transaction history{'\n'}
              • Tax documents are available quarterly
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
  earningsGrid: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  earningsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
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

export default EarningsPage; 