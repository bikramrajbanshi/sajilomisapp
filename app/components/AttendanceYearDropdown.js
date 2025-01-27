import React, { useState, useEffect } from 'react';
import { View, Text,TouchableOpacity, Modal, FlatList,  StyleSheet , TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import APIKit, {loadToken} from "../shared/APIKit";
import {findNepaliDate,getCurrentNepaliMonthAttendanceId, getCurrentAttendanceYearId, getCurrentMonthId} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';


const AttendanceYearDropdown = ({
  selectedYearType,
  selectedYearId,
  selectedMonthId,
  onYearTypeChange,
  onYearChange,
  onMonthChange,
}) => {
  const [monthList, setMonthList] = useState([]);
  const [modalVisibleType, setModalVisibleType] = useState(false);
  const [modalVisibleYear, setModalVisibleYear] = useState(false);
  const [modalVisibleMonth, setModalVisibleMonth] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermYear, setSearchTermYear] = useState('');
  const [searchTermMonth, setSearchTermMonth] = useState('');
  const [yearList, setYearList] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [selectedDateType, setSelectedDateType] = useState(null);
  const [selectedDateYear, setSelectedDateYear] = useState(null);
  const [selectedDateMonth, setSelectedDateMonth] = useState(null);
  const [yearTypeList, setYearTypeList] = useState([]);
  const [isYearDataLoaded, setIsYearDataLoaded] = useState(false);



//update year data
  useEffect(() => {
  }, [monthList]);

  useEffect(() => {
    
  }, [selectedDateYear]);


  useEffect(() => {
      console.log(selectedDateMonth);
    }, [selectedDateMonth]);

 
  useEffect(() => {
    const getcurrentyear = async () => {
      const response = await APIKit.get('/AttendanceYear/GetAttendanceYearAndMonth');
      const responseData = response.data;
      setYearData(responseData);
      const years = responseData.map(year => ({
                id: year.attendanceYearId,
                name: year.attendanceYearName
            }));
      setYearList(years);
      const currentYearId = getCurrentAttendanceYearId(responseData);
      const yearValue = years.find(year => year.id === currentYearId);
      setSelectedDateYear(yearValue);
      setIsYearDataLoaded(true); 
    };
    getcurrentyear();
  }, [selectedDateType]);
  
  

  function isValidObject(a) {
    return (
        typeof a === 'object' && // Check if 'a' is an object
        a !== null &&            // Ensure 'a' is not null
        'id' in a &&             // Check if 'id' exists in 'a'
        'name' in a &&           // Check if 'name' exists in 'a'
        typeof a.id === 'number' && // Check if 'id' is a number
        typeof a.name === 'string'   // Check if 'name' is a string
        );
  }

  useEffect(() => {
    if (!isYearDataLoaded || !selectedDateYear) return;
    const getCurrentYear = async () => {
      if (!selectedDateType) return;
      let months = [];
      console.log(selectedDateYear);
      let attendanceYearMonthId = 0;
      if (selectedDateType.name === "BS") {

      // For BS, handle year selection and current year filtering
        if (isValidObject(selectedDateYear)) {

          const yearValue = yearData.find(year => year.attendanceYearId === selectedDateYear.id);
          months = yearValue ? yearValue.attendanceMonths : [];
          console.log("this is ");
          attendanceYearMonthId = getCurrentMonthId(months, false);
        } else {
          const currentAttendanceYear = yearData.find(item => item.isCurrentAttendanceYear);
          months = currentAttendanceYear ? currentAttendanceYear.attendanceMonths : [];
          attendanceYearMonthId = getCurrentNepaliMonthAttendanceId(currentAttendanceYear, false);
          console.log("BS Year Month ID:", attendanceYearMonthId);
        }

        const filteredMonthList = months.filter(item => !item.isAD);
        setMonthList(filteredMonthList);
        const a = months.find(month => month.attendanceYearMonthId === attendanceYearMonthId);
        setSelectedDateMonth(a);
      } 


      else {
      // For AD, handle year selection and default months
        if (isValidObject(selectedDateYear)) {
          const yearValue = yearData.find(year => year.attendanceYearId === selectedDateYear.id);
          months = yearValue ? yearValue.attendanceMonths : [];
        } else {
          months = yearData[0]?.attendanceMonths || [];
        }

      // Filter months and set state for AD
        const attendanceYearMonthIdAD = getCurrentNepaliMonthAttendanceId(yearData, true);
        const filteredMonthList = months.filter(item => item.isAD);
        setMonthList(filteredMonthList);
        setSelectedDateMonth(attendanceYearMonthIdAD);
        handleMonthChange(attendanceYearMonthIdAD);
      }
    };

    getCurrentYear();
  }, [selectedDateYear]);


  useEffect(() =>{

    const getDefaultYearType = async () => {
      if (yearTypeList.length > 0) {
        let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail); // Parse the string into a JSON object
            if(clientDetail.useBS == true)
            {
              const data = yearTypeList.filter(item => item.name === "BS")[0];
              handleYearTypeChange(data);
              setSelectedDateType(data);
            }
            else
            {
              const data = yearTypeList.filter(item => item.name === "AD")[0];
              handleYearTypeChange(data);
              setSelectedDateType(data);
            }
          }
        };
    getDefaultYearType(); // Run after userList is populated
  }, [yearTypeList]);


  useEffect(() => {
   const fetchyearTypeList = [
    { id: 1, name: 'BS' },
    { id: 2, name: 'AD' },
  ];
  setYearTypeList(fetchyearTypeList);

  }, []);


  // Handle year type change
  const handleYearTypeChange = (value) => {
    console.log(value);
    onYearTypeChange(value.name);
    setSelectedDateType(value);
    setModalVisibleType(false);
  };

   // Handle year change
  const handleYearChange = (value) => {
    const id = typeof value === 'object' && value !== null ? value.id : value;
    const a = yearList.find(year => year.id === id);
    setSelectedDateYear(a);
    onYearChange(id);
    setModalVisibleYear(false);
  };


  // Handle month change
  const handleMonthChange = (value) => {
    const id = typeof value === 'object' && value !== null ? value.id : value;
    const a = monthList.find(month => month.attendanceYearMonthId === id);
    onMonthChange(id);
    setSelectedDateMonth(a);
    setModalVisibleMonth(false);

  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
      {/* Year Type Picker */}

    <TouchableOpacity style={styles.pickerButtonYearType} onPress={() => setModalVisibleType(true)}>
    <Text style={[styles.pickerText, { flex: 1 }]}>
    {selectedDateType  ? selectedDateType.name : "BS or AD"}
    </Text>
    <Ionicons name="chevron-down" size={20} style={{  }} color="black"/>
    </TouchableOpacity>

  {/* Modal for searching inside picker */}
  <Modal
  visible={modalVisibleType}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisibleType(false)}
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
  data={yearTypeList}
  keyExtractor={(item) => item.name.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
    style={styles.userItem}
    onPress={() => handleYearTypeChange(item)}
    >
    <Text>{item.name}</Text>
    </TouchableOpacity>
    )}
  />
  </View>
  </View>
  </Modal>

  <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisibleYear(true)}>
  <Text style={[styles.pickerText, { flex: 1 }]}>
  {selectedDateYear ? selectedDateYear.name : "Year Name"}
  </Text>
  <Ionicons name="chevron-down" size={20} style={{  }} color="black"/>
  </TouchableOpacity>

