import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Client } from '../types';

interface ClientsListProps {
  clients: Client[];
  onBack: () => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, onBack }) => {
  const renderClient = ({ item }: { item: Client }) => (
    <View style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <View style={styles.clientAvatar}>
          <Text style={styles.clientInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientStatus}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.clientDetails}>
        <Text style={styles.clientEmail}>{item.email}</Text>
        <Text style={styles.clientPhone}>{item.phone}</Text>
      </View>
      
      <View style={styles.clientStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>{item.totalSessions}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Session</Text>
          <Text style={styles.statValue}>{item.lastSession}</Text>
        </View>
      </View>
      
      {item.goals.length > 0 && (
        <View style={styles.goalsContainer}>
          <Text style={styles.goalsLabel}>Goals</Text>
          <View style={styles.goalsList}>
            {item.goals.map((goal, index) => (
              <View key={index} style={styles.goalTag}>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notes}>{item.notes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Clients</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    padding: 20,
  },
  clientCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  clientStatus: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clientDetails: {
    marginBottom: 12,
  },
  clientEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
  },
  clientStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  goalsContainer: {
    marginBottom: 12,
  },
  goalsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  goalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#666',
  },
  notesContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ClientsList; 