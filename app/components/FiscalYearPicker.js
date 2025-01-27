import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';

const FiscalYearPicker = ({ fiscalYears, selectedYear, onSelectYear }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelectYear = (year) => {
        onSelectYear(year);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchable}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.touchableText}>
                    {selectedYear ? `Fiscal Year: ${selectedYear.name}` : 'Select Fiscal Year'}
                </Text>
            </TouchableOpacity>

            {/* Modal for Fiscal Year List */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Select Fiscal Year</Text>
                            <FlatList
                                data={fiscalYears}
                                keyExtractor={(item) => item.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.fiscalYearItem}
                                        onPress={() => handleSelectYear(9)}
                                    >
                                        <Text style={styles.fiscalYearText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    touchable: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 8,
    },
    touchableText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fiscalYearItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    fiscalYearText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default FiscalYearPicker;
