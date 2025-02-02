import React, { useState, useEffect } from 'react';
import { View, Text,TouchableOpacity, Modal, FlatList,  StyleSheet , TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import APIKit, {loadToken} from "../shared/APIKit";
import {findNepaliDate,getCurrentNepaliMonthAttendanceId, getCurrentAttendanceYearId, getCurrentMonthId, geFullDate } from "../utils";
import {getAttendanceYearAndMonth} from '../utils/apiUtils'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';


const AttendanceYearMonthDropdown = ({
  onFromDate,
  onToDate,
  onIsAD,
}) => {
  const [modalVisibleType, setModalVisibleType] = useState(false);
  const [modalVisibleYear, setModalVisibleYear] = useState(false);
  const [modalVisibleMonth, setModalVisibleMonth] = useState(false);
  const [isAD, setIsAD] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermYear, setSearchTermYear] = useState('');
  const [searchTermMonth, setSearchTermMonth] = useState('');
  const [monthList, setMonthList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [selectedDateType, setSelectedDateType] = useState(null);
  const [selectedDateYear, setSelectedDateYear] = useState(null);
  const [selectedDateMonth, setSelectedDateMonth] = useState(null);
  const [yearTypeList, setYearTypeList] = useState([]);

  
  useEffect(() => {
    const getcurrentyear = async () => {

      const fetchyearTypeList = [
        { id: 1, name: 'BS' },
        { id: 2, name: 'AD' },
      ];
      setYearTypeList(fetchyearTypeList);
      let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail); // Parse the string into a JSON object
            const dateType = fetchyearTypeList.find(item => 
              clientDetail.useBS ? item.name === "BS" : item.name === "AD"
              );
            setSelectedDateType(dateType);
            clientDetail.useBS ? setIsAD(false) : setIsAD(true);
            const responseData = await getAttendanceYearAndMonth();

            setYearData(responseData);
            const years = responseData.map(year => ({
              id: year.attendanceYearId,
              name: year.attendanceYearName
            }));
            setYearList(years);
            const currentYearId = getCurrentAttendanceYearId(responseData);
            const currentAttendanceYear = years.find(year => year.id === currentYearId);
            setSelectedDateYear(currentAttendanceYear);
            const currentAttendanceYearMonths = responseData.find(year => year.attendanceYearId === currentYearId);
            const months = currentAttendanceYearMonths ? currentAttendanceYearMonths.attendanceMonths : [];
            
            setMonthData(months);

            const isAD = !clientDetail.useBS;
            const filteredMonths = months.filter(item => item.isAD === isAD);
            const currentAttendanceYearMonthId = getCurrentMonthId(months, isAD);
            const FromDate = months.find(x => x.attendanceYearMonthId === currentAttendanceYearMonthId)?.monthStartDate;
            const ToDate = months.find(x => x.attendanceYearMonthId === currentAttendanceYearMonthId)?.monthEndDate;

            onFromDate(geFullDate(FromDate));
            onToDate(geFullDate(ToDate));
            clientDetail.useBS ? onIsAD(false) : onIsAD(true);
            setSelectedDateMonth(filteredMonths.find(month => month.attendanceYearMonthId === currentAttendanceYearMonthId));
            setMonthList(filteredMonths);
          };
          getcurrentyear();
        }, []);
  


  const filteredYearType = yearTypeList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredYearList = yearList.filter(user =>
    user.name.toLowerCase().includes(searchTermYear.toLowerCase())
    );

  const filteredMonthList = monthList.filter(user =>
    user.monthName.toLowerCase().includes(searchTermMonth.toLowerCase())
    );

 

  
  // Handle year type change
  const handleYearTypeChange = (value) => {
    const isAdDate = value.name === "BS" ? false : true;
    const months = monthData.filter(x=>x.isAD == isAdDate);
    const currentAttendanceYearMonthId = getCurrentMonthId(months, isAdDate);
    console.log(currentAttendanceYearMonthId);
    const FromDate = months.find(x => x.attendanceYearMonthId === currentAttendanceYearMonthId)?.monthStartDate;
    const ToDate = months.find(x => x.attendanceYearMonthId === currentAttendanceYearMonthId)?.monthEndDate;
    onFromDate(geFullDate(FromDate));
    onToDate(geFullDate(ToDate));
    onIsAD(isAdDate);
    setSelectedDateMonth(months.find(month => month.attendanceYearMonthId === currentAttendanceYearMonthId));
    setIsAD(isAdDate);
    setMonthList(months);
    setSelectedDateType(value);
    setModalVisibleType(false);
  };

   // Handle year change
  const handleYearChange = (value) => {

    const id = typeof value === 'object' && value !== null ? value.id : value;
    const year = yearList.find(year => year.id === id);
    const months = yearData.find(year => year.attendanceYearId === id).attendanceMonths;
    setMonthData(months);
    const newmonth = months.find(month => month.monthId == selectedDateMonth?.monthId);
    setSelectedDateYear(year);
    setMonthList(months.filter(x=>x.isAD == isAD));
    setSelectedDateMonth(newmonth);
    onFromDate(geFullDate(newmonth.monthStartDate));
    onToDate(geFullDate(newmonth.monthEndDate));
    onIsAD(isAD);
    setModalVisibleYear(false);
  };

  // Handle month change
  const handleMonthChange = (value) => {
    const id = typeof value === 'object' && value !== null ? value.id : value;
    const a = monthList.find(month => month.attendanceYearMonthId === id);
    onFromDate(geFullDate(a.monthStartDate));
    onToDate(geFullDate(a.monthEndDate));
    onIsAD(isAD);
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
  <TouchableOpacity 
    style={styles.modalOverlay} 
    onPress={() => setModalVisibleType(false)} // Close the modal when background is touched
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
  data={filteredYearType}
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
  </TouchableOpacity>
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
<TouchableOpacity 
    style={styles.modalOverlay} 
    onPress={() => setModalVisibleYear(false)} // Close the modal when background is touched
    >
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<TextInput
style={styles.searchInput}
placeholder="Search..."
value={searchTermYear}
onChangeText={(text) => setSearchTermYear(text)}
/>
<FlatList
data={filteredYearList}
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
</TouchableOpacity>
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
 <TouchableOpacity 
    style={styles.modalOverlay} 
    onPress={() => setModalVisibleMonth(false)} // Close the modal when background is touched
    >
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<TextInput
style={styles.searchInput}
placeholder="Search..."
value={searchTermMonth}
onChangeText={(text) => setSearchTermMonth(text)}
/>
<FlatList
data={filteredMonthList}
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
</TouchableOpacity>
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
    width: '100%', // Full screen width
    height: '100%', // Full screen height
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
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

export default AttendanceYearMonthDropdown;
