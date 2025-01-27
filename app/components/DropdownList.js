import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { getLeaveTypes, getOfficialVisitType, getCountryList, getLateInEarlyOutType, getOverTimeType, getShifts, getAdvanceSalaryType } from '../utils/apiUtils'; 
import { listApproverRecommender } from '../utils/listApproverRecommender'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useModuleName} from "../utils/hooks/useModuleName";
import {AuthContext} from "../context/AuthContext";
import APIKit, {loadToken} from "../shared/APIKit";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { EnumType } from '../components/EnumType';

const DropdownList = ({ onSelect, selectedType: selectedValue, placeholder: placeholderName }) => {
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const moduleName = useModuleName();
  const {userInfo} = useContext(AuthContext);
  const userId = userInfo.userId;
  const hours = Array.from({ length: 25 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);



  useEffect(() => {
    console.log("cc", placeholderName);
    setPlaceholder(placeholderName);
    console.log(userId);
  }, [placeholderName]);

  useEffect(() => {
    loadToken();
    if (moduleName === "DashboardAdmin") {
      setIsAdmin(true);
    }
    else
    {

    }
  }, [moduleName]);

  useEffect(() => {
    console.log("bb", selectedValue);
    if(selectedValue != null)
    {
     getData(selectedValue);  
   }

 }, [selectedValue]);


  const getData = (value) => {
    switch (value) {
    //Leave Type
    case EnumType.Leave_Type:
      const loadLeaveType = async () => {
        try {
          const data = await getLeaveTypes();
          setDataList(data);
        } catch (error) {
          console.error('Error fetching leave type:', error);
        }
      };
      
      loadLeaveType();  
      break;

    //Office Visit Type
    case EnumType.Office_Visit_Type:
      const loadOfficialVisitType = async () => {
        try {
          const data = await getOfficialVisitType();
          setDataList(data);
        } catch (error) {
          console.error('Error fetching leave type:', error);
        }
      };
      
      loadOfficialVisitType();
      break;

    //Recommender
    case EnumType.Recommender:
      const getRecommmender = async () => {
        const result = await listApproverRecommender(userId);
        setDataList(result.recommender);
      };
      getRecommmender();
      break;

    //Approver
    case EnumType.Approver:
      const getApprover = async () => {
        const result = await listApproverRecommender(userId);
        setDataList(result.approver);
      };
      getApprover();
      break;

     //Approver

    //Country
    case EnumType.Country:
      const getCountry = async () => {
        const result = await getCountryList();
        setDataList(result);
        handleSelectValue({id: 125});
        setCurrent({id: 125, name:"Nepal"})
      };
      getCountry();
      break;

    //LateIn Early Out
    case EnumType.LateInEarlyOut:
      const getLateInType =  () => {
        const result = getLateInEarlyOutType();
        setDataList(result);
      };
      getLateInType();
      break;

      //OverTime
    case EnumType.OverTimeType:
      const getOverTimeTypeList =  () => {
        const result = getOverTimeType();
        setDataList(result);
      };
      getOverTimeTypeList();
      break;

       //Shift
    case EnumType.Shift:
      const getShiftList = async () => {
        const result = await getShifts();
        setDataList(result);
      };
      getShiftList();
      break;

    //Advance Payment Type
    case EnumType.AdvancePaymentType:
      const getAdvancePayment = async () => {
        const result = await getAdvanceSalaryType();
        setDataList(result);
      };
      getAdvancePayment();
      break;

    //Minute
    case EnumType.Minute:
      const minuteArray = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        name: i.toString().padStart(2, '0'), 
      }));
      setDataList(minuteArray);
      break;

     //Minute
    case EnumType.Hour:
      const hourArray = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        name: i.toString().padStart(2, '0'),
      }));
      setDataList(hourArray);
      break;
    default:
      console.log("Unknown Type");
    }
  };

  const filteredData = dataList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectValue = (id) => {
    onSelect(id.id);
    const a = dataList.find(data => data.id === id.id);
    setCurrent(a);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
    <Text style={[styles.pickerText, { flex: 1 }]}>
    {current ? current.name: placeholder}
    </Text>
    <Ionicons name="caret-down" size={20} style={{ paddingRight: 10 }} color="black"/>
    </TouchableOpacity>

  {/* Modal for searching inside picker */}
  <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
  >
  <View style={styles.modalOverlay}>
  <View style={styles.modalContent}>
  <TextInput
  style={styles.searchInput}
  placeholder="Search..."
  value={searchTerm}
  onChangeText={(text) => setSearchTerm(text)}
  />
  <FlatList
  data={filteredData}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
    style={styles.userItem}
    onPress={() => handleSelectValue({ id: item.id })}
    >
    <Text>{item.name}</Text>
    </TouchableOpacity>
    )}
  />
  </View>
  </View>
  </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButton: {
   flexDirection: "row",
   alignItems: "center",
   paddingLeft: 10,
 },
 pickerText: {
  fontSize: 15
},
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  width: '80%',
  maxHeight: '80%',
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
},
searchInput: {
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 5,
  marginBottom: 10,
  paddingLeft: 10,
},
userItem: {
  paddingVertical: 10,
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
},
});

export default DropdownList;
