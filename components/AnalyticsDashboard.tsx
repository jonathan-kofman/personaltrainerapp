import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalyticsService } from '../lib/analyticsService';
import { AnalyticsData, DashboardAnalytics } from '../types/analytics';

interface AnalyticsDashboardProps {
  onBack?: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'business' | 'operations'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, dashboardAnalytics] = await Promise.all([
        AnalyticsService.getAnalyticsData(),
        AnalyticsService.getDashboardAnalytics()
      ]);
      setAnalytics(analyticsData);
      setDashboardData(dashboardAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const renderStatsCard = (title: string, value: string, subtitle?: string, isLarge?: boolean, trend?: { value: number; direction: 'up' | 'down' | 'stable' }) => (
    <View style={[styles.statsCard, isLarge && styles.largeStatsCard]}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={[styles.statsValue, isLarge && styles.largeStatsValue]}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend.direction === 'up' ? 'trending-up' : trend.direction === 'down' ? 'trending-down' : 'remove'} 
            size={16} 
            color={trend.direction === 'up' ? '#34C759' : trend.direction === 'down' ? '#FF3B30' : '#8E8E93'} 
          />
          <Text style={[styles.trendText, { color: trend.direction === 'up' ? '#34C759' : trend.direction === 'down' ? '#FF3B30' : '#8E8E93' }]}>
            {trend.value}%
          </Text>
        </View>
      )}
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsGrid}>
        {dashboardData && (
          <>
            {renderStatsCard(
              'Total Users',
              AnalyticsService.formatNumber(dashboardData.quickStats.totalUsers),
              'Active this month'
            )}
            {renderStatsCard(
              'Monthly Revenue',
              AnalyticsService.formatCurrency(dashboardData.quickStats.monthlyRevenue),
              'Recurring revenue'
            )}
          </>
        )}
      </View>
      <View style={styles.statsGrid}>
        {dashboardData && (
          <>
            {renderStatsCard(
              'Active Sessions',
              AnalyticsService.formatNumber(dashboardData.quickStats.activeSessions),
              'This month'
            )}
            {renderStatsCard(
              'Average Rating',
              dashboardData.quickStats.averageRating.toFixed(1),
              'Platform rating'
            )}
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityContainer}>
        {dashboardData && (
          <>
            <View style={styles.activityItem}>
              <Ionicons name="calendar" size={20} color="#007AFF" />
              <Text style={styles.activityText}>{dashboardData.recentActivity.newBookings} new bookings</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.activityText}>{dashboardData.recentActivity.completedSessions} sessions completed</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="person-add" size={20} color="#FF9500" />
              <Text style={styles.activityText}>{dashboardData.recentActivity.newUsers} new users</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="help-circle" size={20} color="#AF52DE" />
              <Text style={styles.activityText}>{dashboardData.recentActivity.supportTickets} support tickets</Text>
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Alerts</Text>
      <View style={styles.alertsContainer}>
        {dashboardData && (
          <>
            {dashboardData.alerts.critical > 0 && (
              <View style={styles.alertItem}>
                <Ionicons name="warning" size={20} color="#FF3B30" />
                <Text style={styles.alertText}>{dashboardData.alerts.critical} critical alerts</Text>
              </View>
            )}
            {dashboardData.alerts.warnings > 0 && (
              <View style={styles.alertItem}>
                <Ionicons name="alert-circle" size={20} color="#FF9500" />
                <Text style={styles.alertText}>{dashboardData.alerts.warnings} warnings</Text>
              </View>
            )}
            {dashboardData.alerts.info > 0 && (
              <View style={styles.alertItem}>
                <Ionicons name="information-circle" size={20} color="#007AFF" />
                <Text style={styles.alertText}>{dashboardData.alerts.info} info messages</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );

  const renderUsersTab = () => (
    <View style={styles.tabContent}>
      {analytics && (
        <>
          <Text style={styles.sectionTitle}>User Metrics</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Monthly Active Users',
              AnalyticsService.formatNumber(analytics.userMetrics.monthlyActiveUsers.total),
              `${analytics.userMetrics.monthlyActiveUsers.clients} clients, ${analytics.userMetrics.monthlyActiveUsers.trainers} trainers`,
              false,
              { value: analytics.userMetrics.monthlyActiveUsers.growthRate, direction: 'up' }
            )}
            {renderStatsCard(
              'Retention Rate',
              AnalyticsService.formatPercentage(analytics.userMetrics.retentionRates.clientRetention),
              'Client retention'
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Net Promoter Score',
              analytics.userMetrics.netPromoterScore.overall.toString(),
              'Overall satisfaction'
            )}
            {renderStatsCard(
              'Acquisition Cost',
              AnalyticsService.formatCurrency(analytics.userMetrics.userAcquisition.acquisitionCost),
              'Per user'
            )}
          </View>

          <Text style={styles.sectionTitle}>User Breakdown</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>{AnalyticsService.formatNumber(analytics.userMetrics.monthlyActiveUsers.clients)}</Text>
              <Text style={styles.performanceLabel}>Clients</Text>
            </View>
            <View style={styles.performanceDivider} />
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>{AnalyticsService.formatNumber(analytics.userMetrics.monthlyActiveUsers.trainers)}</Text>
              <Text style={styles.performanceLabel}>Trainers</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderBusinessTab = () => (
    <View style={styles.tabContent}>
      {analytics && (
        <>
          <Text style={styles.sectionTitle}>Revenue Metrics</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Monthly Revenue',
              AnalyticsService.formatCurrency(analytics.businessMetrics.revenue.monthlyRecurringRevenue),
              'MRR',
              false,
              { value: analytics.businessMetrics.revenue.growthRate, direction: 'up' }
            )}
            {renderStatsCard(
              'Average Session',
              AnalyticsService.formatCurrency(analytics.businessMetrics.revenue.averageSessionValue),
              'Per session'
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Gross Margin',
              AnalyticsService.formatPercentage(analytics.businessMetrics.profitability.grossMargin),
              'Profit margin'
            )}
            {renderStatsCard(
              'Commission per User',
              AnalyticsService.formatCurrency(analytics.businessMetrics.profitability.commissionPerUser),
              'Average'
            )}
          </View>

          <Text style={styles.sectionTitle}>Session Metrics</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Total Sessions',
              AnalyticsService.formatNumber(analytics.businessMetrics.sessions.totalSessions),
              'This month'
            )}
            {renderStatsCard(
              'Completion Rate',
              AnalyticsService.formatPercentage(analytics.businessMetrics.sessions.completionRate),
              `${analytics.businessMetrics.sessions.completedSessions} completed`
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Average Duration',
              `${analytics.businessMetrics.sessions.averageSessionDuration} min`,
              'Per session'
            )}
            {renderStatsCard(
              'Cancellation Rate',
              AnalyticsService.formatPercentage((analytics.businessMetrics.sessions.cancelledSessions / analytics.businessMetrics.sessions.totalSessions) * 100),
              `${analytics.businessMetrics.sessions.cancelledSessions} cancelled`
            )}
          </View>

          <Text style={styles.sectionTitle}>Path to Profitability</Text>
          <View style={styles.profitabilityContainer}>
            <View style={styles.profitabilityItem}>
              <Text style={styles.profitabilityLabel}>Current Burn Rate</Text>
              <Text style={styles.profitabilityValue}>
                {AnalyticsService.formatCurrency(analytics.businessMetrics.profitability.pathToProfitability.currentBurnRate)}
              </Text>
            </View>
            <View style={styles.profitabilityItem}>
              <Text style={styles.profitabilityLabel}>Projected Break Even</Text>
              <Text style={styles.profitabilityValue}>
                {new Date(analytics.businessMetrics.profitability.pathToProfitability.projectedBreakEven).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.profitabilityItem}>
              <Text style={styles.profitabilityLabel}>Runway</Text>
              <Text style={styles.profitabilityValue}>
                {analytics.businessMetrics.profitability.pathToProfitability.runwayMonths} months
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderOperationsTab = () => (
    <View style={styles.tabContent}>
      {analytics && (
        <>
          <Text style={styles.sectionTitle}>Session Quality</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Completion Rate',
              AnalyticsService.formatPercentage(analytics.operationalMetrics.sessionQuality.completionRate),
              'Sessions completed'
            )}
            {renderStatsCard(
              'Average Rating',
              analytics.operationalMetrics.sessionQuality.averageRating.toFixed(1),
              `${analytics.operationalMetrics.sessionQuality.totalReviews} reviews`
            )}
          </View>

          <Text style={styles.sectionTitle}>Support Metrics</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Response Time',
              `${analytics.operationalMetrics.supportMetrics.averageResponseTime} min`,
              'Average response'
            )}
            {renderStatsCard(
              'Resolution Time',
              `${analytics.operationalMetrics.supportMetrics.resolutionTime} hours`,
              'Average resolution'
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Satisfaction Score',
              analytics.operationalMetrics.supportMetrics.satisfactionScore.toFixed(1),
              'Support satisfaction'
            )}
            {renderStatsCard(
              'Open Tickets',
              analytics.operationalMetrics.supportMetrics.openTickets.toString(),
              `${analytics.operationalMetrics.supportMetrics.totalTickets} total`
            )}
          </View>

          <Text style={styles.sectionTitle}>Platform Health</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Uptime',
              AnalyticsService.formatPercentage(analytics.operationalMetrics.platformHealth.uptime),
              'Platform availability'
            )}
            {renderStatsCard(
              'Load Time',
              `${analytics.operationalMetrics.platformHealth.averageLoadTime}s`,
              'Average load time'
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Error Rate',
              AnalyticsService.formatPercentage(analytics.operationalMetrics.platformHealth.errorRate),
              'Platform errors'
            )}
          </View>

          <Text style={styles.sectionTitle}>Trainer Metrics</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Satisfaction Score',
              analytics.operationalMetrics.trainerMetrics.satisfactionScore.toFixed(1),
              'Trainer satisfaction'
            )}
            {renderStatsCard(
              'Average Earnings',
              AnalyticsService.formatCurrency(analytics.operationalMetrics.trainerMetrics.averageEarnings),
              'Per trainer'
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Active Trainers',
              analytics.operationalMetrics.trainerMetrics.activeTrainers.toString(),
              `${analytics.operationalMetrics.trainerMetrics.totalTrainers} total`
            )}
          </View>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'users' && styles.activeTab]}
          onPress={() => setSelectedTab('users')}
        >
          <Text style={[styles.tabText, selectedTab === 'users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'business' && styles.activeTab]}
          onPress={() => setSelectedTab('business')}
        >
          <Text style={[styles.tabText, selectedTab === 'business' && styles.activeTabText]}>Business</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'operations' && styles.activeTab]}
          onPress={() => setSelectedTab('operations')}
        >
          <Text style={[styles.tabText, selectedTab === 'operations' && styles.activeTabText]}>Operations</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'users' && renderUsersTab()}
        {selectedTab === 'business' && renderBusinessTab()}
        {selectedTab === 'operations' && renderOperationsTab()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  refreshButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
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
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  activityContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  alertsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  performanceCard: {
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  profitabilityContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  profitabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profitabilityLabel: {
    fontSize: 16,
    color: '#666',
  },
  profitabilityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default AnalyticsDashboard; 