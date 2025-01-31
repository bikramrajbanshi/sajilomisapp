import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext, useApproval} from "../context/AuthContext";
import APIKit, {loadToken} from "../shared/APIKit";
import {View, Text, Button, TouchableOpacity, StyleSheet, TouchableHighlight, ScrollView,ActivityIndicator, PermissionsAndroid, RefreshControl, Platform, Alert, StatusBar, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fetchUserDetails} from '../utils/apiUtils'; 
import {getTodayFullDate, getTodayISOString, getCurrentTime, hasSpecificPermission, isValidLocation} from "../utils";
import Toast from "react-native-toast-message";
import GetLocation from 'react-native-get-location'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import {resetApprovalCount} from "../utils/GetApprovalCount";
import NepaliDate  from 'nepali-date-converter';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NepaliCalendarPopup from "../components/NepaliCalendarPopup";
import {BlurView} from '@react-native-community/blur';


const cardsData = [
    {title: "PRESENT", value: 10},
    {title: "ON LEAVE", value: 5},
    {title: "SHIFT NOT STARTED", value: 3},
    {title: "ABSENT", value: 2},
    {title: "ON VISIT", value: 4},
    {title: "ON WEEKEND", value: 6},
    {title: "HOLIDAYS", value: 1},
    {title: "LATE IN / EARLY OUT", value: 0}
];


