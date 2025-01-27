import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Loader = ({ size = "large", color = "#0000ff", text = "Loading...", overlay = true }) => (
  <View style={[styles.container, overlay && styles.overlay]}>
    <ActivityIndicator size={size} color={color} />
    <Text>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
});

export default Loader;
