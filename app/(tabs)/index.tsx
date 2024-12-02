import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
} from 'react-native';

export default function HomeScreen() {
  const [instances, setInstances] = useState<{ id: number; name: string; timestamp: Date }[]>([]);

  // Function to add a new instance with a timestamp
  const addInstance = () => {
    const newInstance = {
      id: instances.length + 1,
      name: `Instance ${instances.length + 1}`,
      timestamp: new Date(),
    };
    setInstances((prevInstances) => [...prevInstances, newInstance]);
  };

  // Function to delete an instance
  const deleteInstance = (id: number) => {
    setInstances((prevInstances) => prevInstances.filter((instance) => instance.id !== id));
  };

  // Prompt the user for confirmation before deleting
  const confirmDelete = (id: number, name: string) => {
    Alert.alert(
      'Delete Instance',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteInstance(id) },
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
      {/* Title */}
      <Text style={styles.title}>TallyWise</Text>

      {/* Grouped List of Instances */}
      <FlatList
        data={groupByDate()}
        keyExtractor={([date]) => date}
        renderItem={({ item: [date, instances] }) => (
          <View>
            {/* Date Header */}
            <Text style={styles.dateHeader}>{date}</Text>
            {/* Instances for the Date */}
            {instances.map((instance) => (
              <TouchableHighlight
                key={instance.id}
                underlayColor="#d3d3d3"
                onLongPress={() => confirmDelete(instance.id, instance.name)} // Long press to delete
              >
                <View style={styles.row}>
                  <Text style={styles.rowText}>{instance.name}</Text>
                  <Text style={styles.spacer}>|</Text>
                  <Text style={styles.timestamp}>{instance.timestamp.toLocaleTimeString()}</Text>
                </View>
              </TouchableHighlight>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No instances yet! Add one below.</Text>}
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#0077cc',
    textAlign: 'left',
    width: '100%',
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
  rowText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  spacer: {
    fontSize: 16,
    color: '#999',
    marginHorizontal: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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
});
