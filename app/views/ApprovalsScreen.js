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
    PermissionsAndroid,
    Image
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext, useApproval} from "../context/AuthContext";
import APIKit, { loadToken } from "../shared/APIKit";
import {getTodayFullDate, getTodayISOString, getCurrentTime, hasSpecificPermission} from "../utils";
import Toast from "react-native-toast-message";
import {fetchUserDetails} from '../utils/apiUtils'; 
import {fetchApprovalCount, resetApprovalCount} from "../utils/GetApprovalCount";
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const ApprovalsScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { logout, userInfo } = useContext(AuthContext);
    const { attendanceCount, setAttendanceCount } = useApproval();
    const { leaveCount, setLeaveCount } = useApproval();
    const { officialCount, setOfficialCount } = useApproval();
    const [userDetails, setUserDetails] = useState(null);
    const { lateCount, setLateCount } = useApproval();
    const { overtimeCount, setOvertimeCount } = useApproval();
    const { shiftChangeCount, setShiftChangeCount } = useApproval();
    const { leaveEncashmentCount, setLeaveEncashmentCount } = useApproval();
    const { advancePaymentCount, setAdvancePaymentCount } = useApproval();
    const { requestLeaveCount, setRequestLeaveCount } = useApproval();
    const { setApprovalCount } = useApproval();
    const [values, setValues] = useState({
        attendanceRequestCount: "",
        appliedLeaveCount: "",
        officialVisitCount: "",
        inOutCount: "",
        overtimeCount: "",
        shiftChangeRequestCount: "",
        requestLeaveCount: "",
        advancePaymentRequestCount: "",
        leaveEncashmentRequestCount:""
    });

    useEffect(() => {
        loadToken();
        loadUserDetails(); 
        setTimeout(()=>{
            fetchData();
        },500);
        resetApprovalCount(setApprovalCount,setAttendanceCount,setLeaveCount, setOfficialCount, setLateCount,setOvertimeCount,
            setShiftChangeCount,setLeaveEncashmentCount,setAdvancePaymentCount,setRequestLeaveCount);
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
        const response = await APIKit.get('/Home/GetIsPendingApplicationExist/true');
        const attendanceRequest =response.data.attendacePending;
        const leaveRequest=response.data.leavePending;
        const officialVisit = response.data.officeVisitPending;
        const inOut = response.data.lateInEarlyOutsPending;
        const overtime = response.data.overTimePending;
        const shiftChangeRequest = response.data.shiftChangeRequestPending;
        const leaveEncashmentRequest = response.data.leaveEncashmentPending;
        const advancePaymentRequest = response.data.advancePaymentRequestPending;
        const requestLeave = response.data.requestLeavePending;

        setValues({
            attendanceRequestCount: attendanceRequest,
            appliedLeaveCount: leaveRequest,
            officialVisitCount:officialVisit,
            inOutCount:inOut,
            overtimeCount:overtime,
            shiftChangeRequestCount:shiftChangeRequest,
            advancePaymentRequestCount:advancePaymentRequest,
            leaveEncashmentRequestCount:leaveEncashmentRequest,
            requestLeaveCount:requestLeave
        });

        setAttendanceCount(attendanceRequest);
        setLeaveCount(leaveRequest);
        setOfficialCount(officialVisit);
        setLateCount(inOut);
        setOvertimeCount(overtime);
        setShiftChangeCount(shiftChangeRequest);
        setLeaveEncashmentCount(leaveEncashmentRequest);
        setAdvancePaymentCount(advancePaymentRequest);
        setRequestLeaveCount(requestLeave);

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
    resetApprovalCount(setApprovalCount,setAttendanceCount,setLeaveCount, setOfficialCount, setLateCount,setOvertimeCount,
        setShiftChangeCount,setLeaveEncashmentCount,setAdvancePaymentCount,setRequestLeaveCount);
}, []);

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
<Text style={styles.serviceHeader}>Application Requests</Text>
<View style={styles.cardsContainer}>
<TouchableOpacity key="0" style={styles.card} onPress={() => navigation.navigate("AttendanceRequestScreen")}>
<FontAwesome5 name="user-check" size={20} color="green" />
<Text style={styles.cardTitle} >ATTENDANCE</Text>
<Text style={styles.cardValue} >{attendanceCount}</Text>
</TouchableOpacity>
<TouchableOpacity
key="1" style={styles.card} onPress={() => navigation.navigate("LeaveRequestScreen")}>
<FontAwesome5 name="user-lock" size={20} color="red" />
<Text style={styles.cardTitle}>LEAVE</Text>
<Text style={styles.cardValue}>{leaveCount}</Text>
</TouchableOpacity>

<TouchableOpacity key="2" style={styles.card} onPress={() => navigation.navigate("OfficialVisitDetailScreen")}>
<Ionicons name="briefcase" size={20} color="purple" />
<Text style={styles.cardTitle}>VISITS</Text>
<Text style={styles.cardValue}>{officialCount}</Text>
</TouchableOpacity>

