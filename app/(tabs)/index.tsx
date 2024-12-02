import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  Modal,
  Pressable,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const [instances, setInstances] = useState<{ key: string; timestamp: Date }[]>([]);
  const [helpVisible, setHelpVisible] = useState(false); // State for help modal visibility
  const [grouping, setGrouping] = useState('day'); // Default grouping: Day

  // Function to add a new instance with a unique key
  const addInstance = () => {
    const newInstance = {
      key: Date.now().toString(),
      timestamp: new Date(),
    };
    setInstances((prevInstances) => [...prevInstances, newInstance]);
  };

  // Function to delete an instance
  const deleteInstance = (key: string) => {
    setInstances((prevInstances) => prevInstances.filter((instance) => instance.key !== key));
  };

  // Prompt the user for confirmation before deleting
  const confirmDelete = (key: string) => {
    Alert.alert(
      'Delete Instance',
      'Are you sure you want to delete this instance?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteInstance(key) },
      ],
      { cancelable: true }
    );
  };

  // Grouping logic based on selected period
  const groupInstances = () => {
    const grouped: { [key: string]: typeof instances } = {};

    instances.forEach((instance) => {
      let key: string;

      // Determine grouping key based on selected grouping period
      switch (grouping) {
        case 'hour':
          key = instance.timestamp.toLocaleString(undefined, {
            hour: '2-digit',
            hour12: true,
          });
          break;
        case 'half-day':
          const hours = instance.timestamp.getHours();
          key = hours < 12 ? 'AM' : 'PM';
          key = `${instance.timestamp.toDateString()} (${key})`;
          break;
        case 'month':
          key = instance.timestamp.toLocaleString(undefined, { month: 'long', year: 'numeric' });
          break;
        case 'day':
        default:
          key = instance.timestamp.toDateString();
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(instance);
    });

    return Object.entries(grouped);
  };

  return (
    <View style={styles.container}>
      {/* Title Row */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>TallyWise</Text>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpButton}>
          <FontAwesome name="info-circle" size={24} color="#0077cc" />
        </TouchableOpacity>
      </View>

      {/* Dropdown for Grouping Selection */}
      <RNPickerSelect
        onValueChange={(value) => {
          console.log('Picker Value Changed:', value); // Log the selected value
          setGrouping(value);
        }}
        items={[
          { label: 'Day', value: 'day' },
          { label: 'Half Day (AM/PM)', value: 'half-day' },
          { label: 'Hour', value: 'hour' },
          { label: 'Month', value: 'month' },
        ]}
        value={grouping}
        placeholder={{ label: 'Select Time Period...', value: null }}
        onOpen={() => console.log('Picker Opened')} // Log when picker opens
        onClose={() => console.log('Picker Closed')} // Log when picker closes
        style={{
          ...pickerStyles,
          placeholder: {
            color: '#999',
          },
        }}
        useNativeAndroidPickerStyle={false}
      />



      {/* Grouped List of Instances */}
      <FlatList
        data={groupInstances()}
        keyExtractor={([key]) => key}
        renderItem={({ item: [key, instances] }) => (
          <View>
            {/* Group Header */}
            <Text style={styles.dateHeader}>{key}</Text>
            {/* Tally for the Group */}
            <Text style={styles.dailyTally}>Total records: {instances.length}</Text>
            {/* Instances for the Group */}
            {instances.map((instance) => (
              <View key={instance.key} style={styles.row}>
                <Text style={styles.timestamp}>{instance.timestamp.toLocaleTimeString()}</Text>
                <TouchableHighlight
                  underlayColor="#d3d3d3"
                  onLongPress={() => confirmDelete(instance.key)}
                >
                  <FontAwesome name="trash" size={24} color="#ff0000" style={styles.icon} />
                </TouchableHighlight>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No instances yet! Add one below.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Add Instance Button */}
      <TouchableOpacity style={styles.button} onPress={addInstance}>
        <Text style={styles.buttonText}>Add Instance</Text>
      </TouchableOpacity>

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpVisible}
        onRequestClose={() => setHelpVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Use TallyWise</Text>
            <Text style={styles.modalText}>
              - Tap the "Add Instance" button to log an occurrence of something you are tracking.
            </Text>
            <Text style={styles.modalText}>
              - Use the dropdown menu to group instances by day, half-day, hour, or month.
            </Text>
            <Text style={styles.modalText}>
              - Long-press the trash icon to delete a record.
            </Text>
            <Pressable style={styles.closeButton} onPress={() => setHelpVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  helpButton: {
    marginLeft: 10,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#0077cc',
  },
  dailyTally: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  timestamp: {
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginLeft: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  button: {
    position: 'absolute',
    bottom: '15%',
    width: '80%',
    backgroundColor: '#6200ee',
    paddingVertical: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    color: '#333',
    borderColor: '#0077cc',
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    color: '#333',
    borderColor: '#0077cc',
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  placeholder: {
    color: '#999', // Placeholder color for better visibility
  },
};


