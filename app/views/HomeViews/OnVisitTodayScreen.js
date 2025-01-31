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
import { getTodayFullDate, geFullDate } from "../../utils";
import APIKit, { loadToken } from "../../shared/APIKit";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const OnVisitTodayScreen = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isAD, setIsAD] = useState(false);
    const { userInfo } = useContext(AuthContext);
    const userId = userInfo.userId;

    useEffect(() => {
        loadToken();
        fetchOfficeVist();
    }, []);

    const fetchOfficeVist = async () => {
        console.log("id", userId);
        try {
            let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail);
            clientDetail.useBS ? setIsAD(false) : setIsAD(true);
            const startDate = getTodayFullDate();
            const response = await APIKit.get(
        `/OfficialVisit/GetUpcomingOfficialVisitList/${startDate}`
        );
            const responseData = response.data;
            console.log("data", responseData);
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

    const renderItem = ({ item, index }) => {
        const date = geFullDate(getTodayFullDate(), !isAD);
        const employee = `${item.u_FirstName} ${item.u_LastName} (${item.userId})`;
        const officevisitname = item.officialVisitName;
        const halfLeaveType = item.halfLeaveType != null ? item.halfLeaveType : "";
        const formattedEmployee = employee.includes(" ") ? employee.replace(" ", "\n") : employee;

        return (
            <View style={styles.row}>
            <Text style={styles.cell}>{date}</Text>
            <Text style={styles.cellName}>{formattedEmployee}</Text>
            <Text style={styles.cell}>{officevisitname}</Text>
            <Text style={styles.cell}>{halfLeaveType}</Text>
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
        <View>
        <View style={styles.header}>
        <Text style={styles.headerText}>Date</Text>
        <Text style={styles.headerTextName}>Employee</Text>
        <Text style={styles.headerText}>Visit name</Text>
        <Text style={styles.headerText}>Is Half Visit</Text>
        </View>
        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.officialVisitId.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        />
        </View>
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

                                    export default OnVisitTodayScreen;
