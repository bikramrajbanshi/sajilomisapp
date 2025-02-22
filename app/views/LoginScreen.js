import Checkbox from "expo-checkbox";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, Animated,
  Alert
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import APIKit from "../shared/APIKit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const domainSuffix = ".sajilomis.com";
  const [domain, setDomain] = useState("");
  const [clientDetail, setClientDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientNo, setClientNo] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [domainBorderColor, setDomainBorderColor] = useState('#ccc');
  const [emailBorderColor, setEmailBorderColor] = useState('#ccc');
  const [passwordBorderColor, setPasswordBorderColor] = useState('#ccc');

  const { login } = useContext(AuthContext);

  const getErrorMessageByField = (field) => {
    if (errors[field]) {
      return (
        <View style={styles.errorMessageContainerStyle}>
        {errors[field].map((item, index) => (
          <Text style={styles.errorMessageTextStyle} key={index}>
          {item}
          </Text>
        ))}
        </View>
        );
      }
      return null;
    };

    const getNonFieldErrorMessage = () => {
      if (errors.non_field_errors) {
        return (
          <View style={styles.errorMessageContainerStyle}>
          {errors.non_field_errors.map((item, index) => (
            <Text style={styles.errorMessageTextStyle} key={index}>
            {item}
            </Text>
          ))}
          </View>
          );
        }
        return null;
      };

      const handleDomainChange = async(text) => {
        if(!text.includes(domainSuffix)) {
          await AsyncStorage.setItem('newDomain', text);
          setDomain(text);
        }
        if(text == "" || text == null)
        {
          setDomainBorderColor('red');
          setDomain(text);
        }
        else
        {
          setDomainBorderColor('#ffffff');
        }
      };

      useEffect(() => {
        const getDomain = async () => {
          try {
            const savedNewDomain = await AsyncStorage.getItem('newDomain');
            if(savedNewDomain){
              setDomain(savedNewDomain);
            }
          } catch (error) {
            console.error('Failed to load domain:', error);
          }
        };
        getDomain();

        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            fetchClientDetail();
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'No internet connection'
            });
          }
        });

        const getUsername = async () => {
          try {
            const savedUsername = await AsyncStorage.getItem('userName');
            if (savedUsername) {
              setUsername(savedUsername);
            }
          } catch (error) {
            console.error('Failed to load username:', error);
          }
        };
        getUsername();
      }, []);

      const fetchClientDetail = async () => {
        if (domain) {

          const clientDomain = domain + domainSuffix;
          setLoading(true);
          try {
            const response = await APIKit.get('/Account/GetClientDetail', {
              headers: {
                Domain: clientDomain,
              },
            });
            if(response.status == 200 ){
              setClientDetail(response);
              await AsyncStorage.setItem("clientDetail", JSON.stringify(response.data));
              return response.data.clientId;

              setClientNo(response.data.clientId);
            } else {
              return -1;
            }
          } catch (error) {

            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Error fetching client details'
            });
          } finally {
            setLoading(false);
          }
        }
        else{
          return -1;
        }
      };

      const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
      };

      const handleEmailChange = (text) => {

        if(text == "" || text == null)
        {
          setEmailBorderColor('red');
          setUsername(text);
        }
        else
        {
          setEmailBorderColor('#ffffff');
          setUsername(text);
        }
      };

      const handlePasswordChange = (text) => {

        if(text == "" || text == null)
        {
          setPasswordBorderColor('red');
          setPassword(text);
        }
        else
        {
          setPasswordBorderColor('#ffffff');
          setPassword(text);
        }
      };

      const handleLogin = async(text) => {

        let clientId = await fetchClientDetail();
        
        if(clientId == -1 && (username == "" || username == null) && (password == "" || password == null))
        {
          setDomainBorderColor('red');
          setEmailBorderColor('red');
          setPasswordBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Domain Name Incorrect',
            text2Style: {color: 'black'}
          });
          return;
        }
        if(clientId == -1 && (username == "" || username == null) )
        {
          setDomainBorderColor('red');
          setEmailBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Domain Name Incorrect',
            text2Style: {color: 'black'}
          });
          return;
        }
        if((username == "" || username == null) && (password == "" || password == null))
        {
          setEmailBorderColor('red');
          setPasswordBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Please fillup all details',
            text2Style: {color: '#666666'}
          });
          return;
        }
        if(clientId == -1 && (password == "" || password == null))
        {
          setDomainBorderColor('red');
          setPasswordBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Domain Name Incorrect',
            text2Style: {color: 'black', fontSize:13}
          });
          return;
        }
        console.log(clientId);
        if(clientId == -1)
        {
          setDomainBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Domain Name Incorrect',
            text2Style: {color: 'black', fontSize: 13}
          });
          return;
        }
        if(username == "" || username == null)
        {
          setEmailBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Please Enter Email Address',
            text2Style: {color:'black', fontSize : 13},
          });
          return;
        }
        if(password == "" || password == null)
        {
          setPasswordBorderColor('red');
          Toast.show({
            type: 'error',
            text2: 'Please Enter Password',
            text2Style: {color: 'black', fontSize:13}
          });
          return;
        }

        
        setIsLoading(true);
        await login(username, password, isChecked, clientId);
        setIsLoading(false);
      };

      return (
        <KeyboardAvoidingView
        style={[styles.container, { flex: 1 }]}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
        enabled
        >
        <View style={styles.innerContainer}>
        <Image
        //source={{ uri: 'https://kranitainfotech.com/wp-content/uploads/2024/06/sajilomis.png' }}
        source={require('../../assets/logo.png')} 
        style={styles.logoImage}
        />



        <View style={styles.inputContainer}>
        <Text style={styles.labels}>Domain</Text>
        <View style={[styles.domain, { borderColor : domainBorderColor}]}>
        <TextInput
        style={styles.input}
        onChangeText={handleDomainChange}
        value={domain}
        editable={!loading}
        autoCapitalize="none"
        placeholder="Enter your domain"
        placeholderTextColor="#666666"
        />
        <Text style={styles.suffix}>{domainSuffix}</Text>
        </View>
        {}
        </View>

        <View style={styles.inputContainer}>
        <Text style={styles.labels}>Email</Text>
        <TextInput
        style={[styles.inputs, { borderColor : emailBorderColor}]}
        value={username}
        onChangeText={handleEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
        placeholder="Email Address"
        placeholderTextColor="#666666" 
        />
        {getErrorMessageByField("username")}
        </View>

        <View style={styles.inputContainer}>
        <Text style={styles.labels}>Password</Text>
        <View style={[styles.inputPassword , { borderColor : passwordBorderColor}]}>
        <TextInput
        style={[styles.inputPasswords, { flex: 1 }]}
        onChangeText={handlePasswordChange}
        value={password}
        autoCapitalize="none"
        secureTextEntry={!isPasswordVisible}
        editable={!loading}
        placeholder="Password"
        placeholderTextColor="#666666"
        />
        <TouchableOpacity onPress={togglePasswordVisibility} >
        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={28} color="black"/>
        </TouchableOpacity>
        </View>
        </View>
        <TouchableOpacity
        onPress={handleLogin}
        style={styles.buttonContain}
        >
        {isLoading ? (
          <ActivityIndicator size="medium" color="#fff" />
          ) : (
          <Text style={styles.buttonText}>Login</Text>
          )}
          </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
          );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "rgba(0,0,255,0.1)",
        justifyContent: "center",
      },

  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoImage: {
    width: "100%",
    height: "15%",
    resizeMode: 'contain',
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000080",
  },
  inputContainer: {
    marginBottom: 10,
  },
  passwordIcon: {
    height: 48,
    width: 48,
  },
  inputPassword: {
    marginBottom: 10,
    flexDirection: 'row', 
    height: 48,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderColor: "#d0d0d0",
    borderWidth: 1,
    color: "#333333",
  },
  labels: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000080",
  },
  domain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#ffffff",
    height: 48,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 0,
    borderColor: "#d0d0d0",
    borderWidth: 1,
  },
  input: {
    width: "65%",
    fontSize: 16,
    padding: 10,
    color: "#333333",
    textAlign:"right",
  },
  suffix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#000080",
  },
  inputs: {
    height: 48,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderColor: "#d0d0d0",
    borderWidth: 1,
    color: "#333333",
  },
  inputPasswords: {
    fontSize: 16,
  },
  buttonContain: {
    alignItems: "center",
    backgroundColor: "#000080",
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    height:55
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333333",
  },
  errorMessageContainerStyle: {
    marginTop: 5,
    backgroundColor: "#fee8e6",
    padding: 10,
    borderRadius: 4,
    borderColor: "#db2828",
    borderWidth: 1,
  },
  errorMessageTextStyle: {
    color: "#db2828",
    textAlign: "center",
    fontSize: 14,
  },
});

    export default LoginScreen;
