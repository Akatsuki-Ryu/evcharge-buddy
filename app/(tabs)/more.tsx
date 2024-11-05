import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExternalLink } from '@/components/ExternalLink';

export default function MoreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="information-circle" style={styles.headerImage} />}>
      
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>Credits</ThemedText>
        
        <ThemedView style={styles.creditItem}>
          <ThemedText type="subtitle">Developer</ThemedText>
          <ThemedText>Akabox</ThemedText>
        </ThemedView>

        <ThemedView style={styles.creditItem}>
          <ThemedText type="subtitle">Version</ThemedText>
          <ThemedText>{require('../../app.json').expo.version}</ThemedText>
        </ThemedView>

      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>Coming Soon</ThemedText>
        
        <ThemedView style={styles.featureItem}>
          <ThemedText type="subtitle">🔋 Charging History</ThemedText>
          <ThemedText>Track and analyze your charging sessions</ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureItem}>
          <ThemedText type="subtitle">💰 Cost Calculator</ThemedText>
          <ThemedText>Calculate charging costs based on electricity rates</ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureItem}>
          <ThemedText type="subtitle">🚗 Multiple Vehicle Profiles</ThemedText>
          <ThemedText>Save settings for different electric vehicles</ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureItem}>
          <ThemedText type="subtitle">📊 Statistics</ThemedText>
          <ThemedText>View detailed charging statistics and trends</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  creditItem: {
    // backgroundColor: '#E8F4FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  featureItem: {
    // backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
}); 