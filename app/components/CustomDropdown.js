import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const CustomDropdown = ({ selectedValue, onValueChange, data, placeholder }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selectedValue);

    const handleSelect = (item) => {
        setSelectedItem(item);
        onValueChange(item);
        setModalVisible(false);
    };
 
    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
                <Text style={styles.dropdownText}>{selectedItem ? selectedItem : placeholder}</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 10,
    },
    dropdown: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default CustomDropdown;
