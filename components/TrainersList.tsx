import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Trainer {
  id: string;
  name: string;
  photo: string;
  rating: number;
  totalReviews: number;
  specialties: string[];
  hourlyRate: number;
  experience: string;
  isOnline: boolean;
  isVerified: boolean;
  distance?: number; // in miles
}

interface TrainersListProps {
  onBack?: () => void;
  onTrainerSelect?: (trainer: Trainer) => void;
}

const TrainersList: React.FC<TrainersListProps> = ({ onBack, onTrainerSelect }) => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Mock trainers data (replace with Supabase integration)
      const mockTrainers: Trainer[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          photo: 'https://via.placeholder.com/80',
          rating: 4.8,
          totalReviews: 127,
          specialties: ['Weight Training', 'Cardio', 'Nutrition'],
          hourlyRate: 75,
          experience: '5 years',
          isOnline: true,
          isVerified: true,
          distance: 2.5
        },
        {
          id: '2',
          name: 'Mike Chen',
          photo: 'https://via.placeholder.com/80',
          rating: 4.6,
          totalReviews: 89,
          specialties: ['Yoga', 'Pilates', 'Flexibility'],
          hourlyRate: 65,
          experience: '3 years',
          isOnline: false,
          isVerified: true,
          distance: 1.8
        },
        {
          id: '3',
          name: 'Alex Rodriguez',
          photo: 'https://via.placeholder.com/80',
          rating: 4.9,
          totalReviews: 203,
          specialties: ['CrossFit', 'Strength Training', 'Sports Performance'],
          hourlyRate: 85,
          experience: '7 years',
          isOnline: true,
          isVerified: true,
          distance: 3.2
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTrainers(mockTrainers);
      
    } catch (error) {
      console.error('Error loading trainers:', error);
      Alert.alert('Error', 'Failed to load trainers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadTrainers();
    setRefreshing(false);
  };

  const handleTrainerSelect = (trainer: Trainer): void => {
    if (onTrainerSelect) {
      onTrainerSelect(trainer);
    } else {
      Alert.alert(
        'Trainer Selected',
        `You selected ${trainer.name}. This would open the trainer's detailed profile.`
      );
    }
  };

  const renderTrainerItem = ({ item }: { item: Trainer }) => (
    <TouchableOpacity
      style={styles.trainerCard}
      onPress={() => handleTrainerSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.trainerHeader}>
        <Image source={{ uri: item.photo }} style={styles.trainerPhoto} />
        <View style={styles.trainerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.trainerName}>{item.name}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            )}
          </View>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.totalReviews} reviews)
            </Text>
          </View>
          
          <Text style={styles.experienceText}>{item.experience} experience</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.onlineIndicator, { backgroundColor: item.isOnline ? '#4CAF50' : '#9E9E9E' }]} />
          <Text style={styles.onlineText}>{item.isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>
      
      <View style={styles.specialtiesContainer}>
        {item.specialties.slice(0, 3).map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
        {item.specialties.length > 3 && (
          <Text style={styles.moreSpecialties}>+{item.specialties.length - 3} more</Text>
        )}
      </View>
      
      <View style={styles.footerRow}>
        <Text style={styles.rateText}>${item.hourlyRate}/hour</Text>
        {item.distance && (
          <Text style={styles.distanceText}>{item.distance} miles away</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Personal Trainers</Text>
      <Text style={styles.subtitle}>Find the perfect trainer for your fitness goals</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No Trainers Available</Text>
      <Text style={styles.emptySubtitle}>
        There are currently no approved trainers in your area. Check back later!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading trainers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Personal Trainers</Text>
      </View>
      
      <FlatList
        data={trainers}
        renderItem={renderTrainerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  listContainer: {
    padding: 20,
  },
  trainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trainerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  trainerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  trainerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 14,
    color: '#666666',
  },
  statusContainer: {
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#666666',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  moreSpecialties: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  distanceText: {
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});

export default TrainersList; 