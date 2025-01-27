import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
 TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import Toast from "react-native-toast-message";
import NepaliCalendarPopupForTextBox from "../../components/NepaliCalendarPopupForTextBox";
import { AuthContext } from "../../context/AuthContext";
import APIKit, { loadToken } from "../../shared/APIKit";
import DropdownList from '../../components/DropdownList';
import { listApproverRecommender } from "../../utils";
import { EnumType } from '../../components/EnumType';

const ApplyLateInEarlyOutScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);

  const [lateInEarlyOutType, setLateInEarlyOutType] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [reason, setReason] = useState("");
  const [recommendedBy, setRecommendedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [approver, setApprover] = useState([]);
  const [recommender, setRecommender] = useState([]);

  useEffect(() => {
    loadToken();
  }, []);

  const handleFromDateChange = (selectedDate) => {
    const convertedDate = new Date(selectedDate);
    const currentDate = convertedDate || dateFrom;
    setShowFromPicker(false);
    setDateFrom(currentDate);
  };

  const lateInEarlyOutTypeArray = [
    { id: 1, name: "late In" },
    { id: 2, name: "Early Out" },
  ];

  const handleSubmit = async () => {
    const userId = userInfo.userId;

    if (!lateInEarlyOutType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select type",
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

    const typeName = lateInEarlyOutTypeArray.find(
      (type) => type.id === parseInt(lateInEarlyOutType)
    );

    try {
      const currentDate = new Date().toISOString();
      const lateInEarlyOutData = {
        userId: userId,
        typeId: parseInt(lateInEarlyOutType),
        typeLateInEarlyOut: typeName.name,
        date: dateFrom.toISOString(),
        appliedDate: currentDate,
        reason: reason,
        isPosted: true,
        approvedBy: parseInt(approvedBy),
      };

      if (recommendedBy != '') {
        lateInEarlyOutData['recommendedBy'] = parseInt(recommendedBy);
      }

      console.log(lateInEarlyOutData);

      const submitResponse = await APIKit.post(
        "/LateInEarlyOut/ApplyLateInEarlyOut",
        lateInEarlyOutData
      );

      if (submitResponse.data.isSuccess) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `${typeName.name} applied successfully`,
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: submitResponse.data.errorMessage,
        });
      }
    } catch (error) {
      console.error("Error applying:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Error applying ${typeName.name}, please try again.`,
      });
    }
  };

  return (
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
          <Text style={styles.label}>Late In Early out</Text>
          <View style={styles.pickerContainer}>
          <DropdownList onSelect={setLateInEarlyOutType} selectedType={EnumType.LateInEarlyOut} placeholder="Select LateIn Type"/>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Date</Text>
          <NepaliCalendarPopupForTextBox onDateChange={handleFromDateChange} selectedDate={dateFrom}/>
        </View>

        <View style={styles.formRow}>
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
      flex: 1,
      padding:10,
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
    input: {
      flex: 2,
      height: 40,
      borderWidth: 1,
      borderColor: "#ccc",
      paddingLeft: 8,
      borderRadius: 4,
    },
    picker: {
      flex: 2,
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
      fontSize:18,
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
     inputs:{
          justifyContent:"flex-start",
          flexDirection: "row",
          width:"67.5%",
      },

      half:{
      flexDirection: "row",
      marginLeft:10,
      },

      total:{
       height: 40,
       borderColor: "#ccc",
       borderWidth: 1,
       paddingLeft: 8,
       borderRadius: 4,
       color: "black",
       width:"58%",
      },
     pickerContainer: {
          width:"67.5%",
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 4,
          justifyContent: "center",
        },
});

export default ApplyLateInEarlyOutScreen;
