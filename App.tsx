import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { TrainerProfile, BookingRequest, Client, TrainerStats } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import LoadingScreen from './components/LoadingScreen';
import AuthWrapper from './components/AuthWrapper';
import TrainerHeader from './components/TrainerHeader';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import BookingRequests from './components/BookingRequests';
import ClientsList from './components/ClientsList';
import SchedulePage from './components/SchedulePage';
import EarningsPage from './components/EarningsPage';
import SettingsPage from './components/SettingsPage';
import OnlineToggle from './components/OnlineToggle';
import LocationTracker from './components/LocationTracker';
import TrainersList from './components/TrainersList';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const MainTrainerApp: React.FC = () => {
  const { state: authState, logout } = useAuth();
  
  // Trainer state
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  // App navigation state
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile' | 'bookings' | 'clients' | 'schedule' | 'earnings' | 'settings' | 'trainers' | 'analytics'>('dashboard');
  
  // Data state
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<TrainerStats>({
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalSessions: 0,
    activeClients: 0,
    rating: 0,
    totalReviews: 0
  });
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      initializeTrainerApp();
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (isOnline) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [isOnline]);

  const initializeTrainerApp = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Load trainer profile
      await loadTrainerProfile();
      
      // Load initial data
      await Promise.all([
        loadBookingRequests(),
        loadClients(),
        loadStats()
      ]);
      
      // Request location permissions
      await requestLocationPermission();
      
    } catch (error) {
      console.error('Error initializing trainer app:', error);
      Alert.alert('Error', 'Failed to load trainer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTrainerProfile = async (): Promise<void> => {
    // In a real app, this would fetch from your API
    const mockProfile: TrainerProfile = {
      id: authState.user?.id || '1',
      name: authState.user?.name || 'John Smith',
      email: authState.user?.email || 'john@example.com',
      phone: '+1 (555) 123-4567',
      specialties: ['Weight Training', 'Cardio', 'Nutrition'],
      certifications: ['NASM-CPT', 'ACSM', 'Nutrition Specialist'],
      experience: '5 years',
      hourlyRate: 75,
      bio: 'Experienced personal trainer specializing in strength training and weight loss.',
      photo: 'https://via.placeholder.com/150',
      rating: 4.8,
      totalReviews: 127,
      isVerified: true,
      isOnline: false,
      availability: {
        monday: { start: '06:00', end: '20:00', available: true },
        tuesday: { start: '06:00', end: '20:00', available: true },
        wednesday: { start: '06:00', end: '20:00', available: true },
        thursday: { start: '06:00', end: '20:00', available: true },
        friday: { start: '06:00', end: '20:00', available: true },
        saturday: { start: '08:00', end: '18:00', available: true },
        sunday: { start: '08:00', end: '18:00', available: false }
      },
      serviceRadius: 10, // miles
      preferredLocations: ['Gyms', 'Client Home', 'Outdoor Parks']
    };
    
    setTrainerProfile(mockProfile);
  };

  const loadBookingRequests = async (): Promise<void> => {
    // Mock booking requests
    const mockRequests: BookingRequest[] = [
      {
        id: '1',
        clientId: 'client1',
        clientName: 'Sarah Johnson',
        clientPhoto: 'https://via.placeholder.com/50',
        sessionType: 'Weight Training',
        preferredDate: '2025-07-15',
        preferredTime: '10:00 AM',
        duration: 60,
        location: 'Client Home',
        address: '123 Oak Street, Boston, MA',
        rate: 75,
        message: 'Looking for help with strength training for beginners.',
        status: 'pending',
        createdAt: '2025-07-13T08:30:00Z'
      },
      {
        id: '2',
        clientId: 'client2',
        clientName: 'Mike Chen',
        clientPhoto: 'https://via.placeholder.com/50',
        sessionType: 'Cardio',
        preferredDate: '2025-07-14',
        preferredTime: '7:00 AM',
        duration: 45,
        location: 'Local Gym',
        address: 'FitLife Gym, 456 Main St, Boston, MA',
        rate: 75,
        message: 'Need help with cardio routine and motivation.',
        status: 'pending',
        createdAt: '2025-07-13T09:15:00Z'
      }
    ];
    
    setBookingRequests(mockRequests);
  };

  const loadClients = async (): Promise<void> => {
    // Mock clients
    const mockClients: Client[] = [
      {
        id: 'client1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 987-6543',
        photo: 'https://via.placeholder.com/50',
        joinDate: '2025-06-01',
        totalSessions: 12,
        lastSession: '2025-07-10',
        goals: ['Weight Loss', 'Strength Building'],
        notes: 'Prefers morning sessions. Has knee injury - avoid high impact exercises.',
        status: 'active'
      },
      {
        id: 'client2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1 (555) 456-7890',
        photo: 'https://via.placeholder.com/50',
        joinDate: '2025-05-15',
        totalSessions: 8,
        lastSession: '2025-07-08',
        goals: ['Cardio Improvement', 'Marathon Training'],
        notes: 'Training for Boston Marathon. Very motivated.',
        status: 'active'
      }
    ];
    
    setClients(mockClients);
  };

  const loadStats = async (): Promise<void> => {
    const mockStats: TrainerStats = {
      todayEarnings: 225,
      weeklyEarnings: 1125,
      monthlyEarnings: 4500,
      totalSessions: 156,
      activeClients: 12,
      rating: 4.8,
      totalReviews: 127
    };
    
    setStats(mockStats);
  };

  const requestLocationPermission = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Required', 
          'Location access is required to show your availability to nearby clients.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {/* Open app settings */} }
          ]
        );
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  const startLocationTracking = async (): Promise<void> => {
    if (!currentLocation) {
      setLocationLoading(true);
    }
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      // In a real app, send location to backend
      console.log('Location updated:', location.coords);
    } catch (error) {
      console.error('Location tracking error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const stopLocationTracking = (): void => {
    // In a real app, stop sending location updates to backend
    console.log('Location tracking stopped');
  };

  const handleOnlineToggle = async (online: boolean): Promise<void> => {
    setIsOnline(online);
    
    if (trainerProfile) {
      const updatedProfile = { ...trainerProfile, isOnline: online };
      setTrainerProfile(updatedProfile);
      
      // In a real app, update backend
      try {
        // await updateTrainerOnlineStatus(online);
        console.log(`Trainer is now ${online ? 'online' : 'offline'}`);
      } catch (error) {
        console.error('Error updating online status:', error);
        // Revert on error
        setIsOnline(!online);
        Alert.alert('Error', 'Failed to update online status. Please try again.');
      }
    }
  };

  const handleBookingResponse = async (requestId: string, action: 'accept' | 'decline', message?: string): Promise<void> => {
    try {
      // Update booking request status
      setBookingRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: action === 'accept' ? 'accepted' : 'declined' }
            : request
        )
      );

      // In a real app, send response to backend
      console.log(`Booking ${requestId} ${action}ed`, { message });
      
      const actionText = action === 'accept' ? 'accepted' : 'declined';
      Alert.alert('Success', `Booking request ${actionText} successfully!`);
      
    } catch (error) {
      console.error('Error responding to booking:', error);
      Alert.alert('Error', 'Failed to respond to booking request. Please try again.');
    }
  };

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You will stop receiving booking requests.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            setIsOnline(false);
            logout();
          },
          style: 'destructive'
        },
      ]
    );
  };

  // Show loading screen while checking auth status
  if (authState.isLoading) {
    return <LoadingScreen />;
  }

  // Show auth screens if not authenticated
  if (!authState.isAuthenticated) {
    return <AuthWrapper />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  // Show profile setup if trainer hasn't completed profile
  if (!trainerProfile?.isVerified) {
    return (
      <ProfileSetup 
        profile={trainerProfile}
        onProfileComplete={(profile) => {
          setTrainerProfile(profile);
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats}
            recentBookings={bookingRequests.slice(0, 3)}
            onViewAllBookings={() => setCurrentPage('bookings')}
          />
        );
      case 'bookings':
        return (
          <BookingRequests 
            requests={bookingRequests}
            onResponse={handleBookingResponse}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'clients':
        return (
          <ClientsList 
            clients={clients}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'schedule':
        return (
          <SchedulePage 
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'earnings':
        return (
          <EarningsPage 
            stats={stats}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'profile':
        return (
          <ProfileSetup 
            profile={trainerProfile}
            isEditing={true}
            onProfileComplete={(profile) => {
              setTrainerProfile(profile);
              setCurrentPage('dashboard');
            }}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            onBack={() => setCurrentPage('dashboard')}
            onLogout={handleLogout}
          />
        );
      case 'trainers':
        return (
          <TrainersList 
            onBack={() => setCurrentPage('dashboard')}
            onTrainerSelect={(trainer) => {
              Alert.alert(
                'Trainer Selected',
                `You selected ${trainer.name}. This would open the trainer's detailed profile.`
              );
            }}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard 
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TrainerHeader 
        trainerName={trainerProfile?.name || 'Trainer'}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <OnlineToggle 
        isOnline={isOnline}
        onToggle={handleOnlineToggle}
        locationLoading={locationLoading}
      />

      {renderCurrentPage()}

      {isOnline && (
        <LocationTracker 
          onLocationUpdate={(location) => setCurrentLocation(location)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

const TrainerApp: React.FC = () => {
  return (
    <AuthProvider>
      <MainTrainerApp />
    </AuthProvider>
  );
};

export default TrainerApp;