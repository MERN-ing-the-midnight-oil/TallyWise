import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import CustomDropdown from '../src/components/CustomDropdown';
import DeleteButton from '../src/components/DeleteButton';
import dropdownOptions from '../src/constants/dropdownOptions';
import NoteButton from '../src/components/NoteButton';
import styles from '../src/styles/HomeScreenStyles'; // Main styles
import modalStyles from '../src/styles/ModalStyles'; // Modal styles

export default function HomeScreen() {
  const [instances, setInstances] = useState<{ key: string; timestamp: Date }[]>([]);
  const [helpVisible, setHelpVisible] = useState(false); // State for showing the modal
  const [grouping, setGrouping] = useState('');

  // Function to play the click sound
  const playClickSound = async () => {
    try {
      console.log('Attempting to load sound...');
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/click.mp3'),
        { shouldPlay: true } // Ensure sound starts immediately
      );
      console.log('Sound loaded:', sound);
      const status = await sound.getStatusAsync();
      console.log('Sound status before play:', status);
      await sound.playAsync();
      console.log('Sound played.');
      sound.unloadAsync(); // Cleanup
    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  };









  const addInstance = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log('Resolved path:', require('../assets/sounds/click.mp3')); // Log the resolved path
      await playClickSound();

      const newInstance = {
        key: Date.now().toString(),
        timestamp: new Date(),
      };
      setInstances((prevInstances) => [...prevInstances, newInstance]);
    } catch (error) {
      console.error('Error in addInstance:', error);
    }
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
          dateKey = `${timestamp.toDateString()}, ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Hour`;
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
        onValueChange={(value) => setGrouping(value)}
      />

      <FlatList
        data={groupByDate()}
        keyExtractor={([date]) => date}
        renderItem={({ item: [date, instances] }) => (
          <View>
            {/* Group Header */}
            <Text style={styles.dateHeader}>{date}</Text>
            <Text style={styles.dailyTally}>Total records: {instances.length}</Text>

            {/* List of Instances */}
            {instances.map((instance) => (
              <View key={instance.key} style={styles.row}>
                {/* Note Button */}
                <NoteButton
                  note={instance.note}
                  onSave={(note) => {
                    // Update the instance with the new note
                    setInstances((prevInstances) =>
                      prevInstances.map((i) =>
                        i.key === instance.key ? { ...i, note } : i
                      )
                    );
                  }}
                />

                {/* Timestamp */}
                <Text style={styles.timestamp}>
                  {instance.timestamp.toLocaleString('en-US', {
                    weekday: 'long', // Saturday
                    month: 'short',  // Dec
                    day: '2-digit',  // 12
                    hour: '2-digit', // 9
                    minute: '2-digit', // 16
                    second: '2-digit', // 55
                    hour12: true, // PM
                  })}
                </Text>

                {/* Delete Button */}
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

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpVisible}
        onRequestClose={() => setHelpVisible(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.title}>About TallyWise</Text>
            <Text style={modalStyles.text}>
              TallyWise is a simple app for tracking occurrences.
            </Text>
            <Text style={modalStyles.text}>
              Use the dropdown to group instances by day, hour, etc.
            </Text>
            <Text style={modalStyles.text}>
              Long-press the trash icon to delete an instance.
            </Text>
            <Pressable style={modalStyles.closeButton} onPress={() => setHelpVisible(false)}>
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
