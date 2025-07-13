import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from 'react-native';
import { DashboardProps, BookingRequest } from '../types';

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  recentBookings, 
  onViewAllBookings 
}) => {
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'accepted': return '#34C759';
      case 'declined': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderStatsCard = (title: string, value: string, subtitle?: string, isLarge?: boolean) => (
    <View style={[styles.statsCard, isLarge && styles.largeStatsCard]}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={[styles.statsValue, isLarge && styles.largeStatsValue]}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderBookingItem = (booking: BookingRequest) => (
    <View key={booking.id} style={styles.bookingItem}>
      <View style={styles.bookingLeft}>
        <View style={styles.clientAvatar}>
          <Text style={styles.clientInitial}>
            {booking.clientName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.clientName}>{booking.clientName}</Text>
          <Text style={styles.sessionType}>{booking.sessionType}</Text>
          <Text style={styles.bookingTime}>
            {booking.preferredDate} • {booking.preferredTime}
          </Text>
        </View>
      </View>
      <View style={styles.bookingRight}>
        <Text style={styles.bookingRate}>{formatCurrency(booking.rate)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.section}>
        <Text style={styles.welcomeText}>Good morning! 👋</Text>
        <Text style={styles.welcomeSubtext}>Ready to help your clients reach their goals?</Text>
      </View>

      {/* Today's Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatsCard('Today\'s Earnings', formatCurrency(stats.todayEarnings))}
          {renderStatsCard('Active Clients', stats.activeClients.toString())}
        </View>
        <View style={styles.statsGrid}>
          {renderStatsCard('Rating', `${stats.rating.toFixed(1)} ⭐`, `${stats.totalReviews} reviews`)}
          {renderStatsCard('This Week', formatCurrency(stats.weeklyEarnings))}
        </View>
      </View>

      {/* Monthly Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.performanceCard}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{formatCurrency(stats.monthlyEarnings)}</Text>
            <Text style={styles.performanceLabel}>Total Earnings</Text>
          </View>
          <View style={styles.performanceDivider} />
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{stats.totalSessions}</Text>
            <Text style={styles.performanceLabel}>Sessions Completed</Text>
          </View>
        </View>
      </View>

      {/* Recent Booking Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          {recentBookings.length > 0 && (
            <TouchableOpacity onPress={onViewAllBookings}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {recentBookings.length > 0 ? (
          <View style={styles.bookingsList}>
            {recentBookings.map(renderBookingItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>No recent booking requests</Text>
            <Text style={styles.emptyStateSubtext}>
              New requests will appear here when clients book with you
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>📅</Text>
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>👥</Text>
            <Text style={styles.actionButtonText}>Clients</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>💰</Text>
            <Text style={styles.actionButtonText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>⚙️</Text>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  lastSection: {
    borderBottomWidth: 0,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    alignItems: 'center',
  },
  largeStatsCard: {
    paddingVertical: 24,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  largeStatsValue: {
    fontSize: 28,
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '500',
  },
  bookingsList: {
    gap: 12,
  },
  bookingItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientInitial: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  sessionType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 14,
    color: '#666',
  },
  bookingRight: {
    alignItems: 'flex-end',
  },
  bookingRate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});

export default Dashboard;