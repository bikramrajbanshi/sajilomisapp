import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Checkbox from "expo-checkbox";

const PickerWithCheckbox = ({ options, selectedOptions, onValueChange, label }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValues, setSelectedValues] = useState(selectedOptions || []);

    const handleSelect = (item) => {
        const isSelected = selectedValues.includes(item.value);
        if (isSelected) {
            setSelectedValues(selectedValues.filter((val) => val !== item.value));
        } else {
            setSelectedValues([...selectedValues, item.value]);
        }
    };

    const handleConfirm = () => {
        setModalVisible(false);
        onValueChange(selectedValues);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.picker}
                onPress={() => setModalVisible(true)}
            >
                <Text>{selectedValues.length > 0 ? selectedValues.join(', ') : label}</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Checkbox
                                        value={selectedValues.includes(item.value)}
                                        onValueChange={() => handleSelect(item)}
                                    />
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    picker: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PickerWithCheckbox;
