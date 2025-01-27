import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity, Animated, StatusBar } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome to Sajilo MIS !...";
  const [logoOpacity, setLogoOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    let index = 0;
    const typeWriter = () => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        index = 0;
        setTimeout(typeWriter, 2000); // Pause before restarting the animation
      } else {
        setTimeout(typeWriter, 150); // Adjust the speed of the typewriter effect
      }
    };
    typeWriter();

    // Start the logo animation after a delay
    setTimeout(() => {
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000, // Duration of the popup effect
        useNativeDriver: true,
      }).start();
    }, 500); // Adjust the delay as needed
  }, []);

  const loginUser = () => {
    navigation.navigate('Login');
  };

  const logoSource = require('../../assets/logo.png');
  // console.log("Logo source:", logoSource);

  return (
    <View style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.logoView}>

    <Animated.Image
            //source={{ uri: 'https://kranitainfotech.com/wp-content/uploads/2024/06/sajilomis.png' }}
    source={require('../../assets/logo.png')} 
    style={[styles.logoImage, { marginTop: 50 }]}
    onError={(error) => console.log("Image loading error:", error.nativeEvent.error)}
    />

    </View>

    <View style={styles.welcomeView}>
    <View style={styles.welcome}>
    <Text style={{ fontSize: 25, fontWeight: "bold", color:"#000080" }}>{typedText}</Text>
    </View>

    <View style={styles.buttonContainer}>
    <TouchableOpacity
    style={[styles.buttonContainer, styles.buttonStyle]}
    onPress={loginUser}
    >
    <Text style={styles.buttonText}>Sign In</Text>
    </TouchableOpacity>
    </View>
    </View>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,255,0.1)",
  },
  logoView: {
    height: "50%",
    alignItems: "center",
    padding: 50,
  },
  welcomeView: {
    flex: 1,
    height: "50%",
    backgroundColor: "rgba(0,0,128,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
  },
  welcome: {
    height: "20%",
  },
  logoImage: {
    width: "100%",
    height: "55%",
    resizeMode: 'contain',
    borderWidth: 1,
  },
  buttonContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 45,
  },
  buttonStyle: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
  },
  buttonText: {
    color: "#000080",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default WelcomeScreen;
