import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { BookingRequestsProps, BookingRequest } from '../types';

const BookingRequests: React.FC<BookingRequestsProps> = ({ 
  requests, 
  onResponse, 
  onBack 
}) => {
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseAction, setResponseAction] = useState<'accept' | 'decline'>('accept');
  const [responseMessage, setResponseMessage] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string): string => {
    return timeString;
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const requestTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - requestTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'accepted': return '#34C759';
      case 'declined': return '#FF3B30';
      default: return '#666';
    }
  };

  const handleQuickResponse = async (request: BookingRequest, action: 'accept' | 'decline') => {
    if (processing) return;

    try {
      setProcessing(request.id);
      await onResponse(request.id, action);
    } catch (error) {
      console.error('Error responding to booking:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleDetailedResponse = (request: BookingRequest, action: 'accept' | 'decline') => {
    setSelectedRequest(request);
    setResponseAction(action);
    setResponseMessage('');
    setShowResponseModal(true);
  };

  const submitDetailedResponse = async () => {
    if (!selectedRequest || processing) return;

    try {
      setProcessing(selectedRequest.id);
      await onResponse(selectedRequest.id, responseAction, responseMessage);
      setShowResponseModal(false);
      setSelectedRequest(null);
      setResponseMessage('');
    } catch (error) {
      console.error('Error responding to booking:', error);
    } finally {
      setProcessing(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const renderBookingItem = (request: BookingRequest) => (
    <View key={request.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.clientInfo}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientInitial}>
              {request.clientName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.clientDetails}>
            <Text style={styles.clientName}>{request.clientName}</Text>
            <Text style={styles.timeAgo}>{getTimeAgo(request.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
          <Text style={styles.statusText}>{request.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <Text style={styles.sessionType}>{request.sessionType}</Text>
        <Text style={styles.sessionInfo}>
          {formatDate(request.preferredDate)} at {formatTime(request.preferredTime)} • {request.duration} min
        </Text>
        <Text style={styles.location}>{request.location} • {request.address}</Text>
        <Text style={styles.rate}>{formatCurrency(request.rate)}/session</Text>
      </View>

      {request.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Message from client:</Text>
          <Text style={styles.messageText}>{request.message}</Text>
        </View>
      )}

      {request.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDetailedResponse(request, 'decline')}
            disabled={processing === request.id}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleQuickResponse(request, 'accept')}
            disabled={processing === request.id}
          >
            <Text style={styles.acceptButtonText}>
              {processing === request.id ? 'Accepting...' : 'Accept'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Requests</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pending Requests ({pendingRequests.length})
            </Text>
            {pendingRequests.map(renderBookingItem)}
          </View>
        )}

        {/* Processed Requests Section */}
        {processedRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {processedRequests.map(renderBookingItem)}
          </View>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>No booking requests yet</Text>
            <Text style={styles.emptyStateSubtext}>
              When clients request sessions with you, they'll appear here. Make sure you're online to receive requests!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Response Modal */}
      <Modal
        visible={showResponseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResponseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowResponseModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {responseAction === 'accept' ? 'Accept' : 'Decline'} Request
            </Text>
            <TouchableOpacity onPress={submitDetailedResponse} disabled={!!processing}>
              <Text style={[styles.modalSendText, processing && styles.modalSendTextDisabled]}>
                {processing ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedRequest && (
            <View style={styles.modalContent}>
              <View style={styles.modalRequestInfo}>
                <Text style={styles.modalClientName}>{selectedRequest.clientName}</Text>
                <Text style={styles.modalSessionDetails}>
                  {selectedRequest.sessionType} • {formatDate(selectedRequest.preferredDate)} at {formatTime(selectedRequest.preferredTime)}
                </Text>
              </View>

              <View style={styles.messageInputContainer}>
                <Text style={styles.messageInputLabel}>
                  {responseAction === 'accept' 
                    ? 'Add a personal message (optional):' 
                    : 'Let them know why (optional):'
                  }
                </Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder={
                    responseAction === 'accept' 
                      ? "I'm excited to work with you! I'll bring all the equipment we need."
                      : "Unfortunately, I'm not available at that time. Please check my availability for other slots."
                  }
                  value={responseMessage}
                  onChangeText={setResponseMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </View>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  bookingCard: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
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
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 14,
    color: '#666',
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
  sessionDetails: {
    marginBottom: 12,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sessionInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#000',
  },
  declineButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalSendText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  modalSendTextDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    padding: 20,
  },
  modalRequestInfo: {
    marginBottom: 24,
  },
  modalClientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  modalSessionDetails: {
    fontSize: 16,
    color: '#666',
  },
  messageInputContainer: {
    marginBottom: 20,
  },
  messageInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#F5F5F5',
  },
});

export default BookingRequests;