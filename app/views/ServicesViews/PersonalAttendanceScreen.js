import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Modal,
    Button,
    TouchableOpacity, TextInput
} from "react-native";
import React, {useContext, useEffect, useState, useRef} from "react";
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import APIKit, {loadToken} from "../../shared/APIKit";
import {AuthContext} from "../../context/AuthContext";
import MonthYearPicker from "../../utils/MonthYearPicker";
import UserPicker from "../../components/UserPicker";
import UserDropdown from "../../components/UserDropdown";
import AttendanceYearMonthDropdown from "../../components/AttendanceYearMonthDropdown";
import {useModuleName} from "../../utils/hooks/useModuleName";
import {fetchUserList} from "../../utils/apiUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {findNepaliDate,getCurrentNepaliMonthAttendanceId, getCurrentAttendanceYearId} from "../../utils";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window");

const PersonalAttendanceScreen = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isAD, setIsAD] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const moduleName = useModuleName();
    const {userInfo, clientId} = useContext(AuthContext);
    const [nepaliStartDate, setStartDate] = useState("");
    const [nepaliEndDate, setEndDate] = useState("");
    const [clientDetail, setClientDetail] = useState([]);
    const [totalWorkedHour, setTotalWorkedHour] = useState(null);
    const [totalWorkedMinute, setTotalWorkedMinute] = useState(null);






    useEffect(() => {
        loadToken();
        if (moduleName === "DashboardAdmin") {
        }
        else
        {
        }
        setSelectedUser(userInfo.userId);
    }, [ moduleName]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };


    const fetchAttendanceData = async () => {
        try {

            const response = await  APIKit.get(`/AttendanceLog/GetPersonalAttendanceDetail/${selectedUser}/${fromDate}/${toDate}`);
            const nepaliDateResponse = await APIKit.get(`/AttendanceYear/GetNepaliDateRange?startDate=${fromDate}&endDate=${toDate}`);
            const responseData = response.data;
            const nepaliDateResponseData = nepaliDateResponse.data;

            let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail); 

            setClientDetail(clientDetail);

            //Extract required fields and format date
            let totalWorkedHourInt =0;
             let totalWorkedMinuteInt =0;

            const formattedData = responseData.map((item) => {
                let reason = "";

                if (item.leaveName) {

                  reason += "Leave,";

              }
              if (item.officeVisitName) {
                reason += "Official Visit,";
            }
            if (item.holidayName) {
                reason += "Holiday,";
            }
            if (item.isWeekend === "Yes") {
                if (item.offWeekendTypeId > 0) {
                    reason += item.offWeekendName;
                } else {
                    reason += "Weekend,";
                }
            }

            reason = reason.endsWith(",") ? reason.slice(0, -1) : reason;

            if (reason == '') {
                const currentDate = new Date();
                const attendanaceDate = new Date(item.date);
                if(attendanaceDate > currentDate)
                {
                    reason = "Work Day"
                }
                else{
                  reason = item.status;

              }
          }

          //Calculate Worked Hour
          const workedHourString = item.worked ? formatWorkedTime(item.worked) : "";

          if(item.worked != null)
          {
            const [hours, minutes] = item.worked.split(":").map(Number);
                totalWorkedHourInt += hours;
                totalWorkedMinuteInt += minutes;
          }
           const currentDate = new Date(item.date);
            const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });

          let displayDate = '';
          let displayOutDate = '';
          if (clientDetail.useBS == true && isAD == false) {
            displayDate = findNepaliDate(nepaliDateResponseData, item.date);
            displayOutDate = findNepaliDate(nepaliDateResponseData, item.checkOutDate);

        } else {
            displayDate = item.date.substring(0, 10);
            displayOutDate = item.checkOutDate != null ? item.checkOutDate.substring(0, 10) : null;

        }

        return {
            date: displayDate,
            status: reason,
            shift: item.shiftName,
            checkIn: item.checkIn ? item.checkIn.substring(0, 5) : "",
            checkOutDate: displayOutDate,
            checkOut: item.checkOut ? item.checkOut.substring(0, 5) : "",
            worked: workedHourString,
            reason: reason,
            holiday: item.holidayName ? item.holidayName : "", 
            leave: item.leaveName ? item.leaveName : "", 
            halfLeave : item.halfLeaveType,
            weekname: dayOfWeek,

        };
    });
            setData(formattedData);
            let remainingHour =0;
            if(totalWorkedMinuteInt != 0)
            {
                remainingHour = Math.floor(totalWorkedMinuteInt / 60);
                const remainingMinute = totalWorkedMinuteInt % 60;
                setTotalWorkedMinute(remainingMinute + " min");
            }

            totalWorkedHourInt = totalWorkedHourInt + remainingHour;
            setTotalWorkedHour(totalWorkedHourInt + " hrs");

        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    function formatWorkedTime(worked) {
    if (!worked) return ""; // If no time is provided, return an empty string.

    const [hours, minutes] = worked.split(":").map(Number); // Split the time into hours and minutes.

    let result = "";
    if (hours > 0) {
        result += `${hours} hr${hours > 1 ? "s" : ""}`; 
    }
    if (minutes > 0) {
        if (hours > 0) result += " "; 
        result += `${minutes} min`;
    }

    return result || ""; // Return the formatted time or an empty string if both are 0.
}

