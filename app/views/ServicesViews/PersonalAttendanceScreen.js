import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Dimensions,
    PanResponder,
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
import AttendanceYearDropdown from "../../components/AttendanceYearDropdown";
import {useModuleName} from "../../utils/hooks/useModuleName";
import {fetchUserList} from "../../utils/apiUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {findNepaliDate,getCurrentNepaliMonthAttendanceId, getCurrentAttendanceYearId} from "../../utils";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window");

const PersonalAttendanceScreen = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedUser, setSelectedUser] = useState(null);
    const moduleName = useModuleName();
    const {userInfo, clientId} = useContext(AuthContext);
    const userId = userInfo.userId;

    const [yearData, setYearData] = useState([]);  // Store full year and month data
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [monthListEng, setMonthListEng] = useState([]);
    const [selectedYearType, setSelectedYearType] = useState(null);
    const [selectedYearId, setSelectedYearId] = useState(null);
    const [selectedMonthId, setSelectedMonthId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

    const [nepaliStartDate, setStartDate] = useState("");
    const [nepaliEndDate, setEndDate] = useState("");
    const [clientDetail, setClientDetail] = useState([]);


    useEffect(() => {
        // Find the full year object from yearData to get the months
        const selectedYear = yearData.find(year => year.attendanceYearId === selectedYearId);

        if (selectedYear) {
            const months = selectedYear.attendanceMonths
            const filteredMonthList = months.filter(
                (item) => !item.isAD
                );
            setMonthList(filteredMonthList); // Update month list based on selected year

            const filteredMonthListEng = months.filter(
                (item) => item.isAD
                );
            setMonthListEng(filteredMonthListEng)

            setSelectedMonthId(selectedMonthId ? selectedMonthId : filteredMonthList[0].attendanceYearMonthId); // Set default month (if available)

            const selectedMonth = filteredMonthList.find(month => month.attendanceYearMonthId === selectedMonthId);


            if (selectedMonth) {
                setStartDate(selectedMonth.monthStartDate);
                setEndDate(selectedMonth.monthEndDate);
            }
        }

        
        
    }, [selectedYearId, yearList, selectedMonthId, moduleName]);

    useEffect(() => {
        if (moduleName === "DashboardAdmin") {
            setSelectedUser(userId);
        }
        else
        {
            setSelectedUser(userId);
        }
        loadToken();
        fetchYearMonthData();
        handleSelectUser(selectedUser);
    }, [ moduleName]);


    const fetchYearMonthData = async () => {
        try {
            const response = await APIKit.get('/AttendanceYear/GetAttendanceYearAndMonth');
            const responseData = response.data;
            // Store full year data, including months
            setYearData(responseData);
            // Prepare year list for the picker (only ID and name)
            const years = responseData.map(year => ({
                id: year.attendanceYearId,
                name: year.attendanceYearName
            }));

            setYearList(years);

            // Set the default selected year and month
            if (years.length > 0) {
                // setSelectedYearId(years[0].id);
                const currentYearId = getCurrentAttendanceYearId(responseData);

                setSelectedYearId(currentYearId);
                
                const currentAttendanceYear = responseData.find(item => item.isCurrentAttendanceYear);
                const months = currentAttendanceYear ? currentAttendanceYear.attendanceMonths : [];
                const filteredMonthList = months.filter(
                    (item) => !item.isAD
                    );
                setMonthList(filteredMonthList);

                let clientDetail = await AsyncStorage.getItem("clientDetail");
                clientDetail = JSON.parse(clientDetail); // Parse the string into a JSON object
                
                const attendanceYearMonthIdBS = getCurrentNepaliMonthAttendanceId(responseData,false);
                const attendanceYearMonthIdAD = getCurrentNepaliMonthAttendanceId(responseData,true);
                
                if (clientDetail.useBS == true) {
                    setSelectedMonthId(attendanceYearMonthIdBS);
                } else {
                    setSelectedMonthId(attendanceYearMonthIdAD);
                }
            }
        } catch (error) {
            console.error('Error fetching year/month data: ', error);
        }
    };
    const scrollViewRef = useRef(null);
    const flatListRef = useRef(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const fetchAttendanceData = async (date, userId, selectedMonthIdOverride = null, selectedYearTypeOverride = null) => {

        let formattedStartDate = '';
        let formattedEndDate = '';
        try {
            const monthIdToUse = selectedMonthIdOverride || selectedMonthId; // Use override if provided
            const yearTypeToUse = selectedYearTypeOverride || selectedYearType;
            if (monthIdToUse && monthIdToUse != 1) {
                let monthObject = '';
                if (yearTypeToUse == 'AD') {
                    monthObject = monthListEng.find(item => item.attendanceYearMonthId === monthIdToUse);
                } else {
                    monthObject = monthList.find(item => item.attendanceYearMonthId === monthIdToUse);
                }

                formattedStartDate = monthObject.monthStartDate;
                formattedEndDate = monthObject.monthEndDate;
            } else {
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // Start date of the selected month
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0); // End date of the selected month

                const startYear = startOfMonth.getFullYear();
                const startMonth = String(startOfMonth.getMonth() + 1).padStart(2, '0');
                const startDate = String(startOfMonth.getDate()).padStart(2, '0');
                formattedStartDate = `${startYear}-${startMonth}-${startDate}`;

                const endYear = endOfMonth.getFullYear();
                const endMonth = String(endOfMonth.getMonth() + 1).padStart(2, '0');
                const endDate = String(endOfMonth.getDate()).padStart(2, '0');
                formattedEndDate = `${endYear}-${endMonth}-${endDate}`;

                formattedStartDate = nepaliStartDate ? nepaliStartDate : formattedStartDate;
                formattedEndDate = nepaliEndDate ? nepaliEndDate : formattedEndDate;
            }


            const [response, nepaliDateResponse] = await Promise.all([
              APIKit.get(`/AttendanceLog/GetPersonalAttendanceDetail/${userId}/${formattedStartDate}/${formattedEndDate}`),
              APIKit.get(`/AttendanceYear/GetNepaliDateRange?startDate=${formattedStartDate}&endDate=${formattedEndDate}`),
          ]);

            const responseData = response.data;
            const nepaliDateResponseData = nepaliDateResponse.data;

            let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail); // Parse the string into a JSON object

            setClientDetail(clientDetail);

            //Extract required fields and format date

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

                // Remove the trailing comma if present
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

          let displayDate = '';
          let displayOutDate = '';
          if (clientDetail.useBS == true && yearTypeToUse == 'BS') {
            displayDate = findNepaliDate(nepaliDateResponseData, item.date);
            displayOutDate = findNepaliDate(nepaliDateResponseData, item.checkOutDate);

        } else {
            displayDate = item.date.substring(0, 10);
            displayDate = item.checkOutDate.substring(0, 10);

        }

        return {
            date: displayDate,
            status: reason,
            shift: item.shiftName,
            checkIn: item.checkIn ? item.checkIn.substring(0, 5) : "",
            checkOutDate: displayOutDate,
            checkOut: item.checkOut ? item.checkOut.substring(0, 5) : "",
            worked: item.worked ? formatWorkedTime(item.worked) : "",
            reason: reason
        };
    });

            setData(formattedData);
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
        result += `${hours} hr${hours > 1 ? "s" : ""}`; // Add "hrs" for plural or "hr" for singular.
    }
    if (minutes > 0) {
        if (hours > 0) result += " "; // Add space between hours and minutes.
        result += `${minutes} min`;
    }

    return result || ""; // Return the formatted time or an empty string if both are 0.
}

