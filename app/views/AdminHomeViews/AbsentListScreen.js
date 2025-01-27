import React, { useState, useEffect, useContext } from "react";
import {Text, View, RefreshControl, ActivityIndicator, StyleSheet, FlatList, ScrollView, Image} from "react-native";
import { useRoute } from '@react-navigation/native';
import { AuthContext } from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import APIKit, { loadToken } from "../../shared/APIKit";
import {getTodayFullDate} from "../../utils";

const AbsentListScreen = () => {
  const [absentList, setAbsentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.userId;
  const route = useRoute(); // Access route params
   const { startDate } = route.params;
  useEffect(() => {
    loadToken();
    fetchAbsentListData();
  }, []);

  const fetchAbsentListData = async () => {
    try {

      const date = startDate ? startDate : getTodayFullDate();
      const response = await APIKit.get(
        `/AttendanceLog/GetDailyAttendanceReport/${date}`
      );
      const absentListData = response.data;

      const filteredAbsentListData = absentListData.filter(
          (item) => item.status === 'Absent' && item.weekend != 'Yes'  && item.holiday == 'No'
              && (item.leave == null || item.leave == '')
              && (item.officeVisit == null || item.officeVisit == '')
      );

      setAbsentList(filteredAbsentListData);
    } catch (error) {
      console.error("Error fetching absent list data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const employee = item.name;
    const userId = item.userId;
    const department = item.departmentName; // Adjust if different column needed

    const formattedEmployee = employee.includes(" ") ? employee.replace(" ", "\n") : employee;

    return (
        <View style={styles.row}>
         <Text
          style={[styles.cell, styles.nameCell]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {employee}({userId})
        </Text>
          <Text style={styles.cell}>{department}</Text>
        </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAbsentListData();
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
       {absentList.length > 0 ?(
      <ScrollView horizontal>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Employee</Text>
            <Text style={styles.headerText}>Department</Text>
          </View>
          <FlatList
              data={absentList}
              renderItem={renderItem}
              keyExtractor={(item) => item.userId.toString()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
          />
        </View>
      </ScrollView>
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
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
        color: "#000",
        paddingHorizontal: 10,
        minWidth: 184,
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
        // justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginHorizontal: 0,
      },
     cell: {
        minWidth: 184,
        fontSize: 14,
        textAlign: "left",
        color: "#333",
        paddingHorizontal: 5,
      },

});

export default AbsentListScreen;