const onRefresh = () => {
    setRefreshing(true);
    fetchAttendanceData(selectedUser || userId).finally(() => {
        setRefreshing(false);
    });
};

const renderItem = ({item}) => {

    const rowStyle = item.reason === "Absent" ? { backgroundColor: 'rgba(231, 76, 60, 0.2)' } : {};
    let backgroundColor = '';
    let textcolor ='';
    let name = '';

    if (item.reason === "Absent") {
        backgroundColor = 'rgba(231, 76, 60, 0.2)';
        textcolor = 'rgba(139, 0, 0, 1)';
    } 
    else if (item.reason === "Present") {
            backgroundColor = 'rgba(76, 175, 80, 0.1)'; // Present color
        } 
        else if (item.reason === "Weekend") {
            backgroundColor = 'rgba(249, 231, 159, 0.2)'; // Weekend color
            textcolor = 'rgba(204, 153, 51, 1)';
        }
        else if (item.reason === "Leave") {
            backgroundColor = 'rgba(70, 130, 180, 0.2)'; // Weekend color
            textcolor = 'rgba(0, 0, 139, 1)';
            if(item.halfLeave != 0)
            {
                name = "Half Leave";
            }
            else
            {
                name = item.leave;
            }

        }
        else if (item.reason === "Official Visit") {
            backgroundColor = 'rgba(70, 130, 180, 0.2)'; // Weekend color
            textcolor = 'rgba(0, 0, 139, 1)';
        }
        else if (item.reason === "Work Day") {
            backgroundColor = 'rgba(169, 169, 169, 0.2)'; // Light grey background
            textcolor = 'rgba(105, 105, 105, 1)'; // Dark grey text
        }
        else if (item.reason === "Holiday") {
           backgroundColor = 'rgba(255, 250, 250, 0.2)'; // Weekend color
           textcolor = 'rgba(204, 153, 51, 1)';
           name = item.holiday;
       }

       return (
        <View style={[styles.row, { backgroundColor }]}>

        {(item.reason === "Present" || item.checkIn !== "" || item.checkOut !== "") ? (
            <>
            <Text style={styles.cellDate}>
            {item.date}
            {item.weekname ? <Text style={styles.shift}>{`\n(${item.weekname})`}</Text> : ''}
            {item.shift ? <Text style={styles.shift}>{`\n${item.shift}`}</Text> : ''}
            {(name !== '') ? <Text style={styles.shift}>{`\n${name}`}</Text> : ''}
            </Text>
            <Text style={styles.cell}>{item.checkIn}</Text>
            <Text style={styles.cellDate}>{item.checkOutDate}</Text>
            <Text style={styles.cell}>{item.checkOut}</Text>
            <Text style={styles.cellDate}>{item.worked}</Text>
            </>
            ) : (
            <>
            <Text style={styles.cellDate}>
            {item.date}
            {item.weekname ? <Text style={styles.shift}>{`\n(${item.weekname})`}</Text> : ''}
            {item.shift ? <Text style={styles.shift}>{`\n${item.shift}`}</Text> : ''}
            </Text>
            <View style={styles.fullSpan}>
            <Text style={[ { color: textcolor }]}>{item.reason}{name !== '' ? ` (${name})` : ''}</Text>
            </View>
            </>
        )}
        </View>
        );
        };




        const handleButtonClick = () => {
            fetchAttendanceData(selectedUser).finally(() => {
                setRefreshing(false);
                setStartDate('');
                setEndDate('');
            });

        };




        return (
            <View style={styles.container}>

            <AttendanceYearMonthDropdown
            onFromDate={setFromDate}
            onToDate={setToDate}
            onIsAD={setIsAD}
            />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
            <UserDropdown onSelect={handleSelectUser} selectedValue={selectedUser} placeholder="Select a user" />
            <Button style={{flex: 1, height: 50, marginHorizontal: 5}} title="Search" onPress={handleButtonClick} />
            </View>
            <View style={{ flex: 1, width: '100%' }}>
            
            <View style={styles.header}>
            <Text style={styles.headerTextDate}>Date</Text>
            <Text style={styles.headerText}>Check In</Text>
            <Text style={styles.headerTextDate}>Out Date</Text>
            <Text style={styles.headerText}>Check Out</Text>
            <Text style={styles.headerTextDate}>Worked</Text>
            </View>

            <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            />

            <View style={styles.bottom}>
            <Text style={styles.bottomText}>Total</Text>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerTextDate}></Text>
            <Text style={styles.headerText}></Text>
            <Text style={styles.bottomText}>{totalWorkedHour} {totalWorkedMinute}</Text>
            </View>

            </View>
            {refreshing && <ActivityIndicator size="large" style={styles.loading}/>}
            </View>
            );
        };


        const pickerSelectStyles = {
          inputIOS: {
            height: 50,
            paddingHorizontal: 10,
            borderColor: '#ccc',
            borderWidth: 1,
            marginHorizontal: 5,
        },
        inputAndroid: {
            height: 50,
            paddingHorizontal: 10,
            borderColor: '#ccc',
            borderWidth: 1,
            marginHorizontal: 5,
        },
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: 20,
            paddingHorizontal: 10,
        },
        pickerContainer: {
            padding: 10,

        },
        fullSpan: {
            flex: 5,  // This makes the reason take up all 5 columns
            justifyContent: 'center',
            alignItems: 'center',  // optional, for centering the text
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        header: {
            flexDirection: "row",
            paddingVertical: 5,
            backgroundColor: "lightgray",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
        },
        headerText: {
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            color: "#000",
            width: '15%',
        },
        bottom: {
            flexDirection: "row",
            paddingVertical: 5,
            backgroundColor: "lightgray",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
        },
        bottomText: {
            fontSize: 13,
            fontWeight: "bold",
            textAlign: "center",
            textAlignVertical: "center", 
            verticalAlign: "center", 
            color: "#000",
            width: '23.33%',
        },
        headerTextDate: {
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            color: "#000",
            width: '23.33%',
        },


        row: {
            flexDirection: "row",
            marginVertical: 4,
            paddingVertical: 12,
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
        },
        cell: {
            width: '15%',
            fontSize: 12,
            textAlign: "center",
            color: "#333",
        },
        cellDate: {
            width: '23.33%',
            fontSize: 12,
            textAlign: "center",
            color: "#333",
        },
        shift: {
            fontSize: 10,
            textAlign: "left",
            alignItems: 'left',  // Adjust this to the desired font size for shift
        },
        loading: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{translateX: -25}, {translateY: -25}],
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
        },
        modalView: {
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
            elevation: 5,
        },
        title: {
            fontSize: 18,
            marginVertical: 10,
        },
        buttonContainer: {
            flexDirection: 'row',
            marginTop: 20,
        },
        button: {
            backgroundColor: '#2196F3',
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 5,
        },
        buttonCancel: {
            backgroundColor: '#f44336',
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
        },
    });

    export default PersonalAttendanceScreen;
