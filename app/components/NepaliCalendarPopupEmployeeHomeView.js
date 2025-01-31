import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import NepaliCalendar from 'react-native-nepali-calendar';
import {convertADtoBS,convertBStoAD} from 'react-native-nepali-calendar/calendarFunction';
import { Calendar as EnglishCalendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';

const NepaliCalendarPopupEmployeeHomeView = ({
  onDateChange,
  onReFresh : commingBool,
}) => {
  const [isBS, setIsBS] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEnglishDate, setSelectedEnglishDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedNepaliDate, setSelectedNepaliDate] = useState({
    bsYear: null,
    bsMonth: null,
    bsDay: null,
  });


  useEffect(() => {


  }, [selectedDate]);

  
  useEffect(() => {
    const getClientContext = async () => {
      let clientDetail = await AsyncStorage.getItem("clientDetail");
      clientDetail = JSON.parse(clientDetail);
      const date = new Date();
      console.log("bool",commingBool);
      if (clientDetail?.useBS === true) 
      {
        setIsBS(true);
        const adYear = date.getFullYear();
        const adMonth = date.getMonth() + 1;
        const adDay = date.getDate();
        const bsDate = convertADtoBS(adYear, adMonth, adDay);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const formattedBSDate = `${bsDate.bsYear}-${String(bsDate.bsMonth).padStart(2, '0')}-${String(bsDate.bsDate).padStart(2, '0')}`;
        setSelectedDate(`${formattedBSDate}, ${dayOfWeek}`);
      } 
      else {
        const formattedDate = date.toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        setSelectedDate(`${formattedDate}, ${dayOfWeek}`);
      }
    };
    getClientContext();
  }, [commingBool]);

  const onMonthChange = (year, month) => {
    console.log('Month Changed: ', { year, month });
  };

  const handleDateChange = (date) => {
    const adDate = date.englishDate;
    const dayOfWeek = adDate.toLocaleDateString("en-US", { weekday: "long" });
    const { bsYear, bsMonth, bsDate } = date.nepaliDate;
    const formattedBSDate = `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(bsDate).padStart(2, '0')}`;
    setSelectedDate(`${formattedBSDate}, ${dayOfWeek}`);

    const formattedEnglishDate = adDate.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    onDateChange(formattedEnglishDate); // Update selected date
    setModalVisible(false); // Close the modal after date selection
  };

  const handleEnglishDateChange = (date) => {
    onDateChange(date); 
    console.log(date);
    const convertedDate = new Date(date);
    const dayOfWeek = convertedDate.toLocaleDateString("en-US", { weekday: "long" });
    setSelectedDate(`${date}, ${dayOfWeek}`);
    setModalVisible(false); // Close the modal after date selection
  };

  const handleModelClick = (da) => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
    style={styles.openButton}
    onPress={() => handleModelClick(false)}
    >
    <Ionicons name="calendar" size={25} style={{  }} color="white"/>
    <Text style={[styles.dateText, {flex: 1}]}>
    {selectedDate ? selectedDate : "h"}
    </Text>
    </TouchableOpacity>

      {/* Modal for Calendar */}
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
    >
    <TouchableOpacity 
    style={styles.modalContainer} 
    onPress={() => setModalVisible(false)} // Close the modal when background is touched
    >
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    {
      (isBS == true) ? (
        <NepaliCalendar
        onDateChange={handleDateChange}
        onMonthChange={onMonthChange}
        renderDate={(date, isCurrentDate) => (
          <View style={[styles.date, getDateStyle(date)]}>
          <Text style={isCurrentDate ? styles.currentDateText : styles.dateTText}>
          {date}
          </Text>
          </View>
        )}
        />
        ) : (
        <EnglishCalendar
        onDayPress={(day) => handleEnglishDateChange(day.dateString)}
        markedDates={{
          [selectedEnglishDate]: {
            selected: true,
            marked: true,
            selectedColor: 'orange',
          },
        }}
        theme={{
          calendarBackground: '#f0f8ff',
          todayTextColor: 'green',
          selectedDayBackgroundColor: 'orange',
          arrowColor: 'blue',
          monthTextColor: 'purple',
          textDayFontWeight: 'bold',
        }}
        />
        )
      }

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
        },
        date: {
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          },
          dateTText: {
            color: 'black',
            },
            currentDateText: {
              fontWeight: 'bold',
              color: 'red',
              },
              openButton: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                },
                dateDisplay: {
                  borderRadius: 5,
                  },
                  dateText: {
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 16,
                    marginLeft: 10,
                    },
                    modalContainer: {
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      },
                      modalContent: {
                        width: '90%',
                        height : '40%',
                        borderRadius: 20,
                        backgroundColor: '#f0f8ff',
                        padding: 5,
                        alignItems: 'center',
                        },
                        calendar: {
                          width: '100%',
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 5,
                          },
                          });

                          export default NepaliCalendarPopupEmployeeHomeView;