<TouchableOpacity key="3" style={styles.card} onPress={() => navigation.navigate("LateInEarlyOutDetailScreen")}>
<MaterialCommunityIcons name="clock-alert" size={20} color="orange" />
<Text style={styles.cardTitle}>LATE / EARLY</Text>
<Text style={styles.cardValue}>{lateCount}</Text>
</TouchableOpacity>

<TouchableOpacity key="4" style={styles.card} onPress={() => navigation.navigate("OvertimeDetailScreen")}>
<FontAwesome5 name="user-clock" size={20} color="grey" />
<Text style={styles.cardTitle}>OVERTIME</Text>
<Text style={styles.cardValue}>{overtimeCount}</Text>
</TouchableOpacity>

<TouchableOpacity key="5" style={styles.card} onPress={() => navigation.navigate("ShiftChangeDetailScreen")}>
<MaterialCommunityIcons name="transit-transfer" size={20} color="rgba(44,75,156,1)" />
<Text style={styles.cardTitle}>SHIFT CHANGE</Text>
<Text style={styles.cardValue}>{shiftChangeCount}</Text>
</TouchableOpacity>

<TouchableOpacity key="6" style={styles.card} onPress={() => navigation.navigate("LeaveEncashmentDetailScreen")}>
<FontAwesome6 name="filter-circle-dollar" size={20} color="brown" />
<Text style={styles.cardTitle}>LEAVE ENCASH</Text>
<Text style={styles.cardValue}>{leaveEncashmentCount}</Text>
</TouchableOpacity>

<TouchableOpacity key="7" style={styles.card} onPress={() => navigation.navigate("AdvancePaymentDetailScreen")}>
<FontAwesome6 name="hand-holding-dollar" size={20} color="darkgreen" />
<Text style={styles.cardTitle}>ADV. PAYMENT </Text>
<Text style={styles.cardValue}>{advancePaymentCount}</Text>
</TouchableOpacity>


<TouchableOpacity key="8" style={styles.card} onPress={() => navigation.navigate("RequestLeaveDetailScreen")}>
<MaterialCommunityIcons name="clock-minus" size={20} color="red" />
<Text style={styles.cardTitle}>REQ. LEAVE</Text>
<Text style={styles.cardValue}>{requestLeaveCount}</Text>
</TouchableOpacity>
</View>
</ScrollView>

{/* <View>
<TouchableHighlight
onPress={() => {
    handleCheckIn();
}}
>
<Text style={styles.buttons}>Check-In</Text>
</TouchableHighlight>
      </View> */}
</LinearGradient>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: StatusBar.currentHeight,
        backgroundColor: "rgba(0,0,255,0.05)",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // marginBottom: 10,
            padding: 15,
            // borderWidth: 1,
            },
            profileImage: {
                width: 40,
                height: 40,
                borderRadius: 40,

                },
                profileContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    color:'white',
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
                                color:'white',
                                },
                                serviceHeader:{
                                  fontWeight:'bold',
                                  fontSize:22,
                                  color:'white',
                                  marginVertical:'5%',
                                  paddingLeft:5,
                                  },
                                  innerContainer: {
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    height: "50%",
                                    borderWidth: 1,
                                    borderColor: "black",
                                    borderRadius: 5,
                                    },

                                    upcoming:{
                                        width:"100%",
                                        textAlign:"left",
                                        fontSize:16,
                                        marginBottom:20,
                                        fontWeight:"bold",

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
                                                        paddingHorizontal: 10,
                                                        },
                                                        updateContainer: {
                                                            backgroundColor: "#f0f0f0",
                                                            borderRadius: 10,
                                                            padding: 20,

                                                            marginVertical:"5%",
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
                                                                            width: "31%",
                                                                            backgroundColor: "rgba(255,255,255,0.8)",
                                                                            borderRadius: 10,
                                                                            padding: 15,
                                                                            marginBottom: 15,
                                                                            alignItems:"center",
                                                                            textAlign:'center',
                                                                            },
                                                                            cardTitle: {
                                                                                fontSize: 10,
                                                                                fontWeight: "bold",
                                                                                color: "#333",
                                                                                textAlign:'center',
                                                                                marginTop:5,
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
                                                                                                            color:"white",
                                                                                                            },
                                                                                                            buttons: {
                                                                                                                fontSize: 12,
                                                                                                                backgroundColor: "#000080",
                                                                                                                width: 80,
                                                                                                                height: 30,
                                                                                                                textAlign: "center",
                                                                                                                borderRadius: 50,
                                                                                                                fontWeight: "bold",
                                                                                                                color:"white",
                                                                                                                paddingTop:5,

                                                                                                                },
                                                                                                                });

                                                                                                                export default ApprovalsScreen;
