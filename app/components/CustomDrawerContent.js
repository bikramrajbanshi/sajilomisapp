import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, CommonActions  } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import APIKit from '../shared/APIKit';
import LinearGradient from 'react-native-linear-gradient';

const CustomDrawerContent = (props) => {
  const { userInfo, logout } = useContext(AuthContext);
  const userId = userInfo.userId;
  const [userDetails, setUserDetails] = useState(null);

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
      //
    }
    // console.log('user detail', userDetails);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
       <LinearGradient colors={['rgba(5,4,74,1)', 'rgba(5,4,74,0.5)']} style={styles.profileContainer}>
        <Image 
            source={{
              uri: userDetails?.userProfileImage
                  ? `data:image/png;base64,${userDetails.userProfileImage}`
                  : 'https://e7.pngegg.com/pngimages/123/735/png-clipart-human-icon-illustration-computer-icons-physician-login-medicine-user-avatar-miscellaneous-logo.png',
            }}
            style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userDetails ? userDetails.firstName + ' ' + userDetails.lastName + '(' + userId+ ')': ''}</Text>
        <Text style={styles.profileEmail}>{userDetails?.designation || ''}</Text>
     </LinearGradient>
      <View>
        <DrawerItem
          label="Home"
          icon={() => <Ionicons name="home-outline" size={24} color="black" />}
          onPress={() => props.navigation.navigate('Home1')}
        />
        <DrawerItem
          label="Profile"
          icon={() => <Ionicons name="apps-outline" size={24} color="black" />}
          onPress={() => props.navigation.navigate('UserDetail', {userId: userId})}
        />
        <DrawerItem
         label={() => (
                <Text style={{ color: 'red' }}>Logout</Text>
            )}
          icon={() => <Ionicons name="log-out-outline" size={24} color="red" />}
          onPress={() => {
            logout();
            props.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    })
  );
          }}
        />
        {/* Add more drawer items as needed */}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f6f6f6',
    marginTop:-4,

  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,

  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white',
  },
  profileEmail: {
    fontSize: 14,
    color: 'white',
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
});

export default CustomDrawerContent;