{/* Modal for searching inside picker */}
<Modal
visible={modalVisibleYear}
animationType="slide"
transparent={true}
onRequestClose={() => setModalVisibleYear(false)}
>
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<TextInput
style={styles.searchInput}
placeholder="Search..."
value={searchTerm}
onChangeText={(text) => setSearchTermYear(text)}
/>
<FlatList
data={yearList}
keyExtractor={(item) => item.id.toString()}
renderItem={({ item }) => (
  <TouchableOpacity
  style={styles.userItem}
  onPress={() => handleYearChange({ id: item.id })}
  >
  <Text>{item.name}</Text>
  </TouchableOpacity>
  )}
/>
</View>
</View>
</Modal>

<TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisibleMonth(true)}>
<Text style={[styles.pickerText, { flex: 1 }]}>
{selectedDateMonth ? selectedDateMonth.monthName : "Month Name"}
</Text>
<Ionicons name="chevron-down" size={20} style={{  }} color="black"/>
</TouchableOpacity>

{/* Modal for searching inside picker */}
<Modal
visible={modalVisibleMonth}
animationType="slide"
transparent={true}
onRequestClose={() => setModalVisibleMonth(false)}
>
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<TextInput
style={styles.searchInput}
placeholder="Search..."
value={searchTerm}
onChangeText={(text) => setSearchTermMonth(text)}
/>
<FlatList
data={monthList}
keyExtractor={(item) => item.attendanceYearMonthId.toString()}
renderItem={({ item }) => (
  <TouchableOpacity
  style={styles.userItem}
  onPress={() => handleMonthChange({ id: item.attendanceYearMonthId })}
  >
  <Text>{item.monthName}</Text>
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
  pickerButtonYearType: {
    height: 40,
    width: '19%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  pickerButton: {
    height: 40,
    width: '38%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  pickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
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

export default AttendanceYearDropdown;
