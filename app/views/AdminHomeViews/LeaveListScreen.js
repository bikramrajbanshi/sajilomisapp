import React, { useState, useEffect, useContext } from "react";
import {Text, View, RefreshControl, ActivityIndicator, StyleSheet, FlatList, ScrollView, Image} from "react-native";
import { useRoute } from '@react-navigation/native';
import { AuthContext } from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import APIKit, { loadToken } from "../../shared/APIKit";
import {getTodayFullDate, geFullDate} from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LeaveListScreen = () => {
  const route = useRoute(); // Access route params
  const [leaveList, setLeaveList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAD, setIsAD] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.userId;
  const { startDate } = route.params;

  useEffect(() => {
    loadToken();
    fetchLeaveListData();
  }, []);

  const fetchLeaveListData = async () => {
    try {
      let clientDetail = await AsyncStorage.getItem("clientDetail");
      clientDetail = JSON.parse(clientDetail);
      clientDetail.useBS ? setIsAD(false) : setIsAD(true);
      const date = startDate ? startDate : getTodayFullDate();
      const response = await APIKit.get(
    `/AttendanceLog/GetDailyAttendanceReport/${date}`
    );
      const leaveListData = response.data;
      // console.log(leaveListData);
      const filteredLeaveListData = leaveListData.filter(
        (item) => item.leave != null
        );
      console.log(filteredLeaveListData);
      setLeaveList(filteredLeaveListData);
    } catch (error) {
      console.error("Error fetching leave list data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const date = startDate ? geFullDate(startDate, !isAD) : geFullDate(getTodayFullDate(), !isAD);
    const employee = item.name+"(" + item.userId + ")";
    const department = item.departmentName;
    const leavename = item.leave;
    const halfLeaveType = item.halfLeaveType != null ? item.halfLeaveType : "";
    const formattedEmployee = employee.includes(" ") ? employee.replace(" ", "\n") : employee;

    return (
      <View style={styles.row}>
      <Text style={styles.cell}>{date}</Text>
      <Text style={styles.cellName}>{formattedEmployee}</Text>
      <Text style={styles.cell}>{leavename}</Text>
      <Text style={styles.cell}>{halfLeaveType}</Text>

      </View>
      );
    };

    const onRefresh = () => {
      setRefreshing(true);
      fetchLeaveListData();
      setRefreshing(false);
    };

    if (isLoading) {
      return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
      </View>
      );
    }

    return (
    <View style={styles.container}>
    {leaveList.length > 0 ? (
      <FlatList
      data={leaveList}
      renderItem={renderItem}
      keyExtractor={(item) => item.userId.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
        <Text style={styles.headerText}>Date</Text>
        <Text style={styles.headerTextName}>Employee</Text>
        <Text style={styles.headerText}>Leave name</Text>
        <Text style={styles.headerText}>Is Half Leave</Text>

        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      />
      ) : (
      <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No data available</Text>
      </View>
      )}

      </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "#f5f5f5",
        width: '100%',
        },
        noDataContainer:{
          flex:1,
          justifyContent:'center',
          alignItems:'center',
          width:'100%',
          },

          loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            },
            listContainer: {
              flex: 1,
              },
              header: {
                flexDirection: "row",
                paddingVertical: 10,
                backgroundColor: "lightgray",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                },
                headerText: {
                  fontSize: 14,
                  fontWeight: "bold",
                  textAlign: "left",
                  color: "#000",
                  width: '22%',
                  paddingHorizontal: 2,   
                  },
                  headerTextName: {
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "#000",
                    width: '34%',
                    paddingHorizontal: 2,
                    },

                    row: {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 4,
                      paddingVertical: 12,
                      backgroundColor: "#fff",
                      borderBottomWidth: 1,
                      borderBottomColor: "#ddd",
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.41,
                      },
                      cell: {
                        width: '22%',
                        fontSize: 13,
                        textAlign: "left",
                        color: "#333",
                        paddingHorizontal: 2,
                        },
                        cellName: {
                          width: '34%',
                          fontSize: 13,
                          textAlign: "left",
                          color: "#333",
                          paddingHorizontal: 2,
                          },
                          });

                          export default LeaveListScreen;
