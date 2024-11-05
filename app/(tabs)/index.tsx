import { StyleSheet, Platform, TextInput, View, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const getDefaultStartTime = () => {
    return new Date();
  };

  const getDefaultStopTime = () => {
    const now = new Date();
    const sixAM = new Date(now);
    sixAM.setHours(6, 0, 0, 0);

    if (now > sixAM) {
      sixAM.setDate(sixAM.getDate() + 1);
    }

    return sixAM;
  };

  const calculateTimeLength = (startTime: Date, endTime: Date): number => {
    let timeDiff = endTime.getTime() - startTime.getTime();
    
    if (timeDiff < 0) {
      const tomorrow = new Date(endTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      timeDiff = tomorrow.getTime() - startTime.getTime();
    }
    
    return Number((timeDiff / (1000 * 60 * 60)).toFixed(2));
  };

  const [currentLevel, setCurrentLevel] = useState(10);
  const [requiredLevel, setRequiredLevel] = useState(80);
  const [batteryCapacity, setBatteryCapacity] = useState('42');
  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [stopTime, setStopTime] = useState(getDefaultStopTime());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showStopTimePicker, setShowStopTimePicker] = useState(false);
  const [chargingTime, setChargingTime] = useState(
    calculateTimeLength(getDefaultStartTime(), getDefaultStopTime()).toFixed(2)
  );

  const onStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
      setChargingTime(calculateTimeLength(selectedTime, stopTime).toFixed(2));
    }
  };

  const onStopTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStopTimePicker(false);
    if (selectedTime) {
      setStopTime(selectedTime);
      setChargingTime(calculateTimeLength(startTime, selectedTime).toFixed(2));
    }
  };

  const updateTimesFromChargingTime = (timeStr: string) => {
    setChargingTime(timeStr);
    
    const hours = parseFloat(timeStr);
    if (!isNaN(hours)) {
      const newStopTime = new Date(startTime);
      newStopTime.setTime(startTime.getTime() + (hours * 60 * 60 * 1000));
      setStopTime(newStopTime);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <ThemedView style={styles.container}>
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
              thumbTintColor="#007AFF"
              tapToSeek={true}
              trackHeight={6}
              thumbSize={40}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedView style={styles.sliderHeader}>
              <ThemedText>Required Level</ThemedText>
              <Pressable 
                onPress={() => setRequiredLevel(80)}
                style={styles.nowButton}
              >
                <ThemedText style={styles.nowButtonText}>80%</ThemedText>
              </Pressable>
            </ThemedView>
            <ThemedView style={styles.sliderHeader}>
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
              thumbTintColor="#007AFF"
              tapToSeek={true}
              trackHeight={6}
              thumbSize={40}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedView style={styles.timePickersRow}>
              <ThemedView style={styles.timePickerContainer}>
                <ThemedView style={styles.timePickerHeader}>
                  <ThemedText>Start</ThemedText>
                  <Pressable 
                    onPress={() => {
                      const now = new Date();
                      setStartTime(now);
                      setChargingTime(calculateTimeLength(now, stopTime).toFixed(2));
                    }}
                    style={styles.nowButton}
                  >
                    <ThemedText style={styles.nowButtonText}>Now</ThemedText>
                  </Pressable>
                </ThemedView>
                <Pressable 
                  onPress={() => setShowStartTimePicker(true)}
                  style={styles.timePickerButton}
                >
                  <ThemedText style={styles.timePickerText}>{formatTime(startTime)}</ThemedText>
                </Pressable>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    is24Hour={true}
                    onChange={onStartTimeChange}
                  />
                )}
              </ThemedView>

              <ThemedView style={styles.timePickerContainer}>
                <ThemedView style={styles.timePickerHeader}>
                  <ThemedText>Stop</ThemedText>
                  <Pressable 
                    onPress={() => {
                      const sixAM = getDefaultStopTime();
                      setStopTime(sixAM);
                      setChargingTime(calculateTimeLength(startTime, sixAM).toFixed(2));
                    }}
                    style={styles.nowButton}
                  >
                    <ThemedText style={styles.nowButtonText}>6am</ThemedText>
                  </Pressable>
                </ThemedView>
                <Pressable 
                  onPress={() => setShowStopTimePicker(true)}
                  style={styles.timePickerButton}
                >
                  <ThemedText style={styles.timePickerText}>{formatTime(stopTime)}</ThemedText>
                </Pressable>
                {showStopTimePicker && (
                  <DateTimePicker
                    value={stopTime}
                    mode="time"
                    is24Hour={true}
                    onChange={onStopTimeChange}
                  />
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedView style={styles.timeInputsRow}>
              <ThemedView style={styles.timeInputContainer}>
                <ThemedText>Charging Time (h)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={chargingTime}
                  onChangeText={updateTimesFromChargingTime}
                  keyboardType="numeric"
                  placeholder="Hours"
                />
              </ThemedView>

              <ThemedView style={styles.timeInputContainer}>
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

            <ThemedView style={styles.quickTimeButtons}>
              <Pressable 
                style={styles.quickTimeButton}
                onPress={() => updateTimesFromChargingTime("3")}
              >
                <ThemedText style={styles.quickTimeText}>3h</ThemedText>
              </Pressable>
              <Pressable 
                style={styles.quickTimeButton}
                onPress={() => updateTimesFromChargingTime("5")}
              >
                <ThemedText style={styles.quickTimeText}>5h</ThemedText>
              </Pressable>
              <Pressable 
                style={styles.quickTimeButton}
                onPress={() => updateTimesFromChargingTime("6")}
              >
                <ThemedText style={styles.quickTimeText}>6h</ThemedText>
              </Pressable>
              <Pressable 
                style={styles.quickTimeButton}
                onPress={() => updateTimesFromChargingTime("8")}
              >
                <ThemedText style={styles.quickTimeText}>8h</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.resultContainer}>
          <ThemedView style={styles.resultGroup}>
            <ThemedText type="subtitle" style={styles.resultLabel}>To be charged:</ThemedText>
            <ThemedText style={styles.resultValue}>{results.toBeCharged.toFixed(2)} kWh</ThemedText>
          </ThemedView>

          <ThemedView style={styles.resultGroup}>
            <ThemedText type="subtitle" style={styles.resultLabel}>Charging speed:</ThemedText>
            <ThemedText style={styles.resultValue}>{results.chargingSpeed.toFixed(2)} kW</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
    height: 60,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  inputDisabled: {
    backgroundColor: '#F8F9FA',
    color: '#2C3E50',
    borderColor: '#007AFF',
  },
  resultContainer: {
    marginTop: 30,
    gap: 16,
  },
  resultGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  resultLabel: {
    color: '#2C3E50',
    fontSize: 20,
    fontWeight: '600',
  },
  resultValue: {
    color: '#2980B9',
    fontSize: 24,
    fontWeight: '700',
  },
  timePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timePickerContainer: {
    flex: 1,
    gap: 4,
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  timePickerText: {
    fontSize: 20,
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'center',
  },
  calculatedTimeContainer: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  calculatedTime: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  quickTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  quickTimeButton: {
    flex: 1,
    backgroundColor: '#E8F4FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTimeText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nowButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  nowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeInputContainer: {
    flex: 1,
    gap: 4,
  },
});
