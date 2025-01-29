import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import NepaliCalendar from 'react-native-nepali-calendar';
import {convertADtoBS,convertBStoAD} from 'react-native-nepali-calendar/calendarFunction';
import { Calendar as EnglishCalendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';

const NepaliCalendarPopupForTextBox = ({
  onDateChange,
  selectedDate: externalDate,
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
    const adYear = externalDate.getFullYear();
    const adMonth = externalDate.getMonth() + 1;
    const adDay = externalDate.getDate();
    const bsDate = convertADtoBS(adYear, adMonth, adDay);
    const dayOfWeek = externalDate.toLocaleDateString("en-US", { weekday: "long" });
    const formattedBSDate = `${bsDate.bsYear}-${String(bsDate.bsMonth).padStart(2, '0')}-${String(bsDate.bsDate).padStart(2, '0')}`;
    setSelectedDate(`${formattedBSDate}, ${dayOfWeek}`);
  }, [externalDate]);

  useEffect(() => {
    const getClientContext = async () => {
      let clientDetail = await AsyncStorage.getItem("clientDetail");
      clientDetail = JSON.parse(clientDetail);

      const date = new Date();

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
  }, []);


  const handleMonthChange = (year, month) => {
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
    const convertedDate = new Date(date);
    const dayOfWeek = convertedDate.toLocaleDateString("en-US", { weekday: "long" });
    setSelectedDate(`${date}, ${dayOfWeek}`);
    setModalVisible(false); // Close the modal after date selection
  };

  const handleModelClick = (da) => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
    style={styles.openButton}
    onPress={() => handleModelClick(true)}
    >
    <Text style={styles.dateText}>
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
        onMonthChange={handleMonthChange}
        
        style={{
                backgroundColor: '#f0f8ff', // Change this to your desired color
                borderRadius: 10,
              }}
              selectedDateColor="orange"
              todayColor="green"
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
              flex: 2,

              },
              openButton: {
                justifyContent: 'center',
                alignItems: 'center', 
                },
                dateDisplay: {
                  borderRadius: 5,
                  borderColor: "black",
                  borderWidth: 1,
                  },
                  dateText: {
                    color: "black",
                    borderColor: "#ccc",
                    height: 40,
                    borderWidth: 1,
                    paddingLeft: 8,
                    fontSize: 15,
                    borderRadius: 4,
                    width: "100%",
                    textAlignVertical: 'center',
                    },
                    modalContainer: {
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
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

                          export default NepaliCalendarPopupForTextBox;
