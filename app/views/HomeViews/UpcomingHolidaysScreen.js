import React, { useState, useEffect, useContext } from "react";
import { Text, View, RefreshControl, ActivityIndicator, StyleSheet, FlatList } from "react-native";

import { AuthContext } from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import APIKit, { loadToken } from "../../shared/APIKit";
import {getTodayFullDate, geFullDate} from "../../utils";
import {ScrollView} from "react-native-gesture-handler";

const UpcomingHolidaysScreen = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.userId;

  useEffect(() => {
    loadToken();
    fetchHoliday();
  }, []);

  const fetchHoliday = async () => {
    try {
      const startDate = getTodayFullDate();
      const response = await APIKit.get(
        `/holiday/GetUpcomingHolidayListForUser/${startDate}`
      );
      const holidayData = response.data;
      // console.log(holidayData);
      setData(holidayData);
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaveData();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    return (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.holidayName}</Text>
          <Text style={styles.cell}>
             {geFullDate(item.fromDate, true)}
          </Text>
          <Text style={styles.cell}>
          {geFullDate(item.toDate, true)}
          </Text>
        </View>
    );
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
         {data.length > 0 ?(
        <ScrollView horizontal>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerText}>Holiday Name</Text>
              <Text style={styles.headerText}>From Date</Text>
              <Text style={styles.headerText}>To Date</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
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
          justifyContent: "space-between",
         paddingVertical: 12,
         backgroundColor: "lightgray",
         borderTopLeftRadius: 10,
         borderTopRightRadius: 10,
         alignItems: "center",
         marginVertical: 4,
         marginHorizontal: 0,
       },
       headerText: {
         fontSize: 16,
         fontWeight: "bold",
         textAlign: "left",
         color: "#000",
         paddingHorizontal: 10,
         minWidth: 124,
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
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 1 },
         shadowOpacity: 0.2,
         shadowRadius: 1.41,
         elevation: 2,
         marginHorizontal: 0,
       },
      cell: {
         minWidth: 124,
         fontSize: 14,
         textAlign: "left",
         color: "#333",
         paddingHorizontal: 10,
       },
});

export default UpcomingHolidaysScreen;
