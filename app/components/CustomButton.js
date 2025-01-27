import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const CustomButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
      borderWidth: 1,
      borderColor: '#fff',
      padding: 5,
      borderRadius: 10,

      marginRight: 10,
      width:60,
      alignItems:"center",
      // Adjust margin as needed for spacing
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  });

export default CustomButton;