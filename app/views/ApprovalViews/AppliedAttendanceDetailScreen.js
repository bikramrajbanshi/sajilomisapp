import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    PermissionsAndroid,
    ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext, useApproval} from "../../context/AuthContext";
import APIKit, {loadToken} from "../../shared/APIKit";
import {getTodayFullDate, getTodayISOString, getCurrentTime, hasSpecificPermission,geFullDate, formatDateRange} from "../../utils";
import Toast from "react-native-toast-message";
import {fetchApprovalCount, resetApprovalCount} from "../../utils/GetApprovalCount";
import LinearGradient from 'react-native-linear-gradient';
import CustomSwitch from "../../components/CustomSwitch";
import RequestCard from "../../components/RequestCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ITEMS_PER_PAGE = 10;

const AttendanceRequestStatsCard = ({stats, onNumberPress}) => {
    const keys = Object.keys(stats);

    const isEven = keys.length % 2 === 0;
    const columnStyle = isEven ? styles.statsItemEven : styles.statsItemOdd;

    const getColor = (key) => {
        switch (key) {
        case 'approved':
            return 'green';
        case 'pending':
            return 'orange';
        case 'applied':
            return 'blue';
        case 'rejected':
            return 'red';
        default:
            return 'black';
        }
    };

    return (
        <View style={styles.statsCard}>
        <View style={[styles.statsContainer, isEven ? styles.even : styles.odd]}>
        {keys.map((key, index) => (
            <View key={index} style={columnStyle}>
            <TouchableOpacity onPress={() => onNumberPress(index + 1)}>
            <Text style={[styles.statsNumber, {color: getColor(key)}]}>{stats[key]}</Text>
            <Text style={styles.statsLabel}>{key}</Text>
            </TouchableOpacity>
            </View>
            ))}
        </View>
        </View>
        );
};

