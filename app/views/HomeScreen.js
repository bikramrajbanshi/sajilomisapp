import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    Image,
    PermissionsAndroid, Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import APIKit, {loadToken} from "../shared/APIKit";
import {fetchUserDetails} from '../utils/apiUtils'; 
import {getTodayFullDate, getTodayISOString, getCurrentTime, hasSpecificPermission, isValidLocation} from "../utils";
import Toast from "react-native-toast-message";
import GetLocation from 'react-native-get-location'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import NepaliCalendarPopupEmployeeHomeView from "../components/NepaliCalendarPopupEmployeeHomeView";


const {height: screenHeight} = Dimensions.get("window");

const HomeScreen = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const {logout, userInfo} = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState(null);
    const [location, setLocation] = useState({latitude: "", longitude: ""});
    const [values, setValues] = useState({
        todaysLeaves: 0,
        todaysVisits: 0,
        upcomingHolidays: 0,
        upcomingLateInEarlyOut: 0,
        upcomingVisits: 0,
        upcomingleaves: 0,
    });

    useEffect(() => {
        loadToken();
        loadUserDetails(); 
        //getLocation();
        setTimeout(() => {
            fetchData();
        }, 500);
        setStartDate(getTodayFullDate());
    }, []);
    const loadUserDetails = async () => {
        try {
          const data = await fetchUserDetails(userInfo.userId);
          setUserDetails(data);
      } catch (error) {
          console.error('Error fetching User:', error);
      }
  };
  const fetchData = async () => {
    try {
        const startDate = getTodayFullDate();

        const response = await APIKit.get(
    `/Home/GetCountsUserDashBoard/${startDate}`
    );
        const responseData = response.data;
        const {todaysLeaves, todaysVisits, upcomingleaves, upcomingVisits, upcomingHolidays, upcomingLateInEarlyOut} = responseData;

        setValues(responseData);
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        setIsLoading(false);
    }
};

const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
}, []);

const titles = [
    "Present",
    "On Leave",
    "Shift Not Started",
    "Absent",
    "On Visit",
    "On Weekend",
    "Pending Leaves",
    "Total Users",
];

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Access",
                message: "This app needs to access your location for check-in.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
            );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

const getLocation = async () => {
    console.log("check it");
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
        console.error("Permission denied. Please enable location services.");
        return;
    }
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
    })
    .then(location => {
        const currentLocation = location;
         setLocation({
            latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
      });
    })
    .catch(error => {
        const { code, message } = error;
        console.log(code, message);
    })
};

const getLocationAgain = async () => {
    try {
         const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.error("Permission denied. Please enable location services.");
            return;
        }
        console.log("get location");
        const location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        });
        console.log("default", location);
        return location;
    } catch (error) {
        const { code, message } = error;
        console.log(code, message);
    }
};

const handleCheckIn = async () => {
    if (!hasSpecificPermission(userInfo, "SubmitAttendanceHome")) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'You are not allowed to submit attendance'
        });
        return;
    }

    try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Toast.show({
                type: 'error',
                text1: 'Permission Denied',
                text2: 'Please enable location access'
            });
            return;
        }

        let currentLocation = location;

        if (!hasSpecificPermission(userInfo, "NotRequireLocationData") && !isValidLocation(currentLocation)) {
            try {
                currentLocation = await getLocationAgain();
                console.log(currentLocation);
                setLocation(currentLocation);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to fetch location. Check your device settings.'
                });
                return;
            }
        }

        const currentTime = getTodayISOString();
        const checkInData = {
            inOutTime: currentTime,
            attendanceType: "Present",
            latitude: location.latitude ? location.latitude : currentLocation.latitude ? currentLocation.latitude : 0,
            longitude: location.longitude ? location.longitude : currentLocation.longitude ? currentLocation.longitude : 0
        };

        console.log(checkInData);

        const response = await APIKit.post(
            "AttendanceLog/AddAttendance",
            checkInData
            );

        if (response.data.isSuccess) {
            console.log("Checkin successful", response.data);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `Your check in time is ${getCurrentTime()}`
            });
        } else {
            console.error("Check-in failed: ", response.data);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Check-in failed'
            });
        }
    } catch (e) {
        console.error("Error during check-in: ", e);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Check-in failed',
        });
    }
};

const handlePressWithDelay = () => {
    setTimeout(() => {
        handleCheckIn();
        }, 2000); // 2000 milliseconds = 2 seconds
};

