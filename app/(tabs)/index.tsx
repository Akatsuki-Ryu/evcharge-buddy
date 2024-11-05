import { StyleSheet, Platform, TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const getDefaultStopTime = () => {
    const now = new Date();
    const sixAM = new Date(now);
    sixAM.setHours(6, 0, 0, 0); // Set to 6:00:00.000 AM

    // If current time is after 6 AM, set to 6 AM tomorrow
    if (now > sixAM) {
      sixAM.setDate(sixAM.getDate() + 1);
    }

    return sixAM;
  };

  const [currentLevel, setCurrentLevel] = useState(10);
  const [requiredLevel, setRequiredLevel] = useState(80);
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [stopTime, setStopTime] = useState(getDefaultStopTime());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const calculateTimeLength = (endTime: Date): number => {
    const now = new Date();
    let timeDiff = endTime.getTime() - now.getTime();
    
    // If the selected time is earlier today, assume it's for tomorrow
    if (timeDiff < 0) {
      const tomorrow = new Date(endTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      timeDiff = tomorrow.getTime() - now.getTime();
    }
    
    // Convert milliseconds to hours
    return Number((timeDiff / (1000 * 60 * 60)).toFixed(2));
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setStopTime(selectedTime);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateCharging = () => {
    const time = calculateTimeLength(stopTime);
    const capacity = parseFloat(batteryCapacity);

    if (isNaN(time) || isNaN(capacity)) {
      return { toBeCharged: 0, chargingSpeed: 0 };
    }

    const toBeCharged = ((requiredLevel - currentLevel) / 100) * capacity;
    const chargingSpeed = toBeCharged / time;

    return { toBeCharged, chargingSpeed };
  };

  const results = calculateCharging();
  const timeLength = calculateTimeLength(stopTime);

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
          <ThemedText>Stop Charging</ThemedText>
          <Pressable 
            onPress={() => setShowTimePicker(true)}
            style={styles.timePickerButton}
          >
            <ThemedText>{formatTime(stopTime)}</ThemedText>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={stopTime}
              mode="time"
              is24Hour={true}
              onChange={onTimeChange}
            />
          )}
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText>Charging Time</ThemedText>
          <ThemedView style={styles.calculatedTimeContainer}>
            <ThemedText style={styles.calculatedTime}>
              {timeLength.toFixed(2)} hours
            </ThemedText>
          </ThemedView>
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
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  calculatedTimeContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  calculatedTime: {
    fontSize: 16,
  },
});