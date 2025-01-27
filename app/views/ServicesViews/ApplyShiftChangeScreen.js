import React, {useContext, useState, useEffect} from "react";
import {
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    TouchableOpacity,
} from "react-native";
import {Picker} from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropdownList from '../../components/DropdownList';
import NepaliCalendarPopupForTextBox from "../../components/NepaliCalendarPopupForTextBox";
import { EnumType } from '../../components/EnumType';
import {AuthContext} from "../../context/AuthContext";
import {listApproverRecommender} from "../../utils";
import APIKit, {loadToken} from "../../shared/APIKit";
import Toast from "react-native-toast-message";
import PickerWithCheckbox from "../../components/PickerWithCheckbox";

const ApplyShiftChangeScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const[shiftNameId, setShiftNameId] = useState(0);
    const [shifts, setShifts] = useState([]);
    const [weekends,setWeekends] = useState([]);
    const [shiftChangeReason, setShiftChangeReason] = useState("");
    const [recommendedBy, setRecommendedBy] = useState(0);
    const [approvedBy, setApprovedBy] = useState(0);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [approver, setApprover] = useState([]);
    const [recommender, setRecommender] = useState([]);

    const options = [
        { label: 'Sunday', value: 'sunday' },
        { label: 'Monday', value: 'monday' },
        { label: 'Tuesday', value: 'tuesday' },
        { label: 'Wednesday', value: 'wednesday' },
        { label: 'Thursday', value: 'thursday' },
        { label: 'Friday', value: 'friday' },
        { label: 'Saturday', value: 'saturday' },
    ];

    useEffect(() => {
        loadToken();
        getApproverRecommmender();
        getShifts();
    }, []);

    const getShifts = async () => {
        try {
            const response = await APIKit.get(`/shift/GetShiftList`);
            const shifts = response.data.map((item) => ({
                id: item.shiftId,
                name: item.shiftName
            }));

            setShifts(shifts);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch shift type'
            });
        }
    };

    const types = [
        {id: 1, name: "First Half"},
        {id: 2, name: "Second Half"},
    ];
    const getApproverRecommmender = async () => {
        const result = await listApproverRecommender(userInfo.userId);

        setApprover(result.approver);
        setRecommender(result.recommender);
    };

    const handleApply = async () => {
        const userId = userInfo.userId;

        if (!shiftNameId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Shift selection is required.'
            });
            return;
        }

        try {
            if (approvedBy == '') {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please select approver'
                });
                return;
            }

            const currentDate = new Date().toISOString();

            const shiftChangeData = {
                userId: userId,
                weekends: weekends ? weekends.join(',') : '',
                shiftId: shiftNameId,
                dateFrom: dateFrom.toISOString(),
                dateTo: dateTo.toISOString(),
                appliedDate: currentDate,
                reason: shiftChangeReason,
                approvedBy: approvedBy,
                recommendedBy: recommendedBy ? recommendedBy : null,
            };
            const submitResponse = await APIKit.post('/ShiftChangeRequest/ApplyShiftChange', shiftChangeData);
            console.log(submitResponse);

            if (submitResponse.data.isSuccess) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Shift change application submitted successfully'
                });
                navigation.navigate('ShiftChange');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: submitResponse.data.message
                });
            }
        } catch (error) {
            console.error('Error applying shift change:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error applying shift change please try again.'
            });
        }
    };

    const handleFromDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const currentDate = convertedDate || dateFrom;
        setShowFromPicker(false);
        setDateFrom(currentDate);
    };

    const handleToDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const currentDate = convertedDate || dateTo;
        setShowToPicker(false);
        setDateTo(currentDate);
    };

    return (
        // <View>
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
        <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        >
        <View style={styles.formRow}>
        <Text style={styles.label}>Date From</Text>
        <NepaliCalendarPopupForTextBox onDateChange={handleFromDateChange} selectedDate={dateFrom}/>
        </View>

        <View style={styles.formRow}>
        <Text style={styles.label}>Date To</Text>
        <NepaliCalendarPopupForTextBox onDateChange={handleToDateChange} selectedDate={dateTo}/>
        </View>

        <View style={styles.formRow}>
        <Text style={styles.label}>Shifts</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setShiftNameId} selectedType={EnumType.Shift} placeholder="Shift Leave Type"/>
        </View>
        </View>

        <View style={styles.formRow}>
        <Text style={styles.label}>Weekends</Text>
        <View style={{ flex: 3 }}>
        <PickerWithCheckbox
        label="Select Weekends"
        options={options}
        selectedOptions={weekends}
        onValueChange={(values) => setWeekends(values)}
        />
        </View>
        </View>

        <View style={styles.formRow}>
        <Text style={styles.label}>Reason</Text>
        <TextInput
        style={styles.input}
        value={shiftChangeReason}
        onChangeText={setShiftChangeReason}
        />
        </View>

        <View style={styles.formRow}>
        <Text style={styles.label}>Recommended By</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setRecommendedBy} selectedType={EnumType.Recommender} placeholder="Select Recommender"/>
        </View>
        </View>

        <View style={styles.formRow}>
        <Text style={styles.label}>Approved By</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setApprovedBy} selectedType={EnumType.Approver} placeholder="Select Approver"/>
        </View>
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.buttonClose}
        >
        <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleApply} style={styles.buttonSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </View>

        </ScrollView>
        </KeyboardAvoidingView>
        // </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: "rgba(0,0,255,0.05)",
            },
            scrollContainer: {
                padding: 10,
                // backgroundColor: "#fff",
                },
                title: {
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 20,
                    },
                    formRow: {
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 15,
                        },
                        label: {
                            flex: 1,
                            fontSize: 16,
                            fontWeight: "bold",
                            },
                            halfDayLabel: {
                                marginLeft: 8,
                                fontSize: 16,

                                },
                                number: {
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    },
                                    buttonContainer: {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: 20,
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
                                                    datePicker: {
                                                        flex: 2,
                                                        height: 40,
                                                        justifyContent: "center",
                                                        paddingLeft: 8,
                                                        borderColor: "#ccc",
                                                        borderWidth: 1,
                                                        borderRadius: 4,
                                                        },
                                                        inputs: {
                                                            justifyContent: "flex-start",
                                                            flexDirection: "row",
                                                            width: "67.5%",
                                                            },

                                                            input: {
                                                                flex: 2,
                                                                height: 40,
                                                                borderColor: "#ccc",
                                                                borderWidth: 1,
                                                                paddingLeft: 8,
                                                                borderRadius: 4,
                                                                color: "black",

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

                                                                                export default ApplyShiftChangeScreen;
