import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { TrainerProfile } from '../types';

interface ProfileSetupProps {
  profile?: TrainerProfile | null;
  isEditing?: boolean;
  onProfileComplete: (profile: TrainerProfile) => void;
  onBack?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({
  profile,
  isEditing = false,
  onProfileComplete,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    hourlyRate: profile?.hourlyRate?.toString() || '',
    specialties: profile?.specialties?.join(', ') || '',
    certifications: profile?.certifications?.join(', ') || '',
    experience: profile?.experience || '',
  });

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.bio) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedProfile: TrainerProfile = {
      id: profile?.id || '1',
      name: formData.name,
      email: profile?.email || 'john@example.com',
      phone: formData.phone,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
      experience: formData.experience,
      hourlyRate: parseInt(formData.hourlyRate) || 75,
      bio: formData.bio,
      photo: profile?.photo || 'https://via.placeholder.com/150',
      rating: profile?.rating || 0,
      totalReviews: profile?.totalReviews || 0,
      isVerified: true,
      isOnline: profile?.isOnline || false,
      availability: profile?.availability || {
        monday: { start: '06:00', end: '20:00', available: true },
        tuesday: { start: '06:00', end: '20:00', available: true },
        wednesday: { start: '06:00', end: '20:00', available: true },
        thursday: { start: '06:00', end: '20:00', available: true },
        friday: { start: '06:00', end: '20:00', available: true },
        saturday: { start: '08:00', end: '18:00', available: true },
        sunday: { start: '08:00', end: '18:00', available: false }
      },
      serviceRadius: profile?.serviceRadius || 10,
      preferredLocations: profile?.preferredLocations || ['Gyms', 'Client Home', 'Outdoor Parks']
    };

    onProfileComplete(updatedProfile);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Profile' : 'Complete Your Profile'}
        </Text>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your full name"
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About You</Text>
          
          <Text style={styles.label}>Bio *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="Tell clients about your experience and approach"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            value={formData.experience}
            onChangeText={(text) => setFormData({ ...formData, experience: text })}
            placeholder="5 years"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & Pricing</Text>
          
          <Text style={styles.label}>Hourly Rate ($)</Text>
          <TextInput
            style={styles.input}
            value={formData.hourlyRate}
            onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
            placeholder="75"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Specialties</Text>
          <TextInput
            style={styles.input}
            value={formData.specialties}
            onChangeText={(text) => setFormData({ ...formData, specialties: text })}
            placeholder="Weight Training, Cardio, Nutrition (comma separated)"
          />

          <Text style={styles.label}>Certifications</Text>
          <TextInput
            style={styles.input}
            value={formData.certifications}
            onChangeText={(text) => setFormData({ ...formData, certifications: text })}
            placeholder="NASM-CPT, ACSM (comma separated)"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Profile' : 'Complete Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  backButton: {
    padding: 4,
  },
  backText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSetup; 