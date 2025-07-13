// Core trainer profile interface
export interface TrainerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialties: string[];
    certifications: string[];
    experience: string;
    hourlyRate: number;
    bio: string;
    photo: string;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    isOnline: boolean;
    availability: WeeklyAvailability;
    serviceRadius: number; // in miles
    preferredLocations: string[];
  }
  
  // Weekly availability schedule
  export interface WeeklyAvailability {
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
  }
  
  export interface DayAvailability {
    start: string; // HH:MM format
    end: string; // HH:MM format
    available: boolean;
  }
  
  // Booking request from clients
  export interface BookingRequest {
    id: string;
    clientId: string;
    clientName: string;
    clientPhoto: string;
    sessionType: string;
    preferredDate: string; // YYYY-MM-DD
    preferredTime: string; // HH:MM AM/PM
    duration: number; // minutes
    location: string;
    address: string;
    rate: number;
    message: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
    createdAt: string; // ISO date string
  }
  
  // Client information
  export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string;
    joinDate: string; // YYYY-MM-DD
    totalSessions: number;
    lastSession: string; // YYYY-MM-DD
    goals: string[];
    notes: string;
    status: 'active' | 'inactive' | 'suspended';
  }
  
  // Trainer statistics and analytics
  export interface TrainerStats {
    todayEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    totalSessions: number;
    activeClients: number;
    rating: number;
    totalReviews: number;
  }
  
  // Scheduled session
  export interface ScheduledSession {
    id: string;
    clientId: string;
    clientName: string;
    clientPhoto: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    duration: number; // minutes
    sessionType: string;
    location: string;
    address: string;
    rate: number;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
    notes?: string;
  }
  
  // Payment and earning records
  export interface EarningRecord {
    id: string;
    sessionId: string;
    clientName: string;
    date: string; // YYYY-MM-DD
    amount: number;
    sessionType: string;
    duration: number;
    paymentMethod: 'card' | 'cash' | 'app_credit';
    status: 'pending' | 'paid' | 'disputed';
  }
  
  // Notification types
  export interface Notification {
    id: string;
    type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'review_received' | 'system';
    title: string;
    message: string;
    timestamp: string; // ISO date string
    read: boolean;
    actionRequired?: boolean;
    relatedId?: string; // ID of related booking, client, etc.
  }
  
  // Location coordinates
  export interface Location {
    latitude: number;
    longitude: number;
  }
  
  // Review from client
  export interface Review {
    id: string;
    clientId: string;
    clientName: string;
    clientPhoto: string;
    sessionId: string;
    rating: number; // 1-5
    comment: string;
    date: string; // YYYY-MM-DD
    response?: string; // Trainer's response to review
  }
  
  // App settings
  export interface TrainerSettings {
    notifications: {
      bookingRequests: boolean;
      bookingReminders: boolean;
      paymentUpdates: boolean;
      reviews: boolean;
      marketing: boolean;
    };
    privacy: {
      showProfileToClients: boolean;
      allowDirectBooking: boolean;
      showOnlineStatus: boolean;
    };
    business: {
      autoAcceptRegularClients: boolean;
      requireAdvanceBooking: number; // hours
      cancellationPolicy: string;
      requireDeposit: boolean;
      depositAmount: number; // percentage
    };
  }
  
  // Authentication context types
  export interface User {
    id: string;
    name: string;
    email: string;
    userType: 'trainer' | 'client';
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
  }
  
  export interface AuthContextType {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    userType: 'trainer' | 'client';
  }
  
  // Component prop types
  export interface DashboardProps {
    stats: TrainerStats;
    recentBookings: BookingRequest[];
    onViewAllBookings: () => void;
  }
  
  export interface BookingRequestsProps {
    requests: BookingRequest[];
    onResponse: (requestId: string, action: 'accept' | 'decline', message?: string) => Promise<void>;
    onBack: () => void;
  }
  
  export interface ClientsListProps {
    clients: Client[];
    onBack: () => void;
  }
  
  export interface SchedulePageProps {
    onBack: () => void;
  }
  
  export interface EarningsPageProps {
    stats: TrainerStats;
    onBack: () => void;
  }
  
  export interface ProfileSetupProps {
    profile: TrainerProfile | null;
    isEditing?: boolean;
    onProfileComplete: (profile: TrainerProfile) => void;
    onBack?: () => void;
  }
  
  export interface SettingsPageProps {
    onBack: () => void;
    onLogout: () => void;
  }
  
  export interface OnlineToggleProps {
    isOnline: boolean;
    onToggle: (online: boolean) => Promise<void>;
    locationLoading: boolean;
  }
  
  export interface LocationTrackerProps {
    onLocationUpdate: (location: Location) => void;
  }
  
  export interface TrainerHeaderProps {
    trainerName: string;
    currentPage: string;
    onNavigate: (page: 'dashboard' | 'profile' | 'bookings' | 'clients' | 'schedule' | 'earnings' | 'settings') => void;
    onLogout: () => void;
  }
  
  // API response types
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  // Error types
  export interface AppError {
    code: string;
    message: string;
    details?: any;
  }