const AppliedAttendanceDetailScreen = ({navigation}) => {
    const {logout, userInfo} = useContext(AuthContext);
    const { setApprovalCount,setAttendanceCount,setLeaveCount, setOfficialCount, setLateCount,setOvertimeCount,
    setShiftChangeCount,setLeaveEncashmentCount,setAdvancePaymentCount,setRequestLeaveCount } = useApproval();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAD, setIsAD] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [counts, setCounts] = useState({
        applied: "",
        pending: "",
        approved: "",
        rejected: "",
    });
    const [attendanceData, setAttendanceData] = useState({
        'applied': [],
        'pending': [],
        'approved': [],
        'rejected': []
    });
    const [allData, setAllData] = useState({
        'applied': [],
        'pending': [],
        'approved': [],
        'rejected': []
    });

    const [menuTab, setMenuTab] = useState('pending');

    const statsMapping = {
        1: 'applied',
        2: 'pending',
        3: 'approved',
        4: 'rejected',
    };

    const handleNumberPress = (key) => {
        setPage(1);
        const value = statsMapping[key];
        setMenuTab(value);
    };
    const userId = userInfo.userId;

    useEffect(() => {
        loadToken();
        setTimeout(() => {
            fetchData();
        });
    }, []);

    const fetchData = async () => {
        try {
            let clientDetail = await AsyncStorage.getItem("clientDetail");
            clientDetail = JSON.parse(clientDetail);
            clientDetail.useBS ? setIsAD(false) : setIsAD(true);
            setIsLoading(true);
            setRefreshing(true);
            const response = await APIKit.get('/AttendanceLog/GetFilteredAttendaceLogList');
            const responseData = response.data;

            let applied = [];
            let pending = [];
            let approved = [];
            let rejected = [];

            responseData.forEach(item => {
                applied.push(item);
                if (!item.isApproved && !item.isRejected && !item.recommendReject) {
                    pending.push(item);
                }
                if (item.isApproved) {
                    approved.push(item);
                }
                if (item.isRejected || item.recommendReject == true) {
                    rejected.push(item);
                }
            });

            setCounts({
                applied: applied.length,
                pending: pending.length,
                approved: approved.length,
                rejected: rejected.length
            });

            setAllData({
                applied: applied,
                pending: pending,
                approved: approved,
                rejected: rejected,
            });

            loadInitialData(applied, pending, approved, rejected);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const loadInitialData = (applied, pending, approved, rejected) => {
        setAttendanceData({
            applied: applied.slice(0, ITEMS_PER_PAGE),
            pending: pending.slice(0, ITEMS_PER_PAGE),
            approved: approved.slice(0, ITEMS_PER_PAGE),
            rejected: rejected.slice(0, ITEMS_PER_PAGE),
        });
        setPage(1);
        setHasMore({
            applied: applied.length > ITEMS_PER_PAGE,
            pending: pending.length > ITEMS_PER_PAGE,
            approved: approved.length > ITEMS_PER_PAGE,
            rejected: rejected.length > ITEMS_PER_PAGE,
        });
    };

    const loadMoreData = (category) => {
        const nextPage = page + 1;
        setPage(nextPage);

        setAttendanceData(prevData => ({
            ...prevData,
            [category]: [
                ...prevData[category],
                ...allData[category].slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
            ]
        }));

        setHasMore(prevHasMore => ({
            ...prevHasMore,
            [category]: allData[category].length > nextPage * ITEMS_PER_PAGE,
        }));
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }, []);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore[menuTab]) {
            setLoadingMore(true);
            loadMoreData(menuTab);
            setLoadingMore(false);
        }
    };

    const handleAction = async (attendanceLogId, remarks, isApproved, isRejected, isRecommended, recommendReject) => {
        const body =  {
            attendanceLogId,
            remarks,
            isApproved,
            isRejected,
            isRecommended,
            recommendReject
        };
        setLoading(true);

        let action = 'approved';
        if(isRecommended)
            action = 'recommended';

        if(isApproved)
            action = 'approved';

        if(isRejected || recommendReject)
            action = 'rejected';

        try {
            const response = await APIKit.post('/AttendanceLog/ApproveRejectAttendance', body);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `Attendance ${action}`
            });

            resetApprovalCount(setApprovalCount,setAttendanceCount,setLeaveCount, setOfficialCount, setLateCount,setOvertimeCount,
                setShiftChangeCount,setLeaveEncashmentCount,setAdvancePaymentCount,setRequestLeaveCount);

            fetchData();
        } catch (error) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `'Failed to take action: '${error}`
            });

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <View style={styles.fixedCard}>
        <AttendanceRequestStatsCard stats={counts} onNumberPress={handleNumberPress}/>
        </View>

        <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
        }
        onMomentumScrollEnd={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
                handleLoadMore();
            }
        }}
        >
        <View>
        {attendanceData[menuTab] && attendanceData[menuTab].map((data, index) => {

            let status = '';
            if(data.isApproved) {
                status = 'Approved';
            }

            if(data.isRejected || data.recommendReject) {
                status = 'Rejected';
            }

            if(data.isRecommended || !data.isApproved || !data.isRejected){
                status = 'Pending';
            }

            let appliedInDate = '';
            let appliedInTime = '';
            let appliedOutDate = '';
            let appliedOutTime = '';

            if(data.inAttendanceDate != null) {
                appliedInDate = data.inAttendanceDate;
                appliedInTime = data.inAttendanceTime;
            } else if( data.modifiedInAttendanceDate != null) {
                appliedInDate = data.modifiedInAttendanceDate;
                appliedInTime = data.modifiedInAttendanceTime;
            }

            if(data.outAttendanceDate != null) {
                appliedOutDate = data.outAttendanceDate;
                appliedOutTime = data.outAttendanceTime;
            } else if( data.modifiedOutAttendanceDate != null) {
                appliedOutDate = data.modifiedOutAttendanceDate;
                appliedOutTime = data.modifiedOutAttendanceTime;
            }

            let approver = '';
            approver = data.a_FirstName ? data.a_FirstName + ' ': '';
            approver += data.a_LastName ? data.a_LastName : '';

            let recommender = '';
            recommender = data.r_FirstName ? data.r_FirstName + ' ': '';
            recommender += data.r_LastName ? data.r_LastName : '';

            const fields = [
                {
                    title: 'In Date',
                    value: geFullDate(appliedInDate.split('T')[0], !isAD)
                },
                {
                    title: 'Out Date',
                    value: geFullDate(appliedOutDate.split('T')[0], !isAD)
                },
                {
                    title: 'In Time',
                    value: appliedInTime
                },
                {
                    title: 'Out Time',
                    value: appliedOutTime
                },
                {
                    title: 'Reason',
                    value: data.reason !== null && data.reason !== '' ? `${data.reason}` : '-'
                },
                {
                    title: 'Status',
                    value: status
                },
                {
                    title: 'Recommender',
                    value: recommender
                },
                {
                    title: 'Approver',
                    value: approver
                },
            ].filter(field => field.value !== null);

            const isRejected = !!(data.isRejected || data.recommendReject);
            const isApproved = !!(data.isApproved);

            let canRecommendAndReject = data.recommendedBy === userId;
            let canApproveAndReject = data.approvedBy === userId;

            if(canApproveAndReject) {
                canRecommendAndReject = false;
            }
                            // canApproveAndReject = true;
                            // canRecommendAndReject = true;
            return (<RequestCard
                key={index}
                user={data.u_FirstName + ' ' + data.u_LastName}
                fields={fields}
                onApprove={() => handleAction(data.attendanceLogId, data.remarks, true, data.isRejected, data.isRecommended, data.recommendReject)}
                onRecommend={() => handleAction(data.attendanceLogId, data.remarks, data.isApproved, data.isRejected, true, data.recommendReject)}
                onRecommendReject={() => handleAction(data.attendanceLogId, data.remarks, data.isApproved, data.isRejected, data.isRecommended, true)}
                onReject={() => handleAction(data.attendanceLogId, data.remarks, data.isApproved, true, data.isRecommended, data.recommendReject)}
                isApproved={isApproved}
                isRejected={isRejected}
                canApproveAndReject={canApproveAndReject}
                canRecommendAndReject={canRecommendAndReject}
                />);
        }
        )}
{loadingMore && <ActivityIndicator size="large" color="#0000ff"/>}
</View>
</ScrollView>
</View>
);
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,255,0.05)",
        },

        item: {
            fontSize: 15,
            color: "white",
            },
            value: {
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                },
                itemContainer: {
                    flexDirection: "column",
                    width: 100,
                    height: 100,
                    backgroundColor: "blue",
                    textAlignVertical: "center",
                    textAlign: "center",
                    margin: 5,
                    padding: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    },
                    scrollView: {
                        // flexGrow: 1,
                        paddingHorizontal: 10,
                        // overflow: "hidden",
                        // padding: 15,
                        },
                        // switchContainer: {
                            //     borderRadius: 10,
                            //     padding: 0,
                            //     marginVertical: "5%",
                            // },
                            fixedCard: {
                                // position: 'absolute',
                                // top: 70,
                                // left: 0,
                                // right: 0,
                                zIndex: 1,
                                padding: 15,
                                },
                                updateText: {
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    },
                                    updateDescription: {
                                        fontSize: 14,
                                        marginTop: 10,
                                        },
                                        card: {
                                            width: "48%",
                                            backgroundColor: "rgba(255,255,255,0.8)",
                                            borderRadius: 10,
                                            padding: 10,
                                            marginBottom: 10,
                                            alignItems: "center",
                                            height: 100,

                                            },
                                            cardTitle: {
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                color: "#333",
                                                textAlign: "center",
                                                },
                                                cardValue: {
                                                    fontSize: 24,
                                                    fontWeight: "bold",
                                                    marginTop: 10,
                                                    },
                                                    checkInContainer: {
                                                        alignItems: "center",
                                                        marginTop: 45,

                                                        },
                                                        timeContainer: {
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            },
                                                            time: {
                                                                fontSize: 48,
                                                                fontWeight: "bold",
                                                                marginHorizontal: 5,
                                                                },
                                                                timeLabel: {
                                                                    fontSize: 18,
                                                                    fontWeight: "bold",
                                                                    marginLeft: 10,
                                                                    },
                                                                    checkInButton: {
                                                                        marginTop: 0,
                                                                        backgroundColor: "#000080",
                                                                        borderRadius: 50,
                                                                        paddingVertical: 10,
                                                                        paddingHorizontal: 50,
                                                                        },
                                                                        checkInText: {
                                                                            fontSize: 16,
                                                                            fontWeight: "bold",
                                                                            color: "white",
                                                                            },
                                                                            buttons: {
                                                                                fontSize: 12,
                                                                                backgroundColor: "#000080",
                                                                                width: 80,
                                                                                height: 30,
                                                                                textAlign: "center",
                                                                                borderRadius: 50,
                                                                                fontWeight: "bold",
                                                                                color: "white",
                                                                                paddingTop: 5,

                                                                                },
                                                                                statsCard: {
                                                                                 // position: 'absolute',
                                                                                 // bottom: 0,
                                                                                 // left: 0,
                                                                                 // right: 0,
                                                                                 backgroundColor: 'white',
                                                                                 padding: 10,
                                                                                 borderRadius: 10,
                                                                                 alignItems: 'center',
                                                                                 marginBottom: 0,
                                                                                 elevation:10,
                                                                                 },

                                                                                 statsContainer: {
                                                                                     flexDirection: 'row',
                                                                                     flexWrap: 'wrap',
                                                                                     justifyContent: 'space-between',
                                                                                     width: '100%',
                                                                                     },
                                                                                     statsItemEven: {
                                                                                         alignItems: 'center',
                                                                                         width: '25%',
                                                                                         marginVertical: 0,
                                                                                         },
                                                                                         statsItemOdd: {
                                                                                             alignItems: 'center',
                                                                                             width: '25%',
                                                                                             marginVertical: 0,
                                                                                             },
                                                                                             statsNumber: {
                                                                                                 fontSize: 20,
                                                                                                 fontWeight: 'bold',
                                                                                                 textAlign: 'center',
                                                                                                 },
                                                                                                 statsLabel: {
                                                                                                     fontSize: 15,
                                                                                                     color: '#000',
                                                                                                     textTransform: 'capitalize',
                                                                                                     },


                                                                                                     requestContainer: {
                                                                                                        marginBottom: 10,
                                                                                                        },
                                                                                                        });

                                                                                                        export default AppliedAttendanceDetailScreen;
