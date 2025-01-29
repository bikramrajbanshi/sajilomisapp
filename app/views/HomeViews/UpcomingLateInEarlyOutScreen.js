import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRoute } from '@react-navigation/native';
import APIKit, { loadToken } from "../../shared/APIKit";
import { AuthContext } from "../../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import {getTodayFullDate, geFullDate} from "../../utils";

const UpcomingLateInEarlyOutScreen = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { userInfo } = useContext(AuthContext);
    const userId = userInfo.userId;
    const route = useRoute(); // Access route params
  const { startDate } = route.params;
  
    useEffect(() => {
        loadToken();
        fetchLateInEarlyOut();
    }, []);

    const fetchLateInEarlyOut = async () => {
        try {
             const date = startDate ? startDate : getTodayFullDate();

            const response = await APIKit.get(
                `/LateInEarlyOut/GetUpcomingLateInearlyOut/${date}`
            );
            const responseData = response.data;

            // Flatten the array and extract the required fields
            const formattedData = responseData.map((item) => ({
                employee: item.u_FirstName + " " + item.u_LastName + "("+item.userId+")",
                date: geFullDate(item.date, true),
                appliedDate: geFullDate(item.appliedDate, true),
                reason: item.reason,
                recommender:
                    item.approvedBy != null
                        ? item.r_FirstName + " " + item.r_LastName
                        : "",
                approver:
                    item.approvedBy != null
                        ? item.a_FirstName + " " + item.a_LastName
                        : "",
                status: item.isApproved ? "Approved" : "Pemding",
            }));

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchLateInEarlyOut();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.cell}>{item.employee}</Text>
                <Text style={styles.cell}>{item.date}</Text>
                <Text style={styles.cell}>{item.appliedDate}</Text>
                <Text style={styles.cell}>{item.reason}</Text>
                <Text style={styles.cell}>{item.recommender != "null null" ? item.recommender : ""}</Text>
                <Text style={styles.cell}>{item.approver}</Text>
                <Text style={styles.cell}>{item.status}</Text>
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
             {data.length > 0 ? (
            <ScrollView horizontal>
                <View>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Name</Text>
                        <Text style={styles.headerText}>Late Date</Text>
                        <Text style={styles.headerText}>Date</Text>
                        <Text style={styles.headerText}>Reason</Text>
                        <Text style={styles.headerText}>Recommender</Text>
                        <Text style={styles.headerText}>Approver</Text>
                        <Text style={styles.headerText}>Status</Text>
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
        backgroundColor: "#e0e0e0",
    },
    headerText: {
        fontSize: 16,
        width: '14.28%',
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 5,
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
        width: '14.28%',
        fontSize: 13,
        textAlign: "center",
        flexWrap: "wrap",
        paddingHorizontal: 5,
    },
});

export default UpcomingLateInEarlyOutScreen;
