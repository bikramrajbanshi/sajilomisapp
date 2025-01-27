import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const CustomSwitch = ({
    selectionMode,
    options,
    onSelectSwitch
}) => {
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);

    const updateSwitchData = (value) => {
        setSelectionMode(value);
        onSelectSwitch(value);
    };

  return (
    <View style={styles.container}>
        {options.map((option, index) => (
            <TouchableOpacity
                key={index} 
                style={[styles.tab, getSelectionMode == option && styles.tabSelected]}
                activeOpacity={1}
                onPress={() => updateSwitchData(option)}
                >
                <Text 
                    style={[styles.tabText, getSelectionMode == option && styles.tabTextSelected]}
                >
                    { option }
                </Text>
          </TouchableOpacity>
        ))}
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
        // backgroundColor: 'white',
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
    },
    tabText: {
        color: 'black',
        fontSize: 16,
    },
    tabSelected: {
        backgroundColor: '#FFFFFF', // White background for selected tab
        borderWidth: 1,
        borderColor: '#007AFF', // Blue border for selected tab
    },
    tabTextSelected: {
        fontWeight: 'bold', // Bold text for selected tab
        color: '#0096FF'
    },
})

export default CustomSwitch;