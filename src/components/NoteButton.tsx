import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/NoteButtonStyles';

type NoteButtonProps = {
    note: string | undefined;
    onSave: (note: string) => void;
};

const NoteButton: React.FC<NoteButtonProps> = ({ note, onSave }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState(note || '');

    const handleSave = () => {
        onSave(currentNote);
        setModalVisible(false);
    };

    return (
        <View>
            {/* Note Icon */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.noteButton}>
                <FontAwesome
                    name="pencil" // Use 'pencil' icon
                    size={24}
                    color={note ? '#00cc00' : '#cccccc'} // Green if note exists, gray otherwise
                />
            </TouchableOpacity>


            {/* Modal for Editing Note */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add/Edit Note</Text>
                        <TextInput
                            style={styles.textInput}
                            value={currentNote}
                            onChangeText={setCurrentNote}
                            placeholder="Enter your note here..."
                            multiline
                        />
                        <Pressable style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default NoteButton;
