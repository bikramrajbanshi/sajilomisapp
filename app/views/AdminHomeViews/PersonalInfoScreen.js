import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APIKit from '../../shared/APIKit';
import CustomSwitch from '../../components/CustomSwitch';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const PersonalInfoScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Personal Information');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await APIKit.get(`/account/GetUser/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setIsLoading(false);
    }
    // console.log('user detail', userDetails);
  };

  const handleTabChange = (value) => {
    setSelectedTab(value);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
return (
<View>
<View style={styles.container}>
</View>
 <View style={styles.infoContainer}>
            <Text style={styles.tabText}>General Info</Text>
              <View style={styles.testrow}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>
                    {userDetails?.firstName} {userDetails?.lastName}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.value}>
                   {userDetails?.contactNo}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>
                     {userDetails?.email}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <Text style={styles.value}>
                    {userDetails?.dateOfBirth}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Gender</Text>
                  <Text style={styles.value}>
                     {userDetails?.gender}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Marital Status</Text>
                  <Text style={styles.value}>
                    {userDetails?.maritalStatus || 'N/A'}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Blood Group</Text>
                  <Text style={styles.value}>
                   {userDetails?.bloodGroup || 'N/A'}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.value}>
                    {userDetails?.permanentAddress || 'N/A'}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Emergency Contact</Text>
                  <Text style={styles.value}>
                     {userDetails?.emergencyContact || 'N/A'}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Citizenship No.</Text>
                  <Text style={styles.value}>
                     {userDetails?.citizenshipNumber || 'N/A'}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Citizenship Issued Date</Text>
                  <Text style={styles.value}>
                     {userDetails?.citizenshipIssuedDate || 'N/A'}
                  </Text>
                </View>


 </View>
 </View>
);
};
const styles = StyleSheet.create({
container:{
backgroundColor:"#05044a",
height:"30%",
},
 infoContainer:{
    backgroundColor:"white",
    marginHorizontal:30,
    borderWidth:1,
    borderColor:"white",
    marginTop:"-30%",
    elevation:5,
    paddingHorizontal:5,
    paddingVertical:10,
    borderRadius:10,
  },
  tabText:{
  fontWeight:"bold",
  fontSize:18,
  paddingVertical: 5,
  paddingHorizontal: 12,
  },

  evenRow: {

  },
   testrow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 15,
      fontSize: 16,
    },
    label: {
      fontSize: 14,
      color:"rgba(0,0,0,0.6)",
    },
    value: {
      fontSize: 14,
      justifyContent: 'flex-end',
    },

});
export default PersonalInfoScreen;
