import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import APIKit, {loadToken} from '../../shared/APIKit';
import {listApproverRecommender, geFullDate} from '../../utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AuthContext} from '../../context/AuthContext';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import DropdownList from '../../components/DropdownList';
import { EnumType } from '../../components/EnumType';
import NepaliCalendarPopupForTextBox from "../../components/NepaliCalendarPopupForTextBox";

const ApplyOverTimeScreen = ({navigation}) => {
    const [dateOvertime, setDate] = useState(new Date());
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [workedHours, setWorkedHours] = useState('');
    const [overtimeType, setOvertimeType] = useState('');
    const [requestedHour, setRequestedHour] = useState(0);
    const [requestedMinute, setRequestedMinute] = useState(0);
    const [reason, setReason] = useState('');
    const [recommendedBy, setRecommendedBy] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [approver, setApprover] = useState([]);
    const [recommender, setRecommender] = useState([]);
    const {userInfo} = useContext(AuthContext);
    const [showPicker, setShowPicker] = useState(false);
    const userId = userInfo.userId;
    const hours = Array.from({ length: 13 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    useEffect(() => {
        loadToken();
    }, []);


    const fetchAttendanceData = async(currentDate) => {
        try {
            const newDate = geFullDate(currentDate);
            const response = await APIKit.get(
        `/AttendanceLog/GetPersonalAttendanceDetail/${userId}/${newDate}/${newDate}`
        );
            const responseData = response.data;

            //Extract required fields and format date

            const item = responseData[0]; // Assuming responseData is an array with a single item

            const formattedData = {
                status: item.status,
                checkIn: item.checkIn ? item.checkIn.substring(0, 5) : "",
                checkOut: item.checkOut ? item.checkOut.substring(0, 5) : "",
                workedHours: item.worked ? item.worked : '',
            };

            setCheckIn( formattedData.status == 'Present' ? formattedData.checkIn : '');
            setCheckOut(formattedData.status == 'Present' ? formattedData.checkOut : '');
            setWorkedHours(formattedData.status == 'Present' ? formattedData.workedHours : '');
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            //
        }
    };


    const handleDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const currentDate = convertedDate || dateOvertime;
        setShowPicker(false);
        setDate(currentDate);
        fetchAttendanceData(currentDate);
    };


    const handleApply = async () => {
        const userId = userInfo.userId;

        try {
            if (!dateOvertime) {
                Toast.show({
                    type: 'error',
                    text1: 'Select date to apply overtime'
                });
                return;
            }

            if(dateOvertime){
                const inputDate = new Date(dateOvertime);
                console.log(inputDate);
                const today = new Date();
                // Remove the time part for today's date if you want to compare only the date part
                // today.setHours(0, 0, 0, 0);

                if (inputDate > today) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Can\'t apply for future date'
                    });
                    return;
                }
            }

            if (!workedHours) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Worked hours is needed before applying overtime'
                });
                return;
            }

            if (!overtimeType) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Select overtime shift'
                });
                return;
            }

            if (!requestedHour || !requestedMinute) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Request hour/minute is needed'
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

            // Update the hour and minute
            dateOvertime.setUTCHours(requestedHour);
            dateOvertime.setUTCMinutes(requestedMinute);

            const overTimeData = {
                userId: userId,
                date: dateOvertime,
                overtimeType: overtimeType,
                requestedDateTime: dateOvertime,
                reason: reason,
                approvedBy: approvedBy,
                recommendedBy: recommendedBy ? recommendedBy : null,
                overTimeApplicationId: 0,
            };

            const submitResponse = await APIKit.post('/overtime/ApplyOvertime', overTimeData);

            if (submitResponse.data.isSuccess) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Overtime application submitted successfully'
                });
                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: submitResponse.data.message
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error applying ' + error
            });
        }
    };

    const onClose = () => {
        // Handle close action here
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <NepaliCalendarPopupForTextBox onDateChange={handleDateChange} selectedDate={dateOvertime}/>
        </View>

        <View style={styles.formGroup}>
        <Text style={styles.label}>Time log</Text>
        <View  style={styles.inputs}>
        <TextInput
        style={styles.input}
        value={checkIn}
        aria-disabled={true}
        />
        <TextInput
        style={styles.input}
        value={checkOut}
        aria-disabled={true}
        />
        </View>
        </View>

        <View style={styles.formGroup}>
        <Text style={styles.label}>Log Hours</Text>
        <TextInput
        style={styles.input}
        value={workedHours}
        disabled
        />
        </View>

        <View style={styles.formGroup}>
        <Text style={styles.label}>Over Time</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setOvertimeType} selectedType={EnumType.OverTimeType} placeholder="Select OverTime"/>
        </View>
        </View>

        <View style={styles.formGroup}>
        <Text style={styles.label}>Requested   Time</Text>
        <View  style={styles.inputs}>
        <View style={styles.pickerContainerForTime}>
        <DropdownList onSelect={setRequestedHour} selectedType={EnumType.Hour} placeholder="Hour"/>
        </View>

        <View style={styles.pickerContainerForTime}>
        <DropdownList onSelect={setRequestedMinute} selectedType={EnumType.Minute} placeholder="Minute"/>
        </View>
        </View>

        </View>

        <View style={styles.formGroup}>
        <Text style={styles.label}>Reason</Text>
        <View style={styles.pickerContainer}>
        <TextInput
        value={reason}
        onChangeText={setReason}
        />
        </View>
        </View>

        <View style={styles.formGroup}>
        <Text style={styles.label}>Recommended By</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setRecommendedBy} selectedType={EnumType.Recommender} placeholder="Select Recommender"/>
        </View>
        </View>
        <View style={styles.formGroup}>
        <Text style={styles.label}>Approved By</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setApprovedBy} selectedType={EnumType.Approver} placeholder="Select Approver"/>
        </View>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleApply}>
        <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        </View>

        </ScrollView>
        </KeyboardAvoidingView>
        );
    };

    const styles = StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: 'rgba(0,0,255,0.05)',
            borderRadius: 10,
            flex: 1,
            // borderWidth: 1,
            },
            pickerContainer: {
                width: "67.5%",
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 4,
                justifyContent: "center",
                },
                 pickerContainerForTime: {
                width: "50%",
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 4,
                justifyContent: "center",
                },
                header: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    textAlign: 'center',
                    },
                    row: {
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 15,
                        },
                        formGroup: {
                            marginBottom: 15,
                            flexDirection: 'row',

                            },
                            label: {
                                fontSize: 16,
                                color: '#333',
                                marginBottom: 5,
                                flex: 1,
                                fontWeight: 'bold',
                                },
                                input: {
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                    padding: 10,
                                    fontSize: 14,
                                    flex: 2,
                                    },
                                    inputs:{
                                      paddingHorizontal:0,
                                      marginLeft:-10,
                                      flex: 2,
                                      flexDirection:'row',
                                      },
                                      picker: {
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 5,
                                        padding: 10,
                                        fontSize: 14,
                                        backgroundColor: '#fff',
                                        flex: 2,

                                        },
                                        buttonContainer: {
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginTop: 20,
                                            },
                                            submitButton: {
                                                backgroundColor: '#000080',
                                                paddingVertical: 10,
                                                paddingHorizontal: 20,
                                                borderRadius: 20,
                                                width: '48%',
                                                },
                                                closeButton: {
                                                    backgroundColor: 'red',
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 20,
                                                    borderRadius: 20,
                                                    width: '48%',
                                                    },
                                                    buttonText: {
                                                        color: '#fff',
                                                        fontSize: 18,
                                                        textAlign: 'center',
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
                                                            });

                                                            export default ApplyOverTimeScreen;