return (
    <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="rgba(44,78,156,1)" />
    <LinearGradient colors={['rgba(44,78,156,1)', 'rgba(44,75,156,0.1)']}>
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
  <Text style={styles.username}>{userInfo ? userInfo.firstName : ''}</Text>
  </View>
  <TouchableHighlight
  onPress={() => {
    logout();
    }}
    >
    <Text style={styles.buttons}>Logout</Text>
    </TouchableHighlight>
    </View>

    <ScrollView
    contentContainerStyle={styles.scrollView}
    refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        />
    }
    >
    <LinearGradient colors={['rgba(120,150,150,1)', 'rgba(120,150,150,0.5)']} style={styles.calenderContainer}>
    <NepaliCalendarPopupEmployeeHomeView  onReFresh={refreshing}/>
    </LinearGradient>
    <View style={styles.cardsContainer}>
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("OnLeaveToday")}>
    <FontAwesome5 name="user-lock" size={20} color="red"/>
    <Text style={styles.cardTitle} onPress={() => navigation.navigate("OnLeaveToday")}>ON LEAVE</Text>
    <Text style={styles.cardValue} onPress={() => navigation.navigate("OnLeaveToday")}>{values.todaysLeaves}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("OnVisitToday")}>
    <FontAwesome5 name="briefcase" size={20} color="purple"/>
    <Text style={styles.cardTitle} onPress={() => navigation.navigate("OnVisitToday")}>ON OFFICE VISIT</Text>
    <Text style={styles.cardValue} onPress={() => navigation.navigate("OnVisitToday")}>{values.todaysVisits}</Text>
    </TouchableOpacity>
    </View>
    <View style={styles.cardsContainer}>
    <Text style={styles.upcoming}>Upcoming Activities</Text>
    <TouchableOpacity
    style={styles.card} onPress={() => navigation.navigate(`UpcomingLeave`, { startDate: startDate })}>
    <FontAwesome5 name="user-lock" size={20} color="red"/>
    <Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingLeave`, { startDate: startDate })}>LEAVES</Text>
    <Text style={styles.cardValue} onPress={() => navigation.navigate(`UpcomingLeave`, { startDate: startDate })}>{values.upcomingleaves}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`UpcomingOfficialVisit`, { startDate: startDate })}>
    <FontAwesome5 name="briefcase" size={20} color="purple"/>
    <Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingOfficialVisit`, { startDate: startDate })}>VISITS</Text>
    <Text style={styles.cardValue} onPress={() => navigation.navigate(`UpcomingOfficialVisit`, { startDate: startDate })}>{values.upcomingVisits}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`UpcomingHolidays`, { startDate: startDate })}>
    <FontAwesome5 name="plane-departure" size={20} color="blue"/>
    <Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingHolidays`, { startDate: startDate })}>HOLIDAYS</Text>
    <Text style={styles.cardValue} onPress={() => navigation.navigate(`UpcomingHolidays`, { startDate: startDate })}>{values.upcomingHolidays}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`UpcomingLateInEarlyOut`, { startDate: startDate })}>
    <FontAwesome5 name="user-clock" size={20} color="red"/>
    <Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingLateInEarlyOut`, { startDate: startDate })}>LATE IN</Text>
    <Text style={styles.cardValue} onPress={() => navigation.navigate(`UpcomingLateInEarlyOut`, { startDate: startDate })}>{values.upcomingLateInEarlyOut}</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.checkInContainer}>
    <TouchableHighlight
    onPress={() => {
        handlePressWithDelay();
    }}
    style={styles.checkInButton}
    >
    <Text style={styles.checkInText}>CHECK IN</Text>
    </TouchableHighlight>
    </View>
    </ScrollView>
    </LinearGradient>
    </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,255,0.05)",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 40,

    },
    calenderContainer: {
        height: 50,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
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
        marginLeft: 10,
    },
    innerContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        height: "50%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
    },

    upcoming: {
        width: "100%",
        textAlign: "left",
        fontSize: 16,
        marginBottom: 20,
        fontWeight: "bold",

    },
    item: {
        fontSize: 15,
        color: "white",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    itemContainer: {
        flexDirection: "column",
        width: 100,
        height: 100,
        backgroundColor: "blue",
        textAlignVertical: "center",
        textAlign: "center",
        margin: 5,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    updateContainer: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 20,

        marginVertical: "5%",
    },
    updateText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    updateDescription: {
        fontSize: 14,
        marginTop: 10,
    },
    cardsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: "48%",
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: "bold",
    },
    checkInContainer: {
        alignItems: "center",
        marginTop: 45,

    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    time: {
        fontSize: 48,
        fontWeight: "bold",
        marginHorizontal: 5,
    },
    timeLabel: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    checkInButton: {
        marginTop: 0,
        backgroundColor: "#000080",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 50,
    },
    checkInText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    buttons: {
        fontSize: 12,
        backgroundColor: "#000080",
        width: 80,
        height: 30,
        textAlign: "center",
        borderRadius: 50,
        fontWeight: "bold",
        color: "white",
        paddingTop: 5,

    },
});

export default HomeScreen;
