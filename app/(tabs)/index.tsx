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
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const [instances, setInstances] = useState<{ key: string; timestamp: Date }[]>([]);
  const [helpVisible, setHelpVisible] = useState(false); // State for help modal visibility

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

  // Function to group instances by date
  const groupByDate = () => {
    const grouped: { [key: string]: typeof instances } = {};
    instances.forEach((instance) => {
      const dateKey = instance.timestamp.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(instance);
    });
    return Object.entries(grouped);
  };

  return (
    <View style={styles.container}>
      {/* Title Row with Help Icon */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>TallyWise</Text>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpButton}>
          <FontAwesome name="info-circle" size={24} color="#0077cc" />
        </TouchableOpacity>
      </View>

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
              - Each entry is timestamped to track when it occurred.
            </Text>
            <Text style={styles.modalText}>
              - Records are grouped by day, showing how many times something happened each day.
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

      {/* Grouped List of Instances */}
      <FlatList
        data={groupByDate()}
        keyExtractor={([date]) => date}
        renderItem={({ item: [date, instances] }) => (
          <View>
            <Text style={styles.dateHeader}>{date}</Text>
            <Text style={styles.dailyTally}>Total records: {instances.length}</Text>
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
    marginBottom: 5,
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
    alignItems: 'center',
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
