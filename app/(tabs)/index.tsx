import { StyleSheet, Platform, TextInput, View } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [requiredLevel, setRequiredLevel] = useState(0);
  const [chargingTime, setChargingTime] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');

  const calculateCharging = () => {
    const time = parseFloat(chargingTime);
    const capacity = parseFloat(batteryCapacity);

    if (isNaN(time) || isNaN(capacity)) {
      return { toBeCharged: 0, chargingSpeed: 0 };
    }

    const toBeCharged = ((requiredLevel - currentLevel) / 100) * capacity;
    const chargingSpeed = toBeCharged / time;

    return { toBeCharged, chargingSpeed };
  };

  const results = calculateCharging();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>EV Charging Calculator</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedView style={styles.inputGroup}>
          <ThemedView style={styles.sliderHeader}>
            <ThemedText>Current Level</ThemedText>
            <ThemedText>{currentLevel.toFixed(0)}%</ThemedText>
          </ThemedView>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={currentLevel}
            onValueChange={setCurrentLevel}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#000000"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedView style={styles.sliderHeader}>
            <ThemedText>Required Level</ThemedText>
            <ThemedText>{requiredLevel.toFixed(0)}%</ThemedText>
          </ThemedView>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={requiredLevel}
            onValueChange={setRequiredLevel}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#000000"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText>Charging Time (h)</ThemedText>
          <TextInput
            style={styles.input}
            value={chargingTime}
            onChangeText={setChargingTime}
            keyboardType="numeric"
            placeholder="Hours"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText>Battery Capacity (kWh)</ThemedText>
          <TextInput
            style={styles.input}
            value={batteryCapacity}
            onChangeText={setBatteryCapacity}
            keyboardType="numeric"
            placeholder="kWh"
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.resultContainer}>
        <ThemedView style={styles.resultGroup}>
          <ThemedText type="subtitle">To be charged:</ThemedText>
          <ThemedText>{results.toBeCharged.toFixed(2)} kWh</ThemedText>
        </ThemedView>

        <ThemedView style={styles.resultGroup}>
          <ThemedText type="subtitle">Charging speed:</ThemedText>
          <ThemedText>{results.chargingSpeed.toFixed(2)} kW</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 30,
    gap: 16,
  },
  resultGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
});
