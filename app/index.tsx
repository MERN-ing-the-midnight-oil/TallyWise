import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import CustomDropdown from '../src/components/CustomDropdown';
import DeleteButton from '../src/components/DeleteButton';
import dropdownOptions from '../src/constants/dropdownOptions';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const [instances, setInstances] = useState<{ key: string; timestamp: Date }[]>([]);
  const [helpVisible, setHelpVisible] = useState(false);
  const [grouping, setGrouping] = useState('');

  const addInstance = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Add a new instance
    const newInstance = {
      key: Date.now().toString(),
      timestamp: new Date(),
    };
    setInstances((prevInstances) => [...prevInstances, newInstance]);
  };

  const deleteInstance = (key: string) => {
    setInstances((prevInstances) => prevInstances.filter((instance) => instance.key !== key));
  };

  const groupByDate = () => {
    const grouped: { [key: string]: typeof instances } = {};
    instances.forEach((instance) => {
      let dateKey = '';
      const timestamp = instance.timestamp;

      switch (grouping) {
        case 'minute':
          dateKey = `${timestamp.toDateString()}, ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Minute`;
          break;
        case 'hour':
          dateKey = `${timestamp.toDateString()}, ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '00' })} Hour`;
          break;
        case 'half-day':
          const ampm = timestamp.getHours() < 12 ? 'AM' : 'PM';
          dateKey = `${timestamp.toDateString()}, ${ampm} Half-Day`;
          break;
        case 'month':
          const monthName = timestamp.toLocaleString('default', { month: 'long' });
          dateKey = `${monthName} ${timestamp.getFullYear()} Month`;
          break;
        case 'all-time':
          dateKey = 'All Time';
          break;
        case 'day':
        default:
          dateKey = `${timestamp.toDateString()}`;
          break;
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(instance);
    });

    return Object.entries(grouped);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>TallyWise</Text>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpButton}>
          <FontAwesome name="info-circle" size={24} color="#0077cc" />
        </TouchableOpacity>
      </View>
      <CustomDropdown
        options={dropdownOptions}
        selectedValue={grouping}
        onValueChange={(value) => {
          console.log('Selected Value:', value);
          setGrouping(value);
        }}
      />

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
                <DeleteButton
                  instanceKey={instance.key}
                  onDelete={deleteInstance}
                />
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No instances yet! Add one below.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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

