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
import { EnumType } from '../../components/EnumType';
import {AuthContext} from "../../context/AuthContext";
import {listApproverRecommender} from "../../utils";
import APIKit, {loadToken} from "../../shared/APIKit";
import Toast from "react-native-toast-message";
import NepaliCalendarPopupForTextBox from "../../components/NepaliCalendarPopupForTextBox";

const ApplyOfficeVisitScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);
    const [officialVisitNameId, setOfficialVisitNameId] = useState(0);
    const [countryId, setCountryId] = useState(0);
    const [place, setPlace] = useState("");
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [totalDays, setTotalDays] = useState(1);
    const [officialVisitReason, setOfficialVisitReason] = useState("");
    const [recommendedBy, setRecommendedBy] = useState(0);
    const [approvedBy, setApprovedBy] = useState(0);
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [halfLeaveType, setHalfLeaveType] = useState(1);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [approver, setApprover] = useState([]);
    const [recommender, setRecommender] = useState([]);
    const [officialVisitTypes, setOfficialVisitTypeList] = useState([]);

    useEffect(() => {
        loadToken();
        getApproverRecommmender();
        getOfficialVisitType();

    }, []);

    const getOfficialVisitType = async () => {
        try {
            const response = await APIKit.get(`/OfficialVisit/GetOfficialVisitNameList`);
            const officialVisitTypes = response.data.map((item) => ({
                id: item.officialVisitNameId,
                name: item.officialVisitName
            }));

            setOfficialVisitTypeList(officialVisitTypes);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch leave type'
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

        if (!officialVisitNameId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Official visit type is required.'
            });
            return;
        }

        try {
            if (totalDays == 0 || totalDays < 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please set total leave days'
                });
                return;
            }

            if ( approvedBy == '') {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please select approver'
                });
                return;
            }

            const currentDate = new Date().toISOString();

            const officialVisitData = {
                officialVisitId: 0,
                userId: userId,
                officialVisitNameId: parseInt(officialVisitNameId),
                countryId: countryId,
                place: place,
                dateFrom: dateFrom.toISOString(),
                dateTo: dateTo.toISOString(),
                appliedDate: currentDate,
                totalDays: totalDays,
                officialVisitReason: officialVisitReason,
                approvedBy: approvedBy
            };
            console.log(officialVisitData);

            if (isHalfDay) {
                officialVisitData['halfLeaveType'] = halfLeaveType;
            }

            if (recommendedBy != '') {
                officialVisitData['recommendedBy'] = recommendedBy;
            }

            console.log(officialVisitData);
            const submitResponse = await APIKit.post('/OfficialVisit/ApplyOfficialVisit', officialVisitData);
            console.log(submitResponse);

            if (submitResponse.data.isSuccess) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Official visit application submitted successfully'
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
            console.error('Error applying leave:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error applying leave, please try again.'
            });
        }
    };

    const handleFromDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const currentDate = convertedDate || dateFrom;
        setShowFromPicker(false);
        setDateFrom(currentDate);
        console.log("fromdate",currentDate)
        calculateTotalDays(currentDate, dateTo, isHalfDay);
    };

    const handleToDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        const currentDate = convertedDate || dateTo;
        setShowToPicker(false);
        setDateTo(currentDate);
        console.log("todate",currentDate)
        calculateTotalDays(dateFrom, currentDate, isHalfDay);
    };

    const calculateTotalDays = (from, to, halfDay) => {
        if (halfDay) {
            setTotalDays(0.5);
        } else {
            console.log(from);
            console.log(to);
            from.setHours(0, 0, 0, 0);
            to.setHours(0, 0, 0, 0);
            const diffInMillis = to - from;
            const diffInDays = diffInMillis / (1000 * 60 * 60 * 24) + 1;
            console.log("a",diffInDays);
            setTotalDays(diffInDays);
        }
    };

    const handleHalfDayToggle = () => {
        const newHalfDay = !isHalfDay;
        setIsHalfDay(newHalfDay);
        setDateTo(dateFrom);
        calculateTotalDays(dateFrom, dateTo, newHalfDay);
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
                    <Text style={styles.label}>Official Visit</Text>
                    <View style={styles.pickerContainer}>
                        <DropdownList onSelect={setOfficialVisitNameId} selectedType={EnumType.Office_Visit_Type} placeholder="Select Office Visit Type"/>
                    </View>
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.label}>Country</Text>
                    <View style={styles.pickerContainer}>
                        <DropdownList onSelect={setCountryId} selectedType={EnumType.Country} placeholder="Select Country"/>
                    </View>
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.label}>Place</Text>
                    <TextInput
                        style={styles.input}
                        value={place}
                        onChangeText={setPlace}
                    />
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.label}>Date From</Text>
                    <NepaliCalendarPopupForTextBox onDateChange={handleFromDateChange} selectedDate={dateFrom}/>
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.label}>Date To</Text>
                    <NepaliCalendarPopupForTextBox onDateChange={handleToDateChange} selectedDate={dateTo}/>
                </View>

                <View style={styles.formRow}>
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
                                <Text style={styles.halfDayLabel}>Half Day</Text>
                            )}
                        </View>
                    </View>
                </View>


                <View style={styles.formRow}>
                    <Text style={styles.label}>Reason</Text>
                    <TextInput
                        style={styles.input}
                        value={officialVisitReason}
                        onChangeText={setOfficialVisitReason}
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

export default ApplyOfficeVisitScreen;
