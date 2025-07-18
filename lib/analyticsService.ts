import { 
  AnalyticsData, 
  UserMetrics, 
  BusinessMetrics, 
  OperationalMetrics, 
  DashboardAnalytics,
  AnalyticsFilters 
} from '../types/analytics';

export class AnalyticsService {
  // Calculate retention rate
  static calculateRetentionRate(totalUsers: number, retainedUsers: number): number {
    if (totalUsers === 0) return 0;
    return Math.round((retainedUsers / totalUsers) * 100);
  }

  // Calculate growth rate
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  // Calculate Net Promoter Score
  static calculateNetPromoterScore(promoters: number, detractors: number, total: number): number {
    if (total === 0) return 0;
    return Math.round(((promoters - detractors) / total) * 100);
  }

  // Calculate completion rate
  static calculateCompletionRate(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  // Get analytics data (replace with real API calls)
  static async getAnalyticsData(filters?: AnalyticsFilters): Promise<AnalyticsData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userMetrics: UserMetrics = {
      monthlyActiveUsers: {
        clients: 1247,
        trainers: 89,
        total: 1336,
        growthRate: 12.5
      },
      retentionRates: {
        clientRetention: 78.5,
        trainerRetention: 85.2
      },
      userAcquisition: {
        newClientsThisMonth: 156,
        newTrainersThisMonth: 12,
        acquisitionCost: 23.45
      },
      netPromoterScore: {
        overall: 72,
        clients: 68,
        trainers: 81
      }
    };

    const businessMetrics: BusinessMetrics = {
      revenue: {
        monthlyRecurringRevenue: 45678.90,
        averageSessionValue: 85.50,
        totalRevenue: 234567.89,
        growthRate: 18.3
      },
      profitability: {
        grossMargin: 65.2,
        commissionPerUser: 12.75,
        pathToProfitability: {
          currentBurnRate: 15000,
          projectedBreakEven: '2024-06-15',
          runwayMonths: 8
        }
      },
      sessions: {
        totalSessions: 2847,
        completedSessions: 2712,
        cancelledSessions: 135,
        averageSessionDuration: 65,
        completionRate: 95.3
      }
    };

    const operationalMetrics: OperationalMetrics = {
      sessionQuality: {
        completionRate: 95.3,
        averageRating: 4.6,
        totalReviews: 2156
      },
      supportMetrics: {
        averageResponseTime: 45,
        resolutionTime: 2.5,
        satisfactionScore: 4.2,
        totalTickets: 234,
        openTickets: 12
      },
      platformHealth: {
        uptime: 99.8,
        averageLoadTime: 1.2,
        errorRate: 0.15
      },
      trainerMetrics: {
        satisfactionScore: 4.4,
        averageEarnings: 2345.67,
        activeTrainers: 76,
        totalTrainers: 89
      }
    };

    return {
      userMetrics,
      businessMetrics,
      operationalMetrics,
      lastUpdated: new Date().toISOString()
    };
  }

  // Get dashboard analytics
  static async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const analytics = await this.getAnalyticsData();

    return {
      quickStats: {
        totalUsers: analytics.userMetrics.monthlyActiveUsers.total,
        activeSessions: analytics.businessMetrics.sessions.totalSessions,
        monthlyRevenue: analytics.businessMetrics.revenue.monthlyRecurringRevenue,
        averageRating: analytics.operationalMetrics.sessionQuality.averageRating
      },
      recentActivity: {
        newBookings: 45,
        completedSessions: 23,
        newUsers: 12,
        supportTickets: 8
      },
      alerts: {
        critical: 2,
        warnings: 5,
        info: 12
      }
    };
  }

  // Format currency
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format percentage
  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Format number with commas
  static formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  // Get metric status (good, warning, critical)
  static getMetricStatus(value: number, thresholds: { good: number; warning: number }): 'good' | 'warning' | 'critical' {
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.warning) return 'warning';
    return 'critical';
  }
} 