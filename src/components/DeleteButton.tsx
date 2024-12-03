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
            <View>
                <FontAwesome name="trash" size={24} color="#ff0000" style={styles.icon} />
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
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    progressBar: {
        height: 5,
        backgroundColor: '#ff0000',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    icon: {
        marginLeft: 15,
    },
});

export default DeleteButton;
