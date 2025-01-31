import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { getTodayFullDate } from "../../utils";
import APIKit, { loadToken } from "../../shared/APIKit";
import { AuthContext } from "../../context/AuthContext";
import { useRoute } from '@react-navigation/native';
import LeaveCard from "../../components/LeaveCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
const UpcomingOfficialVisitScreen = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isAD, setIsAD] = useState(false);
  const route = useRoute(); // Access route params
  const { startDate } = route.params;
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.userId;

  useEffect(() => {
    loadToken();
    fetchOfficeVist();
}, []);

  const fetchOfficeVist = async () => {
        // console.log("id", userId);
    try {
        let clientDetail = await AsyncStorage.getItem("clientDetail");
      clientDetail = JSON.parse(clientDetail);
      clientDetail.useBS ? setIsAD(false) : setIsAD(true);
        const date = startDate ? startDate : getTodayFullDate();
        const response = await APIKit.get(
    `/OfficialVisit/GetUpcomingOfficialVisitList/${startDate}`
    );
        const responseData = response.data;
            // console.log("data", responseData);
        setData(responseData);
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        setIsLoading(false);
    }
};

const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOfficeVist();
    setRefreshing(false);
}, []);



const renderItem = ({ item }) => {
    return (
      <LeaveCard
      name={item.u_FirstName + ' ' + item.u_LastName}
      totalDays={item.totalDays}
      appliedDate={item.appliedDate}
      dateFrom={item.dateFrom}
      dateTo={item.dateTo}
      leaveName={item.officialVisitName}
      isApproved={item.isApproved}
      leaveReason={item.leaveReason}
      approver={item.a_FirstName + ' ' + item.a_LastName}
       isBS = {!isAD}
      />
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
    <FlatList
    data={data}
    renderItem={renderItem}
    keyExtractor={(item) => item.officialVisitId.toString()}
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
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    backgroundColor: "#e0e0e0",
                    },
                    headerText: {
                        fontSize: 16,
                        minWidth: 100,
                        fontWeight: "bold",
                        textAlign: "center",
                        paddingHorizontal: 10,
                        },
                        row: {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: 8,
                            // elevation: 1,
                            borderRadius: 3,
                            paddingVertical: 10,
                            backgroundColor: "#fff",
                            paddingHorizontal: 6,
                            borderBottomWidth: 1,
                            borderBottomColor: "#ddd",
                            },
                            cell: {
                                minWidth: 100,
                                paddingHorizontal: 5,
                                fontSize: 13,
                                textAlign: "center",
                                flexWrap: 'wrap',
                                },
                                });

                                export default UpcomingOfficialVisitScreen;
