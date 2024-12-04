import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the icon

type DropdownOption = {
    label: string;
    value: string;
};

type CustomDropdownProps = {
    options: DropdownOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    selectedValue,
    onValueChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionSelect = (value: string) => {
        setIsOpen(false);
        onValueChange(value);
    };

    return (
        <View style={styles.container}>
            {/* Dropdown Header */}
            <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={styles.dropdownHeaderText}>
                    {options.find((option) => option.value === selectedValue)?.label ||
                        'Select an Option'}
                </Text>
                {/* Add the dropdown icon */}
                <FontAwesome
                    name={isOpen ? 'chevron-up' : 'chevron-down'} // Change icon based on dropdown state
                    size={16}
                    color="#333"
                    style={styles.icon}
                />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {isOpen && (
                <View style={styles.dropdownOptions}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => handleOptionSelect(item.value)}
                            >
                                <Text style={styles.optionText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '80%',
        marginBottom: 20,
    },
    dropdownHeader: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        flexDirection: 'row', // Align text and icon in a row
        justifyContent: 'space-between', // Space between text and icon
        alignItems: 'center', // Center vertically
    },
    dropdownHeaderText: {
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginLeft: 10, // Space between text and icon
    },
    dropdownOptions: {
        backgroundColor: '#fff',
        marginTop: 5,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        maxHeight: 150, // Limit height to show a few options
        overflow: 'hidden',
    },
    option: {
        padding: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default CustomDropdown;