const AdminHomeScreen = ({navigation}) => {
    const [clientDetail, setClientDetail] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [preStartDate, setPreStartDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [values, setValues] = useState({
        present: 0,
        onLeave: 0,
        shiftNotStarted: 0,
        absent: 0,
        onOfficeVisit: 0,
        onWeekend: 0,
        onHoliday: 0,
        lateInEarlyOut: 0,
        allUsers: 0,
    });
    const [location, setLocation] = useState({latitude: "", longitude: ""});
    const {logout, userInfo} = useContext(AuthContext);
    const userId = userInfo.userId;
    const [userDetails, setUserDetails] = useState(null);
    const [valuesUpcoming, setValuesUpcoming] = useState({
        upcomingHolidays: 0,
        upcomingLateInEarlyOut: 0,
        upcomingVisits: 0,
        upcomingleavesNew: 0,
        upcomingBirthDay: 0,

    });
    const {
        setApprovalCount, setAttendanceCount, setLeaveCount, setOfficialCount, setLateCount, setOvertimeCount,
        setShiftChangeCount, setLeaveEncashmentCount, setAdvancePaymentCount, setRequestLeaveCount
    } = useApproval();


    const handleDateChange = (date) => {

        setStartDate(date); // Update the selected date
    };

    useEffect(() => {
        if(startDate != null)
        {   
            fetchData();
            resetApprovalCount(setApprovalCount, setAttendanceCount, setLeaveCount, setOfficialCount, setLateCount, setOvertimeCount,
                setShiftChangeCount, setLeaveEncashmentCount, setAdvancePaymentCount, setRequestLeaveCount);
        }

    }, [startDate]);

    useEffect(() => {
        loadToken();
        loadUserDetails(); 
        //getLocation();
        setStartDate(getTodayFullDate());
    }, []);


    const loadUserDetails = async () => {
        try {
          const data = await fetchUserDetails(userId);
          setUserDetails(data);
      } catch (error) {
          console.error('Error fetching User:', error);
      }
  };

  const fetchData = async () => {
    try {
     setIsLoading(true);
     let date;
     if(startDate == null || startDate == preStartDate)
     {
        date = getTodayFullDate();
    }
    else
    {
        date = startDate;
    }
    const response = await APIKit.get(
`/Home/GetDashboardAllCountForMobileApp/${date}`
);

    let upcomingApiData = {
        upcomingHolidays: response.data.upcomingHolidays,
        upcomingLateInEarlyOut: response.data.upcomingLateInEarlyOut,
        upcomingVisits: response.data.upcomingVisits,
        upcomingleavesNew: response.data.upcomingleaves,
        upcomingBirthDay: response.data.upcomingBirthDay,
    };
    setValuesUpcoming(upcomingApiData);

const endTime = Date.now(); // End time
const statusValues = {
    present: response.data.todaysPresent,
    absent: response.data.todaysAbsent,
    onLeave: response.data.todaysLeaves,
    weekend: response.data.onWeekend ?  response.data.onWeekend : 0,
    onHoliday: response.data.onHoliday,
    onOfficeVisit: response.data.todaysVisits,
    allUsers: response.data.totalUsers
}

setValues(statusValues);
} catch (error) {
    console.error("Error fetching data: ", error);
} finally {
    setPreStartDate(startDate);
    setIsLoading(false);
    setRefreshing(false);
}
};

const onRefresh = useCallback(() => {
    setRefreshing(true);
    setStartDate(getTodayFullDate());
    fetchData();
    setTimeout(() => {
    setRefreshing(false);  // This will stop the refreshing animation
}, 1000);  

}, []);

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
        console.log("default", location);
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
        console.log(currentLocation);

        const currentTime = getTodayISOString();
        const checkInData = {
            inOutTime: currentTime,
            attendanceType: "Present",
            latitude:  currentLocation.latitude ? currentLocation.latitude : 0,
            longitude:  currentLocation.longitude ? currentLocation.longitude : 0
        };


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
 <View style={{ flex: 1 }}>
 <StatusBar barStyle="light-content" backgroundColor="rgba(44,78,156,1)" />

 </View>
 <LinearGradient colors={['rgba(44,78,156,1)', 'rgba(44,75,156,0.1)']} style={styles.gradientBackground}>

 <View>

 </View>

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
<Text style={styles.username}>{userDetails ? userDetails.firstName + ' ' + userDetails.lastName : ''}</Text>
</View>
{/* <View style={styles.icons}>
<Ionicons name="search" size={24} color="black" style={styles.icon} />
<Ionicons name="notifications" size={24} color="black" style={styles.icon} />
        </View> */}
                {/*<View>*/}
                {/*    <Button title="Get Location" onPress={getLocation} />*/}
                {/*    {location && (*/}
                {/*        <Text>*/}
                {/*            Latitude: {location.latitude}, Longitude: {location.longitude}*/}
                {/*        </Text>*/}
                {/*    )}*/}
                {/*</View>*/}
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
<NepaliCalendarPopup onDateChange={handleDateChange} onReFresh={refreshing}/>
</LinearGradient>

<View style={styles.cardsContainer}>

<TouchableOpacity key="1" style={styles.card} onPress={() => navigation.navigate("PresentList", { startDate: startDate })}>
<FontAwesome5 name="user-check" size={20} color="green"/>
<Text style={styles.cardTitle}>PRESENT</Text>
<Text style={[styles.cardValue, {color: "green"}]}>{values.present}</Text>
</TouchableOpacity>
<TouchableOpacity key="2" style={styles.card} onPress={() => navigation.navigate(`AdminLeaveList`, { startDate: startDate })}>
<FontAwesome5 name="user-lock" size={20} color="red"/>
<Text style={styles.cardTitle}>ON LEAVE</Text>
<Text style={[styles.cardValue, {color: "red"}]}>{values.onLeave}</Text>
</TouchableOpacity>
<TouchableOpacity key="4" style={styles.card} onPress={() => navigation.navigate("AbsentList", { startDate: startDate })}>
<FontAwesome5 name="user-times" size={20} color="brown"/>
<Text style={styles.cardTitle}>ABSENT</Text>
<Text style={[styles.cardValue, {color: "brown"}]}>{values.absent}</Text>
</TouchableOpacity>
<TouchableOpacity key="5" style={styles.card} onPress={() => navigation.navigate(`OfficialVisitList`, { startDate: startDate })}>
<FontAwesome5 name="briefcase" size={20} color="purple"/>
<Text style={styles.cardTitle}>ON VISIT</Text>
<Text style={[styles.cardValue, {color: "purple"}]}>{values.onOfficeVisit}</Text>
</TouchableOpacity>
<TouchableOpacity key="6" style={styles.card} onPress={() => navigation.navigate(`WeekendList`, { startDate: startDate })}>
<FontAwesome5 name="calendar-check" size={20} color="orange"/>
<Text style={styles.cardTitle}>ON WEEKEND</Text>
<Text style={[styles.cardValue, {color: "orange"}]}>{values.weekend}</Text>
</TouchableOpacity>
<TouchableOpacity key="7" style={styles.card} onPress={() => navigation.navigate(`OnHolidayList`, { startDate: startDate })}>
<FontAwesome5 name="plane-departure" size={20} color="blue"/>
<Text style={styles.cardTitle}>HOLIDAYS</Text>
<Text style={[styles.cardValue, {color: "blue"}]}>{values.onHoliday}</Text>
</TouchableOpacity>
<TouchableOpacity key="8" style={styles.card} onPress={() => navigation.navigate(`AllUsersList`)}>
<FontAwesome5 name="users" size={20} color="rgb(0,128,128)"/>
<Text style={styles.cardTitle}>ALL USERS</Text>
<Text style={[styles.cardValue, {color: "rgb(0,128,128)"}]}>{values.allUsers}</Text>
</TouchableOpacity>
</View>


<Text style={styles.upcoming}>Upcoming Activities</Text>

<View style={styles.cardsContainers}>
<TouchableOpacity
style={styles.card} onPress={() => navigation.navigate(`UpcomingLeave`, { startDate: startDate })}>
<FontAwesome5 name="user-lock" size={20} color="red"/>
<Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingLeave`, { startDate: startDate })}>LEAVES</Text>
<Text style={[styles.cardValue, {color: "red"}]} onPress={() => navigation.navigate(`UpcomingLeave`, { startDate: startDate })}>{valuesUpcoming.upcomingleavesNew}</Text>
</TouchableOpacity>


<TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`UpcomingOfficialVisit`, { startDate: startDate })}>
<FontAwesome5 name="briefcase" size={20} color="purple"/>
<Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingOfficialVisit`, { startDate: startDate })}>VISITS</Text>
<Text style={[styles.cardValue, {color: "purple"}]} onPress={() => navigation.navigate(`UpcomingOfficialVisit`, { startDate: startDate })}>{valuesUpcoming.upcomingVisits}</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`UpcomingHolidays`, { startDate: startDate })}>
<FontAwesome5 name="plane-departure" size={20} color="blue"/>
<Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingHolidays`, { startDate: startDate })}>HOLIDAYS</Text>
<Text style={[styles.cardValue, {color: "blue"}]} onPress={() => navigation.navigate(`UpcomingHolidays`, { startDate: startDate })}>{valuesUpcoming.upcomingHolidays}</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.card} onPress={() => navigation.navigate(`UpcomingLateInEarlyOut`, { startDate: startDate })}>
<FontAwesome5 name="user-clock" size={20} color="red"/>
<Text style={styles.cardTitle} onPress={() => navigation.navigate(`UpcomingLateInEarlyOut`, { startDate: startDate })}>LATE IN</Text>
<Text style={[styles.cardValue, {color: "red"}]} onPress={() => navigation.navigate(`UpcomingLateInEarlyOut`, { startDate: startDate })}>{valuesUpcoming.upcomingLateInEarlyOut}</Text>
</TouchableOpacity>


</View>
</ScrollView>

</LinearGradient>

{isLoading && (
    <BlurView
    style={styles.blurView}
        blurType="light" // Adjust blur type (e.g., 'dark', 'extra light', etc.)
        blurAmount={1} // Set blur strength
        >
        <View style={[styles.loadingContainer]}>
        <ActivityIndicator size={1} style={styles.spinner} />
        </View>
        </BlurView>
        )}
</View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        },
        dateText: {
            fontSize: 16,
            fontWeight: '500', // Medium weight for the text
            color: '#FFF', // Dark grey for the text color
            borderRadius: 8, // Rounded corners
            borderColor: '#ccc', // Light grey border color
            textAlign: 'center', // Center the text
            },
            gradientBackground: {
                ...StyleSheet.absoluteFillObject, // This ensures the gradient covers the full screen
                },
                blurView: {
                    ...StyleSheet.absoluteFillObject, // This makes the blur effect cover the full screen
                    justifyContent: 'center',
                    alignItems: 'center',
                    },
                    loadingContainer: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        },
                        spinner: {
                            marginBottom: 10, // Space between spinner and text
                            },
                            header: {
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 15,
                                },
                                profileImage: {
                                    width: 40,
                                    height: 40,
                                    borderRadius: 40,

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
                                                    color: "#fff",
                                                    },
                                                    scrollView: {
                                                        flexGrow: 1,
                                                        paddingHorizontal: 10,
                                                        marginTop: -15,
                                                        },
                                                        cardsContainer: {
                                                            flexDirection: "row",
                                                            flexWrap: "wrap",
                                                            justifyContent: "space-between",
                                                            marginTop: -5,
                                                            },
                                                            cardsContainers: {
                                                                flexDirection: "row",
                                                                flexWrap: "wrap",
                                                                justifyContent: "space-between",
                                                                marginTop: 5,
                                                                },
                                                                cards: {
                                                                    width: 140,
                                                                    backgroundColor: "rgba(255,255,255,0.8)",
                                                                    borderRadius: 15,
                                                                    padding: 10,
                                                                    marginBottom: 15,
                                                                    alignItems: "center",
                                                                    height: 110,
                                                                    marginRight: 10,
                                                                    },
                                                                    firstCards: {
                                                                        width: 140,
                                                                        backgroundColor: "rgba(255,255,255,0.8)",
                                                                        borderRadius: 15,
                                                                        padding: 15,
                                                                        marginBottom: 15,
                                                                        alignItems: "center",
                                                                        height: 110,
                                                                        marginHorizontal: 10,
                                                                        },
                                                                        card: {
                                                                            width: "30%",
                                                                            backgroundColor: "rgba(255,255,255,0.8)",
                                                                            borderRadius: 15,
                                                                            padding: 15,
                                                                            marginBottom: 10,
                                                                            alignItems: "center",
                                                                            height: 100,
                                                                            },
                                                                            updateContainer: {
                                                                                height: 80,
                                                                                borderRadius: 10,
                                                                                padding: 10,

                                                                                marginVertical: "3%",
                                                                                },
                                                                                calenderContainer: {
                                                                                    height: 50,
                                                                                    borderRadius: 10,
                                                                                    padding: 10,
                                                                                    marginBottom: 20,
                                                                                    marginTop: 20,
                                                                                    },
                                                                                    updateText: {
                                                                                        fontSize: 18,
                                                                                        fontWeight: "bold",
                                                                                        color: 'white',
                                                                                        },
                                                                                        updateDescription: {
                                                                                            fontSize: 14,
                                                                                            marginTop: 10,
                                                                                            color: 'white',
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
                                                                                                        marginTop: 0,

                                                                                                        },
                                                                                                        checkInButton: {
                                                                                                            backgroundColor: "#000080",
                                                                                                            borderRadius: 50,
                                                                                                            paddingVertical: 10,
                                                                                                            paddingHorizontal: 20,

                                                                                                            },
                                                                                                            checkInText: {
                                                                                                                fontSize: 12,
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
                                                                                                                    upcoming: {
                                                                                                                        width: "100%",
                                                                                                                        textAlign: "left",
                                                                                                                        fontSize: 20,
                                                                                                                        marginBottom: 10,
                                                                                                                        fontWeight: "bold",
                                                                                                                        marginLeft: 20,

                                                                                                                        },
                                                                                                                        leftArrow: {
                                                                                                                            position: 'absolute',
                                                                                                                            left: 0,
                                                                                                                            bottom: 50,
                                                                                                                            zIndex: 1,
                                                                                                                            },
                                                                                                                            rightArrow: {
                                                                                                                                position: 'absolute',
                                                                                                                                right: 0,
                                                                                                                                bottom: 50,
                                                                                                                                zIndex: 1,
                                                                                                                                },
                                                                                                                                });

                                                                                                                                export default AdminHomeScreen;
