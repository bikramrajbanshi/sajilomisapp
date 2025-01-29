import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Button,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState} from "react";
import UserDropdown from "../../components/UserDropdown";
import APIKit, {loadToken} from "../../shared/APIKit";
import {AuthContext} from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserPicker from "../../components/UserPicker";
import {fetchUserList} from "../../utils/apiUtils";
import {geFullDate} from "../../utils";
import {useModuleName} from "../../utils/hooks/useModuleName";
import AttendanceYearMonthDropdown from "../../components/AttendanceYearMonthDropdown";

const DutyRosterScreen = () => {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState([]);
    const moduleName = useModuleName();
    const [firstLoad, setFirstLoad] = useState(true);
    const {userInfo} = useContext(AuthContext);
    const userId = userInfo.userId;
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isAD, setIsAD] = useState(null);

    useEffect(() => {
        loadToken();
        if (moduleName === "DashboardAdmin") {
            setIsAdmin(true);
        }

    }, [moduleName]);


    // console.log("Rooster", users);

    const fetchDutyRoster = async (userId) => {
        try {
            let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail);
            const response = await APIKit.get(
        `/DutyRoster/GetDutyRosterByFilter/${userId}/${fromDate}/${toDate}`
        );  

            const responseData = response.data;
            const relation = responseData[0].effectiveDateAndShiftRelation;
            const filteredData = relation.filter(item => {
              const effectiveDate = new Date(item.effectiveDate);
              const from = new Date(fromDate);
              const to = new Date(toDate);

  // Setting hours to 00:00:00 for both dates to compare only the date part
              from.setHours(0, 0, 0, 0);
              to.setHours(23, 59, 59, 999);

              return effectiveDate >= from && effectiveDate <= to;
          });
            console.log(filteredData);
            const formattedData = filteredData.map((shift) => {
                shift.isWeekend = 1;
                let shiftName = '';
                if (shift.shiftName) {
                    shiftName = shift.shiftName;
                } else if (shift.offWeekendTypeName) {
                    shiftName = shift.offWeekendTypeName;
                } else if (shift.isWeekend != null) {
                    shiftName = 'Weekend';
                } else if (shift.shiftName == null) {
                    if (shift.offWeekendTypeName == null) {
                        shiftName = 'Weekend';
                    }
                } else {
                    shiftName = shift.shiftName;
                }

                return {
                    date: shift.effectiveDate ? clientDetail.useBS == true ? geFullDate(shift.effectiveDate, !isAD) : shift.effectiveDate.substring(0, 10) : '',
                    shift: shiftName,
                };
            });

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setFirstLoad(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleButtonClick = () => {
        fetchDutyRoster(selectedUser || userId,).finally(() => {
            setRefreshing(false);
        });

    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshing(false);
    }, []);

    const renderItem = ({item, index}) => {
        return (
            <View style={styles.row}>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{item.shift}</Text>
            </View>
            );
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
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.header}>
                <Text style={styles.headerText}>Date</Text>
                <Text style={styles.headerText}>Shift</Text>
                </View>
            }
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
            />):(
            <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}> {firstLoad ? `Search` : 'No data available'}</Text>
            </View>
            )}
            </View>
            );
        };

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                paddingVertical: 30,
                paddingHorizontal: 10,
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
                                    shadowColor: "#000",
                                    shadowOffset: {width: 0, height: 1},
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


                                        export default DutyRosterScreen;
