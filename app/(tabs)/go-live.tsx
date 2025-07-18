// app/(tabs)/go-live.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomButton } from '../../components/CustomUI'

export default function GoLiveScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Go Live</Text>
          <Text style={styles.subtitle}>Start your stream</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.placeholder}>📹 Go Live Coming Soon!</Text>
          <Text style={styles.description}>
            Start streaming to your audience with just one tap
          </Text>
          <CustomButton
            title="Start Streaming"
            onPress={() => {}}
            buttonStyle={styles.liveButton}
            titleStyle={styles.liveButtonText}
            disabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholder: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  liveButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  liveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
})