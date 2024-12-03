import React, { useRef } from 'react';
import { View, StyleSheet, TouchableHighlight, Animated, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const DeleteButton = ({
    instanceKey,
    onDelete,
}: {
    instanceKey: string;
    onDelete: (key: string) => void;
}) => {
    const progress = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000, // Duration of the long press
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(progress).stop();
        progress.setValue(0);
    };

    const handleLongPress = () => {
        Alert.alert(
            'Delete Instance',
            'Are you sure you want to delete this instance?',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => progress.setValue(0) },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(instanceKey) },
            ],
            { cancelable: true }
        );
    };

    return (
        <TouchableHighlight
            underlayColor="#d3d3d3"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onLongPress={handleLongPress}
            style={styles.deleteButton}
        >
            <View style={styles.container}>
                {/* Progress Bar above the icon */}
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
                {/* Trash Icon */}
                <FontAwesome name="trash" size={24} color="#ff0000" style={styles.icon} />
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    deleteButton: {
        padding: 10,
        borderRadius: 5,
    },
    progressBar: {
        height: 5, // Adjust as needed
        backgroundColor: '#ff0000',
        position: 'absolute',
        top: -10, // Position the progress bar above the icon
        left: 0,
    },
    icon: {
        marginTop: 10, // Add spacing between the icon and the progress bar
    },
});

export default DeleteButton;
