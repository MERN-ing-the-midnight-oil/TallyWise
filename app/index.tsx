import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../src/styles/HomeScreenStyles';
import DeleteButton from '../src/components/DeleteButton';
import NoteButton from '../src/components/NoteButton';
import CustomDropdown from '../src/components/CustomDropdown';
import dropdownOptions from '../src/constants/dropdownOptions';

export default function HomeScreen() {
  const [instances, setInstances] = useState<{ key: string; timestamp: Date; note?: string }[]>([]);
  const [grouping, setGrouping] = useState('');

  // Key to store data in AsyncStorage
  const STORAGE_KEY = 'userInstances';

  // Load instances when the app starts
  useEffect(() => {
    const loadInstances = async () => {
      try {
        const savedInstances = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedInstances) {
          // Convert timestamp back to Date objects
          const parsedInstances = JSON.parse(savedInstances).map((instance: any) => ({
            ...instance,
            timestamp: new Date(instance.timestamp),
          }));
          setInstances(parsedInstances);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadInstances();
  }, []);

  // Save instances when they change
  useEffect(() => {
    const saveInstances = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
        console.log('Instances saved to AsyncStorage!');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveInstances();
  }, [instances]);

  // Function to add an instance
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

  // Group instances by selected time period
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
      </View>
      <CustomDropdown
        options={dropdownOptions}
        selectedValue={grouping}
        onValueChange={(value) => setGrouping(value)}
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
                <NoteButton
                  note={instance.note}
                  onSave={(note) => {
                    setInstances((prevInstances) =>
                      prevInstances.map((i) =>
                        i.key === instance.key ? { ...i, note } : i
                      )
                    );
                  }}
                />
                <Text style={styles.timestamp}>
                  {instance.timestamp.toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </Text>
                <DeleteButton instanceKey={instance.key} onDelete={deleteInstance} />
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
