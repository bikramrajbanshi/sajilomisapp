import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APIKit from '../../shared/APIKit';
import CustomSwitch from '../../components/CustomSwitch';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const WorkInfoScreen = ({ navigation, route }) => {
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
   <ScrollView contentContainerStyle={styles.scrollView}>
<View>
    <View style={styles.container}>
    </View>
    <View style={styles.infoContainer}>
            <Text style={styles.tabText}>Work Details
            </Text>
              <View style={styles.testrow}>
                  <Text style={styles.label}>Branch</Text>
                  <Text style={styles.value}>
                    {userDetails?.branch}
                  </Text>
                </View>

                <View style={styles.testrow}>
                  <Text style={styles.label}>Grade</Text>
                  <Text style={styles.value}>
                     {userDetails?.jobGrade}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Join Date</Text>
                  <Text style={styles.value}>
                    {userDetails?.dateOfJoining}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Permanent Date</Text>
                  <Text style={styles.value}>
                     {userDetails?.permanentDate}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Next Contract Date</Text>
                  <Text style={styles.value}>
                    {userDetails?.nextContractDate}
                  </Text>
                </View>

                <View style={styles.testrow}>
                  <Text style={styles.label}>Attendance Shift</Text>
                  <Text style={styles.value}>
                    {userDetails?.attendanceShift}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Supervisor</Text>
                  <Text style={styles.value}>
                     {userDetails?.supervisor}
                  </Text>
                </View>
                <View style={styles.testrow}>
                  <Text style={styles.label}>Department</Text>
                  <Text style={styles.value}>
                     {userDetails?.department}
                  </Text>
                </View>

                <View style={styles.testrow}>
                  <Text style={styles.label}>Designation</Text>
                  <Text style={styles.value}>
                    {userDetails?.designation}
                  </Text>
                </View>


                <View style={styles.testrow}>
                  <Text style={styles.label}>Working Status</Text>
                  <Text style={styles.value}>
                    {userDetails?.status}
                  </Text>
                </View>
    </View>

    <View style={styles.bankinfoContainer}>
     <Text style={styles.tabText}>Bank Details
                </Text>
                    <View style={styles.testrow}>
                      <Text style={styles.label}>Bank Name</Text>
                      <Text style={styles.value}>
                        {userDetails?.bankName}
                      </Text>
                    </View>
                        <View style={styles.testrow}>
                                          <Text style={styles.label}>Bank Acc No.</Text>
                                          <Text style={styles.value}>
                                            {userDetails?.bankAccountNumber}
                                          </Text>
                                        </View>
                    <View style={styles.testrow}>
                      <Text style={styles.label}>Pan No.</Text>
                      <Text style={styles.value}>
                        {userDetails?.panNumber}
                      </Text>
                    </View>



    </View>

 </View>
 </ScrollView>
);
};
const styles = StyleSheet.create({
container:{
backgroundColor:"#05044a",
height:"30%",
},
 infoContainer:{
    backgroundColor:"white",
    marginHorizontal:20,
    borderWidth:1,
    borderColor:"white",
    marginTop:"-35%",
    paddingHorizontal:5,
    paddingVertical:10,
    borderRadius:10,
    elevation:5,
  },
   scrollView: {
          flexGrow: 1,
      },
  bankinfoContainer :{
    backgroundColor:"white",
    marginHorizontal:20,
    borderWidth:1,
    borderColor:"white",
    paddingHorizontal:5,
    paddingVertical:10,
    borderRadius:10,
    marginVertical:20,
    elevation:5,
  },
  tabText:{
    fontWeight:"bold",
    fontSize:18,
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
  testrow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 20,

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
export default WorkInfoScreen;
