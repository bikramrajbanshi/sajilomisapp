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
import {findNepaliDate,getCurrentNepaliMonthAttendanceId, getCurrentAttendanceYearId} from "../../utils";
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
    const [clientDetail, setClientDetail] = useState([]);

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
            setClientDetail(clientDetail);
            const response = await  APIKit.get(`/AttendanceLog/GetPersonalAttendanceDetail/${selectedUser}/${fromDate}/${toDate}`);
            const nepaliDateResponse = await APIKit.get(`/AttendanceYear/GetNepaliDateRange?startDate=${fromDate}&endDate=${toDate}`);
            const responseData = response.data;
            const nepaliDateResponseData = nepaliDateResponse.data;

            const formattedData = responseData.map((item) => {
                let reason = "";

                if (item.leaveName) {

                  reason += "Leave,";

              }
              if (item.officeVisitName) {
                reason += "Official Visit,";
            }
            if (item.holidayName) {
                reason += "Holiday,";
            }
            if (item.isWeekend === "Yes") {
                if (item.offWeekendTypeId > 0) {
                    reason += item.offWeekendName;
                } else {
                    reason += "Weekend,";
                }
            }

            reason = reason.endsWith(",") ? reason.slice(0, -1) : reason;

            if (reason == '') {
                const currentDate = new Date();
                const attendanaceDate = new Date(item.date);
                if(attendanaceDate > currentDate)
                {
                    reason = "Work Day"
                }
                else{
                  reason = item.status;

              }
          }


          let displayDate = '';
          let displayOutDate = '';
          const currentDate = new Date(item.date);
        const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
          if (clientDetail.useBS == true && isAD == false) {
            displayDate = findNepaliDate(nepaliDateResponseData, item.date);

        } else {
            displayDate = item.date.substring(0, 10);
        }

        return {
            date: displayDate,
            weekend: item.isWeekend,
            shift: item.shiftName,
            reason: reason,
            holiday: item.holidayName ? item.holidayName : "", 
            weekname: dayOfWeek,
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

    const renderItem = ({item}) => {

        let backgroundColor = '';
        let textcolor ='';
        let name = '';

        if (item.weekend === "Yes") {
            textcolor = 'rgba(204, 153, 51, 1)';
            name = " ";
        }
        else if(item.holiday)
        {
           textcolor = 'rgba(204, 153, 51, 1)';
           item.reason = item.holiday
           name = " "; 
        }
       

     return (
        <View style={[styles.row, { backgroundColor }]}>

        {(name == '') ? (
            <>
            <Text style={styles.cell}>
            {item.date}
            {item.weekname ? <Text style={styles.cell}>{`\n${item.weekname}`}</Text> : ''}
            </Text>
            <Text style={styles.cell}>{`\n${item.shift}`}</Text>
            </>
            ) : (
            <>
            <Text style={styles.cell}>
            {item.date}
            {item.weekname ? <Text style={styles.cell}>{`\n${item.weekname}`}</Text> : ''}
            </Text>
            <View style={styles.cell}>
            <Text style={[ { color: textcolor }]}>{item.reason}{name !== '' ? ` (${name})` : ''}</Text>
            </View>
            </>
        )}
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
      <View style={{ flex: 1, width: '100%' }}>
      <View style={styles.header}>
      <Text style={styles.headerText}>Date</Text>
      <Text style={styles.headerText}>Shift</Text>
      </View>

      {data.length > 0 ? (
        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        />
        ) : (
        <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
        {firstLoad ? 'Search' : 'No data available'}
        </Text>
        </View>
        )}
        </View>
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
    justifyContent: "space-between",
    marginVertical: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "lightgray",
    borderBottomWidth: 3,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 0,
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
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 3,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 0,
},
cell: {
    minWidth: 184,
    fontSize: 14,
    textAlign: "left",
    color: "#333",
    paddingHorizontal: 10,
},
});


export default DutyRosterScreen;
