import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const MonthYearPicker = ({ onDateChange }) => {
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const showPicker = () => setShow(true);
    const hidePicker = () => setShow(false);

    const onValueChange = (event, newDate) => {
        hidePicker();
        const currentDate = newDate || selectedDate;
        setSelectedDate(currentDate);
        onDateChange(currentDate);
    };

    return (
        <View style={styles.container}>
            <Button onPress={showPicker} title="Select Month and Year" />
            {show && (
                <MonthPicker
                    onChange={onValueChange}
                    value={selectedDate}
                    minimumDate={new Date(1900, 0)}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        alignItems: 'center',
    },
});

export default MonthYearPicker;