const onRefresh = () => {
    setRefreshing(true);
    fetchAttendanceData(selectedDate, selectedUser || userId).finally(() => {
        setRefreshing(false);
    });
};

const renderItem = ({item}) => {

    const rowStyle = item.reason === "Absent" ? { backgroundColor: 'rgba(231, 76, 60, 0.2)' } : {};
    let backgroundColor = '';
    let textcolor ='';

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
        }
        else if (item.reason === "Official Visit") {
            backgroundColor = 'rgba(70, 130, 180, 0.2)'; // Weekend color
            textcolor = 'rgba(0, 0, 139, 1)';
        }
        else if (item.reason === "Work Day") {
            backgroundColor = 'rgba(169, 169, 169, 0.2)'; // Light grey background
            textcolor = 'rgba(105, 105, 105, 1)'; // Dark grey text

            }

return (
    <View style={[styles.row, { backgroundColor }]}>

    {(item.reason === "Present" || item.checkIn !== "" || item.checkOut !== "") ? (
        <>
        <Text style={styles.cellDate}>
        {item.date}
        {item.shift ? <Text style={styles.shift}>{`\n${item.shift}`}</Text> : ''}
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
        {item.shift ? <Text style={styles.shift}>{`\n${item.shift}`}</Text> : ''}
        </Text>
        <View style={styles.fullSpan}>
        <Text style={[ { color: textcolor }]}>{item.reason}</Text>
        </View>
        </>
    )}
    </View>
    );
};

const panResponder = React.useRef(
    PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return gestureState.dy > 20;
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 20) {
                onRefresh();
            }
        },
    })
    ).current;

const handleYearType = async (value) => {
    setSelectedYearType(value);
    const attendanceYearMonthIdBS = getCurrentNepaliMonthAttendanceId(yearData,false);
    const attendanceYearMonthIdAD = getCurrentNepaliMonthAttendanceId(yearData,true);
    if (value == 'BS') {
        setSelectedMonthId(attendanceYearMonthIdBS);
    } else {
        setSelectedMonthId(attendanceYearMonthIdAD);
    }
};

const handleButtonClick = () => {
    fetchAttendanceData(selectedDate, selectedUser || userId, selectedMonthId, selectedYearType).finally(() => {
        setRefreshing(false);
        setStartDate('');
        setEndDate('');
    });

};

const handleMonthSelection = (value) => {
    setSelectedMonthId(value);
};

const handleSelectUser = (user) => {
    setSelectedUser(user);
};

const handleYearChange = (yearId) => {
    setSelectedYearId(yearId);
};

return (
    <View style={styles.container}>

    <AttendanceYearDropdown
    selectedYearType={selectedYearType}
    selectedYearId={selectedYearId}
    selectedMonthId={selectedMonthId}
    onYearChange={handleYearChange}
    onYearTypeChange={handleYearType}
    onMonthChange={handleMonthSelection}
    />

    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
    <UserDropdown onSelect={handleSelectUser} selectedValue={selectedUser} placeholder="Select a user" />
    <Button style={{flex: 1, height: 50, marginHorizontal: 5}} title="Search" onPress={handleButtonClick} />
    </View>
    <ScrollView >
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
    {...panResponder.panHandlers}
    />
    </View>
    </ScrollView>
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
        fontSize: 10,  // Adjust this to the desired font size for shift
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
