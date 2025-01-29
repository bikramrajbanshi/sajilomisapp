import React, { useState, useEffect, useContext } from "react";
import { Text, View, RefreshControl, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { useRoute } from '@react-navigation/native';
import { AuthContext } from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import APIKit, { loadToken } from "../../shared/APIKit";
import {getTodayFullDate} from "../../utils";

const UpcomingLeaveListScreen = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.userId;
  const route = useRoute();
  const { startDate } = route.params;

  useEffect(() => {
    loadToken();
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      console.log(startDate);
      const date = startDate ? startDate : getTodayFullDate();
      const response = await APIKit.get(
        `/leave/GetUpcomingLeaveList/${date}`
      );
      const leaveData = response.data;
      // console.log(leaveData);
      setLeaves(leaveData);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <LeaveCard
          name={item.u_FirstName + ' ' + item.u_LastName}
          totalDays={item.totalDays}
          appliedDate={item.appliedDate}
          dateFrom={item.dateFrom}
          dateTo={item.dateTo}
          leaveName={item.leaveName}
          isApproved={item.isApproved}
          leaveReason={item.leaveReason}
          approver={item.a_FirstName + ' ' + item.a_LastName}
      />
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaveData();
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
     {leaves.length > 0 ?(
        <FlatList
          data={leaves}
          renderItem={renderItem}
          keyExtractor={(item) => item.leaveApplicationId.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
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
    padding: 10,
    backgroundColor: 'white',
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
  listContent: {
    flexGrow: 1,
  }
});

export default UpcomingLeaveListScreen;
