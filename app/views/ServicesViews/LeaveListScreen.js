import React, {useState, useEffect, useContext} from "react";
import {Text, View, RefreshControl, ActivityIndicator,Button, TouchableOpacity, StyleSheet, FlatList} from "react-native";

import {AuthContext} from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import APIKit, {loadToken} from "../../shared/APIKit";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {useModuleName} from "../../utils/hooks/useModuleName";
import {fetchUserList} from "../../utils/apiUtils";
import UserPicker from "../../components/UserPicker";
import UserDropdown from "../../components/UserDropdown";
import AttendanceYearDropdown from "../../components/AttendanceYearDropdown";

const LeaveListScreen = ({navigation, route}) => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isAD, setIsAD] = useState(null);
    const [users, setUsers] = useState([]);
    const moduleName = useModuleName();
    const {userInfo} = useContext(AuthContext);
    const userId = userInfo.userId;

    useEffect(() => {
        loadToken();
        if (moduleName === "DashboardAdmin") {
            setSelectedUser(userId);
        }
    }, [moduleName]);


    const fetchLeaveData = async (userId) => {
        try {
             setIsLoading(true);
            const response = await APIKit.get(
        `/Leave/GetUserLeaveList/${userId}/${fromDate}/${toDate}`
        );
            const leaveData = response.data;
            //Filter only 'Present' status records
            const filteredLeaveData = leaveData.filter(
                (item) => item.userId === userId
                );
            setLeaves(filteredLeaveData);
        } catch (error) {
            console.error("Error fetching leave data:", error);
        } finally {
            setRefreshing(false);
             setIsLoading(false);
        }
    };

    const renderItem = ({item}) => {
        return (
            <LeaveCard
            name={item.u_FirstName + ' ' + item.u_LastName}
            totalDays={item.totalDays}
            halfLeave = {item.halfLeaveType}
            appliedDate={item.appliedDate}
            dateFrom={item.dateFrom}
            dateTo={item.dateTo}
            leaveName={item.leaveName}
            isApproved={item.isApproved}
            isRecommended={item.isRecommended}
            approveReject={item.approveReject}
            recommendReject={item.recommendReject}
            leaveReason={item.leaveReason}
            startTime=""
            endTime=""
            requestedTime=""
            approver={item.a_FirstName + ' ' + item.a_LastName}
            isBS = {!isAD}
            />
            );
    };

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleButtonClick = () => {
        setIsLoading(true);
        fetchLeaveData(selectedUser || userId,).finally(() => {
            setRefreshing(false);
            setFirstLoad(false);
        });

    };

   
    
 return (
  <View style={styles.container}>
    <AttendanceYearDropdown
      onFromDate={setFromDate}
      onToDate={setToDate}
      onIsAD={setIsAD}
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <UserDropdown onSelect={handleSelectUser} selectedValue={selectedUser} placeholder="Select a user" />
      <Button style={{ flex: 1, height: 50, marginHorizontal: 5 }} title="Search" onPress={handleButtonClick} />
    </View>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    ) : (
      <View style={{ flex: 1 }}> 
        {leaves.length > 0 ? (
          <FlatList
            data={leaves}
            renderItem={renderItem}
            keyExtractor={(item) => item.leaveApplicationId.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}  
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>{firstLoad ? "Search" : "No data available"}</Text>
          </View>
        )}
      </View>
    )}
    <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ApplyLeave")}>
      <FontAwesome5 name="plus" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

};



const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex instead of height 100% to allow proper layout
    position: 'relative',
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,255,0.05)',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#05044a',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
export default LeaveListScreen;
