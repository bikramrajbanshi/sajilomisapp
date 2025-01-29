import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput, TouchableHighlight,Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState,useContext, useEffect,useRef} from "react";
import { AuthContext } from "../context/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import APIKit, {loadToken} from "../shared/APIKit";
import LinearGradient from 'react-native-linear-gradient';
import {fetchUserDetails} from '../utils/apiUtils';

const ServicesScreen = ({ navigation }) => {
   const { logout, userInfo } = useContext(AuthContext);
    const userId = userInfo.userId;
   const [userDetails, setUserDetails] = useState(null);
  const titles = [
    "Attendance",
    "Duty Roster",
    "Leave",
    "Office Visit",
    "Late / Early",
    "Payslip",
    "Overtime",
    "Shift Change",
    "Advance Payment"
  ];

  useEffect(() => {
        loadUserDetails(); 
    }, []);
  const loadUserDetails = async () => {
        try {
          const data = await fetchUserDetails(userInfo.userId);
          setUserDetails(data);
        } catch (error) {
          console.error('Error fetching User:', error);
        }
      };

  const animations = useRef(titles.map(() => new Animated.Value(0))).current;

  useEffect(() => {
     const unsubscribe = navigation.addListener('focus', () => {
          loadToken();

          // Reset animation values to 0
          animations.forEach(animation => animation.setValue(0));

          // Staggered animation
          Animated.stagger(100, animations.map((animation) =>
            Animated.timing(animation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            })
          )).start();
        });
    return unsubscribe;
  }, [navigation, animations]);

  const renderIcon = (title) => {
    switch (title) {
      case "Attendance":
        return <FontAwesome5 name="user-check" size={24} color="green" />;
      case "Duty Roster":
        return <FontAwesome5 name="address-book" size={24} color="brown" />;
      case "Leave":
        return <FontAwesome5 name="user-lock" size={24} color="red" />;
      case "Office Visit":
        return <Ionicons name="briefcase" size={24} color="purple" />;
      case "Late / Early":
        return <MaterialCommunityIcons name="clock-alert" size={24} color="orange" />;
      case "Payslip":
        return <FontAwesome5 name="file-invoice-dollar" size={24} color="green" />;
      case "Overtime":
        return <FontAwesome5 name="user-clock" size={24} color="grey" />;
      case "Shift Change":
          return <MaterialCommunityIcons name="transit-transfer" size={24} color="rgba(44,75,156,1)" />;
       case "Advance Payment":
          return <MaterialCommunityIcons name="wallet" size={24} color="rgba(44,75,156,1)" />;
      default:
        return null;
    }
  };

  const handleMenuTitle = (title) => {
    const titleToScreenName = {
      "Attendance": "PersonalAttendanceScreen",
      "Duty Roster": "DutyRosterScreen",
      "Leave": "LeaveScreen",
      "Office Visit": "OfficeVisitScreen",
      "Late / Early": "LateInEarlyOutScreen",
      "Payslip": "PayslipScreen",
      "Overtime": "OvertimeScreen",
      "Shift Change": "ShiftChangeScreen",
      "Advance Payment": "AdvancePaymentScreen"

    };

    const screenName = titleToScreenName[title];
    console.log("service bata", screenName);

    if (screenName == "PersonalAttendanceScreen") {
      navigation.navigate("PersonalAttendance");
    } else if (screenName == "DutyRosterScreen") {
      navigation.navigate("DutyRoster");
    } else if (screenName == "LateInEarlyOutScreen") {
      navigation.navigate("LateInEarlyOut");
    }  else if (screenName == "LeaveScreen") {
      navigation.navigate("LeaveList");
    } else if (screenName == "OfficeVisitScreen") {
      navigation.navigate("OfficeVisit");
    }else if (screenName == "PayslipScreen") {
        navigation.navigate("PayslipDetailsScreen");
    }else if (screenName == "OvertimeScreen") {
        navigation.navigate("OvertimeScreen");
     }else if (screenName == "ShiftChangeScreen") {
      navigation.navigate("ShiftChange");
      }else if (screenName == "AdvancePaymentScreen") {
      navigation.navigate("Advance");
    }

    else {
      console.warn("No screen name found for title: ${title}");
    }
  };
 
  return (
     <LinearGradient colors={['rgba(44,78,156,1)', 'rgba(44,75,156,0.1)']} style={styles.container}>
      <View style={styles.header}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image 
            source={{
              uri: userDetails?.userProfileImage
                  ? `data:image/png;base64,${userDetails.userProfileImage}`
                  : 'https://e7.pngegg.com/pngimages/123/735/png-clipart-human-icon-illustration-computer-icons-physician-login-medicine-user-avatar-miscellaneous-logo.png',
            }}
            style={styles.profileImage}
        /> 
        </TouchableOpacity>
          <Text style={styles.username}>{userInfo ? userInfo.firstName + ' ' + userInfo.lastName : ''}</Text>
        </View>
        {/*<View style={styles.icons}>*/}
        {/*  <Ionicons name="search" size={24} color="black" style={styles.icon} />*/}
        {/*  <Ionicons*/}
        {/*    name="notifications"*/}
        {/*    size={24}*/}
        {/*    color="black"*/}
        {/*    style={styles.icon}*/}
        {/*  />*/}
        {/*</View>*/}
      </View>

      {/* Search Component */}
      {/*<View style={styles.search}>*/}
      {/*  <Feather*/}
      {/*    name="search"*/}
      {/*    size={20}*/}
      {/*    color="#C6C6C6"*/}
      {/*    style={{ marginRight: 5 }}*/}
      {/*  />*/}
      {/*  <TextInput placeholder="Search" />*/}
      {/*</View>*/}
        <Text style={styles.serviceHeader}>Services</Text>
      <View style={styles.menuContainer}>
        {titles.map((title, index) => (
         <TouchableOpacity
            key={index}
            style={[
              styles.menus,
              {
                opacity: animations[index],
                transform: [{
                  translateY: animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0], // Start from 50px below and move to original position
                  }),
                }],
              }
            ]}
            onPress={() => handleMenuTitle(title)}
          >        
            {/* <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => handleMenuTitle(title)}

            > */}
              <View style={styles.iconContainer}>
                {renderIcon(title)}
                <Text style={styles.menu}>{title}</Text>
              </View>
            

            {/* </TouchableOpacity> */}
         </TouchableOpacity>
        ))}
      </View>


   </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    //paddingTop: StatusBar.currentHeight,
    backgroundColor: "rgba(0,0,255,0.05)",
  },
  smallText: {
    color: "black",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    flexDirection: "row",
  },

  icon: {
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
    paddingHorizontal:10,
    color:"white",

  },
  serviceHeader:{
  fontWeight:'bold',
  fontSize:22,
  color:'white',
   marginVertical:"5%",
  },
  iconContainer:{
    width: '100%',
    flex: 1,
    alignItems:"center",
    justifyContent: "center",
  },
  search: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#C6C6C6",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal:10,
    marginTop:"5%",
    backgroundColor:"#f0f0f0",

  },
  menuContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    gap:10,
  },
  menus: {
   height:100,
   width: "31%",
   backgroundColor: "rgba(255,255,255,0.8)",
   borderRadius: 15,
   padding: 15,
   marginBottom: 10,
   flexDirection: "column",
   alignItems:"center",
   justifyContent:"center",
  },
  menuText: {
    fontSize: 16,  
    fontWeight: "bold",  
    textAlign: "center", 
    color: "black",
    marginTop: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,

  },
});

export default ServicesScreen;
