import React, { useState, useEffect, useContext } from "react";
import {Text, View, RefreshControl, ActivityIndicator, StyleSheet, FlatList, ScrollView, Image} from "react-native";
import { useRoute } from '@react-navigation/native';
import { AuthContext } from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import APIKit, { loadToken } from "../../shared/APIKit";
import {getTodayFullDate} from "../../utils";

const PresentListScreen = () => {
  const route = useRoute(); // Access route params
  const [presentList, setPresentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.userId;
  const { startDate } = route.params;

  useEffect(() => {
    loadToken();
    fetchPresentListData();
  }, []);

  const fetchPresentListData = async () => {
    try {
      if(startDate == null)
      {
        const currentDate = getTodayFullDate();
        const response = await APIKit.get(
          `/home/GetUserPresentToday/${currentDate}`
        );
        const presentListData = response.data;
        setPresentList(presentListData);
      }
      else
      {
        const currentDate = getTodayFullDate();
        const response = await APIKit.get(
          `/home/GetUserPresentToday/${startDate}`
        );
        const presentListData = response.data;
        setPresentList(presentListData);
      }
      
    } catch (error) {
      console.error("Error fetching present list data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const userId = item.userId;
    const employee = `${item.firstName} ${item.lastName}`;
    const department = item.department; // Adjust if different column needed
    const checkIn = item.inAttendanceTime;
    const checkOut = item.outAttendanceTime;
    const worked = formatWorkedTime(item.inAttendanceTime, item.outAttendanceTime);
    const formattedEmployee = employee.includes(" ") ? employee.replace(" ", "\n") : employee;

    return (
        <View style={styles.row}>
          <Text style={styles.cell}>{employee}({userId})</Text>
          <Text style={styles.cell}>{department}</Text>
          <Text style={styles.cell}>{checkIn}</Text>
          <Text style={styles.cell}>{checkOut}</Text>
          <Text style={styles.cell}>{worked}</Text>

        </View>
    );
  };


  function formatWorkedTime(checkIn, checkOut) {
    if (!checkIn || !checkOut) return "";

    const checkInTime = new Date(`1970-01-01T${checkIn}`);
    const checkOutTime = new Date(`1970-01-01T${checkOut}`);

    const diff = checkOutTime - checkInTime;

    if (diff < 0) return ""; 

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    let result = "";
    if (hours > 0) {
        result += `${hours} hr${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0 || hours > 0) {
        if (hours > 0) result += " "; 
        result += `${minutes} min`;
    }

    return result || ""; 
}

  const onRefresh = () => {
    setRefreshing(true);
    fetchPresentListData();
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
      {presentList.length > 0 ?(
      <ScrollView horizontal>
          <FlatList
              data={presentList}
              renderItem={renderItem}
              keyExtractor={(item) => item.userId.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
              <View style={styles.header}>
                          <Text style={styles.headerText}>Employee</Text>
                          <Text style={styles.headerText}>Department</Text>
                          <Text style={styles.headerText}>Check In</Text>
                          <Text style={styles.headerText}>Check Out</Text>
                          <Text style={styles.headerText}>Worked Hour</Text>
                        </View>
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
          />
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
      width: 120,
    },

    row: {
      flexDirection: "row",
      marginVertical: 4,
      paddingVertical: 12,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      borderRadius: 8,
      alignItems: "left",
      justifyContent: "left",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      marginHorizontal: 0,
    },
   cell: {
      width: 120,
      fontSize: 14,
      textAlign: "left",
      color: "#333",
      paddingHorizontal: 5,
    },
});

export default PresentListScreen;
