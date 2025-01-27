import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker';

const UserPicker = ({ selectedUser, onValueChange, users }) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker 
        selectedValue={selectedUser}
        onValueChange={onValueChange}
      >
        <Picker.Item label="Select a user" value={null} />
        {users.map((user) => (
            <Picker.Item key={user.id} label={user.name} value={user.id} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
    pickerContainer: {
        padding: 10,
    
    },
});

export default UserPicker;