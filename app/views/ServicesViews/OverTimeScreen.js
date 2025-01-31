import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Button,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState, useRef} from "react";

import APIKit, {loadToken} from "../../shared/APIKit";
import {AuthContext} from "../../context/AuthContext";
import LeaveCard from "../../components/LeaveCard";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {useModuleName} from "../../utils/hooks/useModuleName";
import UserDropdown from "../../components/UserDropdown";
import AttendanceYearMonthDropdown from "../../components/AttendanceYearMonthDropdown";

const OverTimeScreen = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const {userInfo} = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const moduleName = useModuleName();
    const userId = userInfo.userId;
    const [isAD, setIsAD] = useState(null);

    useEffect(() => {
        loadToken();
        if (moduleName === "DashboardAdmin") {
            setSelectedUser(userId);
        }
    }, [moduleName]);

    const fetchOverTime = async (userId) => {
        try {
            const response = await APIKit.get(
        `/Overtime/GetFilteredOverTime/${fromDate}/${toDate}/true?userId=${userId}`
        );
            const responseData = response.data;
            // console.log(responseData);
            setData(responseData);
        } catch (error) {
            console.error("Error fetching shift change data:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderItem = ({item}) => {
        return (
            <LeaveCard
            name={item.u_FirstName + ' ' + item.u_LastName}
            totalDays=""
            appliedDate={item.appliedDate}
            dateFrom=""
            dateTo=""
            leaveName=""
            isApproved={item.isApproved}
            isRecommended={item.isRecommended}
            approveReject={item.approveReject}
            recommendReject={item.recommendReject}
            leaveReason={item.reason}
            startTime=""
            endTime=""
            requestedTime={item.requestedTime}
            approver={item.a_FirstName + ' ' + item.a_LastName}
            isBS = {!isAD}
            />
            );
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleButtonClick = () => {
        fetchOverTime(selectedUser || userId,).finally(() => {
            setRefreshing(false);
            setFirstLoad(false);
        });

    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshing(false);
    }, []);

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
            onPress={() => navigation.navigate("ApplyOverTime")}
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
})

export default OverTimeScreen;