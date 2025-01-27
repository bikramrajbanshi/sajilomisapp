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
import DropdownList from '../../components/DropdownList';
import { EnumType } from '../../components/EnumType';
import {AuthContext} from "../../context/AuthContext";
import APIKit, {loadToken} from "../../shared/APIKit";
import {listApproverRecommender, geFullDate} from '../../utils';
import NepaliCalendarPopupForTextBox from "../../components/NepaliCalendarPopupForTextBox";


const ApplyAdvanceScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);

    const [advanceType, setAdvanceType] = useState('');
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [advanceDate, setAdvanceDate] = useState(new Date());
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [repaymentPeriod, setRepaymentPeriod] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [reason, setReason] = useState("");
    const [recommendedBy, setRecommendedBy] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [approver, setApprover] = useState([]);
    const [recommender, setRecommender] = useState([]);
    const [advanceTypes, setAdvanceTypesList] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadToken();
    }, []);



    const handleaAdvanceDateChange = (selectedDate) => {
        const convertedDate = new Date(selectedDate);
        setAdvanceDate(convertedDate);
    };

    const handleSubmit = async () => {
        const userId = userInfo.userId;

        if (!advanceType) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Advance type is required.'
            });
            return;
        }

        try {
            if (advanceAmount < 0 || advanceAmount == 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Advance Amount must be greater than 0'
                });
                return;
            }

            if (repaymentPeriod == 0 || repaymentPeriod < 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Repayment Period must be greater than 0'
                });
                return;
            }

            if (interestRate < 0 ) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'interestRate cannot be less than 0'
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

            const advanceRequestRequest = {
                advancePaymentRequestId: 0,
                userId: userId,
                advanceDeductionId: parseInt(advanceType),
                appliedDate: currentDate,
                advanceDate: advanceDate.toISOString(),
                amount: advanceAmount,
                repaymentPeriod: repaymentPeriod,
                intrestRate: interestRate,
                reason: reason,
                approvedBy: approvedBy,
            };

            if (recommendedBy != '') {
                advanceRequestRequest['recommendedBy'] = recommendedBy;
            }
            console.log(advanceRequestRequest);
            const submitResponse = await APIKit.post('/AdvancePaymentRequest/ApplyAdvanceRequest', advanceRequestRequest);

            if (submitResponse.data.isSuccess) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Advance Payment application submitted successfully'
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
            console.error('Error Advance Payment :', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error Advance Payment , please try again.'
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
        <Text style={styles.label}>Adavnce Type</Text>
        <View style={styles.pickerContainer}>
        <DropdownList onSelect={setAdvanceType} selectedType={EnumType.AdvancePaymentType} placeholder="Select Advance Type"/>
        </View>
        </View>
        <View style={styles.row}>
        <Text style={styles.label}>Deduction From</Text>
        <NepaliCalendarPopupForTextBox onDateChange={handleaAdvanceDateChange} selectedDate={advanceDate}/>
        </View>


        <View style={styles.row}>
        <Text style={styles.label}>Advance Amount</Text>
        <TextInput
        style={styles.input}
        value={advanceAmount}
        onChangeText={setAdvanceAmount}
        placeholder="advance Amount"
        />
        </View>


        <View style={styles.row}>
        <Text style={styles.label}>Repayment Period</Text>
        <TextInput
        style={styles.input}
        value={repaymentPeriod}
        onChangeText={setRepaymentPeriod}
        placeholder="Repayment Period"
        />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Interest Rate</Text>
        <TextInput
        style={styles.input}
        value={interestRate}
        onChangeText={setInterestRate}
        placeholder="Interest"
        />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Reason</Text>
        <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        placeholder="Reason"
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
                            borderColor: '#ccc',
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
                                        fontSize: 18,
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

                                                                                        export default ApplyAdvanceScreen;
