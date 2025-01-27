import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState,useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APIKit from '../../shared/APIKit';
import { AuthContext } from "../../context/AuthContext";
import CustomSwitch from '../../components/CustomSwitch';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


const UserDetailScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Personal Information');
  const { logout, userInfo } = useContext(AuthContext);
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
    <View style={styles.container}>
      <LinearGradient colors={['rgba(5,4,74,1)', 'rgba(5,4,74,0.5)']} style={styles.profileContainer}>
        <Image
            source={{
              uri: userDetails?.userProfileImage
                  ? `data:image/png;base64,${userDetails.userProfileImage}`
                  : 'https://via.placeholder.com/150',
            }}
            style={styles.profileImage}
        />
        <Text style={styles.name}>{userDetails?.firstName || 'Unknown'} {userDetails?.lastName || ''}</Text>
        <Text style={styles.position}>{userDetails?.designation || ''}</Text>
      </LinearGradient>
       <View style={styles.cardsContainer}>
                <TouchableOpacity key="1" style={styles.card} onPress={() => navigation.navigate("PersonalInfo", {userId: userId})}>
                  <FontAwesome5 name="user-check" size={15}  />
                  <Text style={[styles.cardTitle , {marginLeft:18}]}>Personal Information</Text>
                  <FontAwesome5 name="angle-right" size={15}  />
                </TouchableOpacity>
                <TouchableOpacity key="2" style={styles.card} onPress={() => navigation.navigate("WorkInfo", {userId: userId})}>
                  <FontAwesome5 name="briefcase" size={15} />
                  <Text style={[styles.cardTitle , {marginLeft:22}]}>Work Information</Text>
                  <FontAwesome5 name="angle-right" size={15}  />
                </TouchableOpacity>
                {/*<TouchableOpacity key="3" style={styles.card} onPress={() => navigation.navigate(`AdminLeaveList`)}>*/}
                {/*     <FontAwesome5 name="lock" size={15} />*/}
                {/*     <Text style={[styles.cardTitle , {marginLeft:24}]}>Change Password</Text>*/}
                {/*     <FontAwesome5 name="angle-right" style={styles.angle} size={15}  />*/}
                {/*</TouchableOpacity>*/}

       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#6495ED',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardsContainer:{
    backgroundColor:"white",
    marginHorizontal:30,
    borderWidth:1,
    borderColor:"white",
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:15,
    marginVertical:20,
    elevation:5,
  },

  card:{
    display:'flex',
    flexDirection:'row',
    paddingVertical:15,
  },
  cardTitle:{
    fontSize:16,
    flex:1,
  },
  angle:{
  justifyContent:'flex-end',
  flexDirection:'row',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  position: {
    fontSize: 16,
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  infoContainer: {
    width: '100%', // Ensure the container takes the full width
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    // textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logout: {
  color:"red",
  marginLeft:20,
  fontSize:16,
  },
});

export default UserDetailScreen;