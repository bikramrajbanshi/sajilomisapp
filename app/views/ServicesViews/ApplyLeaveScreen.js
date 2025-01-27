import React, {useContext, useEffect, useState} from "react";
import {
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
} from "react-native";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import Toast from 'react-native-toast-message';
import NepaliCalendarPopupForTextBox from "../../components/NepaliCalendarPopupForTextBox";
import {AuthContext} from "../../context/AuthContext";
import APIKit, {loadToken} from "../../shared/APIKit";
import { geFullDate} from '../../utils';
import DropdownList from '../../components/DropdownList';
import { EnumType } from '../../components/EnumType';

const ApplyLeaveScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);

    const [leaveType, setLeaveType] = useState('');
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [totalDays, setTotalDays] = useState(1);
    const [reason, setReason] = useState("");
    const [recommendedBy, setRecommendedBy] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [halfLeaveType, setHalfLeaveType] = useState(1);
    const [balanceLeave, setBalanceLeave] = useState(0);
    const [approver, setApprover] = useState([]);
    const [recommender, setRecommender] = useState([]);
    const [leaveTypes, setLeaveTypeList] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadToken();
    }, []);


    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [];
    for (let i = 1900; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }

    const types = [
        {id: 1, name: "First Half"},
        {id: 2, name: "Second Half"},
    ];

    const calculateTotalDays = (dateFrom, dateTo, halfDay) => {
        if (halfDay) {
            setTotalDays(0.5);
        } else {
            let count = 0;
            let currentDate = new Date(dateFrom);


            while (currentDate.getTime() <= dateTo.getTime()) {
                const dayOfWeek = currentDate.getDay();
                // if (dayOfWeek !== 6 && dayOfWeek !== 0) { // Exclude Saturdays (6) and Sundays (0)`
                //   count++;
                // }
                if (dayOfWeek !== 6) { // Exclude Saturdays (6) and Sundays (0)`
                    count++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            setTotalDays(count);
        }
    };

    const calculateTotalDaysNew = async (dateFrom, dateTo, halfDay) => {
        try {
            const response = await APIKit.get(`/LeaveRuleValidator/ValidateLeaveDaysCount`, {
                params: {
                    leaveType: leaveType,
                    fromDate: geFullDate(dateFrom),
                    toDate: geFullDate(dateTo),
                    userId: userInfo.userId,
                    isHalfDay: halfDay
                }
            });
            const totalDays = response.data;
            setTotalDays(totalDays);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to calculate total days'
            });
        }
    };


    const handleFromDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const newDateFrom = convertedDate || dateFrom;
        setShowFromPicker(false);
        setDateFrom(newDateFrom);
        calculateTotalDaysNew(newDateFrom, dateTo, isHalfDay);
    };

    const handleToDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const newDateTo = convertedDate || dateTo;
        setShowToPicker(false);
        setDateTo(newDateTo);
        calculateTotalDaysNew(dateFrom, newDateTo, isHalfDay);
    };

    const handleHalfDayToggle = () => {
        const newHalfDay = !isHalfDay;
        setIsHalfDay(newHalfDay);
        setDateTo(dateFrom);
        calculateTotalDaysNew(dateFrom, dateTo, newHalfDay);
    };

    const getEntitledLeaveCount = async (itemValue) => {
        setLeaveType(itemValue);

        const userId = userInfo.userId;
        try {
            const response = await APIKit.get(`/Leave/GetUserEntitledLeave/${userId}`);
            const leaveData = response.data;

            // Use itemValue directly instead of leaveType state
            const selectedLeave = leaveData.find(leave => leave.leaveTypeId === parseInt(itemValue));

            const leaveTypeData = leaveTypes.find(leave => leave.id === parseInt(itemValue));
            const selectedLeaveType = leaveTypeData ? leaveTypeData.name : null;

            if (!selectedLeave) {
                setBalanceLeave(0);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `${selectedLeaveType} is not available`
                });
                return;
            }

            setBalanceLeave(selectedLeave.balanceLeave);
        } catch (error) {
            console.error('Error fetching entitled leave data:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch entitled leave data'
            });
        }
    };

    const handleSubmit = async () => {
        const userId = userInfo.userId;

        if (!leaveType) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Leave type is required.'
            });
            return;
        }

        try {
            if (balanceLeave < totalDays || balanceLeave == 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Insufficient balance'
                });
                return;
            }

            if (totalDays == 0 || totalDays < 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please set total leave days'
                });
                return;
            }

            if (approvedBy == '') {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please select approver'
                });
                return;
            }

            const currentDate = new Date().toISOString();

            const leaveApplicationData = {
                leaveApplicationId: 0,
                userId: userId,
                leaveTypeId: parseInt(leaveType),
                dateFrom: dateFrom.toISOString(),
                dateTo: dateTo.toISOString(),
                appliedDate: currentDate,
                totalDays: totalDays,
                leaveReason: reason,
                approvedBy: approvedBy,
            };

            if (isHalfDay) {
                leaveApplicationData['halfLeaveType'] = halfLeaveType;
            }
            if (recommendedBy != '') {
                leaveApplicationData['recommendedBy'] = recommendedBy;
            }
            const submitResponse = await APIKit.post('/Leave/ApplyLeave', leaveApplicationData);

            if (submitResponse.data.isSuccess) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Leave application submitted successfully'
                });
                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: submitResponse.data.errorMessage
                });
            }
        } catch (error) {
            console.error('Error applying leave:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error applying leave, please try again.'
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.row}>
                    <Text style={styles.label}>Leave Type</Text>
                    <View style={styles.pickerContainer}>
                        <DropdownList onSelect={getEntitledLeaveCount} selectedType={EnumType.Leave_Type} placeholder="Select Leave Type"/>
                    </View>
                </View>
                {leaveType != '' ? (
                    <View style={styles.row}>
                        <Text style={styles.label}>Leave Balance</Text>
                        <View style={styles.balance}>
                            <Text style={styles.number}>{balanceLeave}</Text>
                        </View>
                    </View>
                ) : ('')}

                <View style={styles.row}>
                    <Text style={styles.label}>Date From</Text>
                    <NepaliCalendarPopupForTextBox onDateChange={handleFromDateChange} selectedDate={dateFrom}/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Date To</Text>
                    <NepaliCalendarPopupForTextBox onDateChange={handleToDateChange} selectedDate={dateTo}/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Total Days</Text>

                    <View style={styles.inputs}>
                        <Text style={styles.number}>{totalDays.toString()}</Text>
                        <View style={styles.half}>
                            <Checkbox value={isHalfDay} onValueChange={handleHalfDayToggle}/>
                            {isHalfDay ? (
                                <View style={styles.pickerContainers}>
                                    <Picker
                                        style={styles.input}
                                        selectedValue={halfLeaveType}
                                        onValueChange={(itemValue) => setHalfLeaveType(itemValue)}
                                    >

                                        <Picker.Item label="First Half" value="1"/>
                                        <Picker.Item label="Second Half" value="2"/>

                                    </Picker>
                                </View>
                            ) : (
                                <>

                                    <Text style={styles.halfDayLabel}>Half Day</Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}>Reason</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Enter reason"
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Recommended By</Text>
                    <View style={styles.pickerContainer}>
                        <DropdownList onSelect={setRecommendedBy} selectedType={EnumType.Recommender} placeholder="Select Recommender"/>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Approved By</Text>

                    <View style={styles.pickerContainer}>
                        <DropdownList onSelect={setApprovedBy} selectedType={EnumType.Approver} placeholder="Select Approver"/>
                    </View>
                </View>

                {/* <View style={styles.buttonRow}>
          <Button title="Close" onPress={() => console.log("Close pressed")} />
          <Button title="Submit" onPress={handleSubmit} />
        </View> */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={styles.buttonSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "rgba(0,0,255,0.05)",
        flex: 1,
        borderRadius: 10,

    },
    scrollContainer: {
        padding: 10,
        // backgroundColor: "#fff",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        flex: 2,
        height: 40,
        borderColor: "black",
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
        color: "black",

    },
    inputs: {
        justifyContent: "flex-start",
        flexDirection: "row",
        width: "67.5%",
    },
    balance: {
        justifyContent: "flex-start",
        flexDirection: "row",
        width: "67.5%",
        fontSize: 20,
    },
    number: {
        fontWeight: "bold",
        fontSize: 15,
    },

    half: {
        flexDirection: "row",
        marginLeft: 10,
    },

    total: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
        color: "black",
        flex: 2,
    },
    datePicker: {
        flex: 2,
        height: 40,
        justifyContent: "center",
        paddingLeft: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfDayLabel: {

        fontSize: 16,
        marginLeft: 8,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
        borderColor: "#ccc",
    },
    buttonClose: {
        backgroundColor: "rgba(255,0,0,0.8)",
        padding: 10,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
    },
    buttonSubmit: {
        backgroundColor: "#000080",
        padding: 10,
        borderRadius: 20,
        flex: 1,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    pickerContainer: {
        width: "67.5%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: "center",
    },
    pickerContainers: {
        width: "91%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: "center",
        marginLeft: 10,
        marginRight: -50,
    },
});

export default ApplyLeaveScreen;
