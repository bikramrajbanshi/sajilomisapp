import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Button,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState, useRef} from "react";

import APIKit, {loadToken} from "../../shared/APIKit";
import {AuthContext} from "../../context/AuthContext";
import {ScrollView} from "react-native-gesture-handler";
import LeaveCard from "../../components/LeaveCard";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {useModuleName} from "../../utils/hooks/useModuleName";
import {fetchUserList} from "../../utils/apiUtils";
import UserPicker from "../../components/UserPicker";
import UserDropdown from "../../components/UserDropdown";
import AttendanceYearMonthDropdown from "../../components/AttendanceYearMonthDropdown";

const LateInEarlyOutScreen = ({navigation, route}) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const {userInfo} = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const moduleName = useModuleName();
    const userId = userInfo.userId;
    const [isAD, setIsAD] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const scrollViewRef = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadToken();
        if (moduleName === "DashboardAdmin") {
            setSelectedUser(userId);
        }
    }, [moduleName]);

    const fetchLateInEarlyOut = async (userId) => {
        try {
            const response = await APIKit.get(
        `/LateInEarlyOut/GetUserLateInEarlyOutList/${userId}/${fromDate}/${toDate}`
        );
            const responseData = response.data;
            const filteredLateData = responseData.filter(
                (item) => item.userId === userId && item.approveReject == null
                );
            setData(filteredLateData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderItem = ({item}) => {
        return (
            <LeaveCard
            name={item.u_FirstName + ' ' + item.u_LastName}
            totalDays={item.approvedBy != null ? item.a_FirstName + " " + item.a_LastName : ""}
            appliedDate={item.appliedDate.substring(0, 10)}
            dateFrom={item.date.substring(0, 10)}
            dateTo={item.date.substring(0, 10)}
            leaveName={item.leaveName}
            isApproved={item.isApproved}
            leaveReason={item.reason}
            approver={item.a_FirstName + ' ' + item.a_LastName}
            isBS = {!isAD}
            />
            );
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleButtonClick = () => {
        fetchLateInEarlyOut(selectedUser || userId,).finally(() => {
            setRefreshing(false);
            setFirstLoad(false);
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
        <AttendanceYearMonthDropdown
        onFromDate={setFromDate}
        onToDate={setToDate}
        onIsAD={setIsAD}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <UserDropdown onSelect={handleSelectUser} selectedValue={selectedUser} placeholder="Select a user" />
        <Button style={{flex: 1, height: 50, marginHorizontal: 5}} title="Search" onPress={handleButtonClick} />
        </View>
        {data.length > 0 ? (<FlatList
            data={data}
            renderItem={renderItem}

            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            contentContainerStyle={styles.listContent}
            />):(
            <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}> {firstLoad ? `Search` : 'No data available'}</Text>
            </View>
            )}
            <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("ApplyLateInEarlyOut")}
            >
            <FontAwesome5 name="plus" size={20} color="#fff"/>
            </TouchableOpacity>
            </View>
            );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0,0,255,0.05)',
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

export default LateInEarlyOutScreen;
