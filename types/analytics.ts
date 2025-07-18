// Core Analytics Types for Gym Personal Trainer App
export interface AnalyticsData {
  userMetrics: UserMetrics;
  businessMetrics: BusinessMetrics;
  operationalMetrics: OperationalMetrics;
  lastUpdated: string;
}

// User Metrics - Most relevant for trainer platform
export interface UserMetrics {
  monthlyActiveUsers: {
    clients: number;
    trainers: number;
    total: number;
    growthRate: number; // percentage
  };
  retentionRates: {
    clientRetention: number; // percentage
    trainerRetention: number; // percentage
  };
  userAcquisition: {
    newClientsThisMonth: number;
    newTrainersThisMonth: number;
    acquisitionCost: number; // per user
  };
  netPromoterScore: {
    overall: number; // -100 to 100
    clients: number;
    trainers: number;
  };
}

// Business Metrics - Focus on trainer earnings and platform revenue
export interface BusinessMetrics {
  revenue: {
    monthlyRecurringRevenue: number;
    averageSessionValue: number;
    totalRevenue: number;
    growthRate: number; // percentage
  };
  profitability: {
    grossMargin: number; // percentage
    commissionPerUser: number;
    pathToProfitability: {
      currentBurnRate: number;
      projectedBreakEven: string; // date
      runwayMonths: number;
    };
  };
  sessions: {
    totalSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    averageSessionDuration: number; // minutes
    completionRate: number; // percentage
  };
}

// Operational Metrics - Focus on service quality and platform health
export interface OperationalMetrics {
  sessionQuality: {
    completionRate: number; // percentage
    averageRating: number; // 1-5
    totalReviews: number;
  };
  supportMetrics: {
    averageResponseTime: number; // minutes
    resolutionTime: number; // hours
    satisfactionScore: number; // 1-5
    totalTickets: number;
    openTickets: number;
  };
  platformHealth: {
    uptime: number; // percentage
    averageLoadTime: number; // seconds
    errorRate: number; // percentage
  };
  trainerMetrics: {
    satisfactionScore: number; // 1-5
    averageEarnings: number;
    activeTrainers: number;
    totalTrainers: number;
  };
}

// Dashboard-specific analytics
export interface DashboardAnalytics {
  quickStats: {
    totalUsers: number;
    activeSessions: number;
    monthlyRevenue: number;
    averageRating: number;
  };
  recentActivity: {
    newBookings: number;
    completedSessions: number;
    newUsers: number;
    supportTickets: number;
  };
  alerts: {
    critical: number;
    warnings: number;
    info: number;
  };
}

// Analytics filters
export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  userType?: 'all' | 'clients' | 'trainers';
  location?: string;
} 