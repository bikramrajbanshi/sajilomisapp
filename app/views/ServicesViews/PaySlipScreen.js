import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState, useRef } from "react";

import APIKit, { loadToken } from "../../shared/APIKit";
import { AuthContext } from "../../context/AuthContext";
import { useModuleName } from "../../utils/hooks/useModuleName";
import { fetchUserList } from "../../utils/apiUtils";
import UserPicker from "../../components/UserPicker";

const PaySlipScreen = ({ route }) => {
    const { fiscalYearMonthId, monthName } = route.params;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { userInfo } = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const moduleName = useModuleName();
    const userId = userInfo.userId;

    const scrollViewRef = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadToken();
        fetchPaySlip();
    }, [selectedUser, moduleName]);

    const fetchPaySlip = async () => {
        setIsLoading(true);
        try {
            console.log(`/GeneratedSalary/GetGeneratedEntitlementDeductionList/${fiscalYearMonthId}/${userId}`);
            const response = await APIKit.get(`/GeneratedSalary/GetGeneratedEntitlementDeductionList/${fiscalYearMonthId}/${userId}`);
            const responseData = response.data;
            setData(responseData);
        } catch (error) {
            console.error("Error fetching payslip data:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPaySlip();
    }, []);


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ fontWeight: 'bold' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Pay Slip for the Month of {monthName}</Text>
                    <Text style={styles.subHeaderText}>
                        <Text style={{ fontWeight: 'bold' }}>Name: </Text>
                        {data.lockedMonthlyAttendanceDetails.name}
                    </Text>
                    {data.lockedMonthlyAttendanceDetails.designation ? (
                        <Text style={styles.subHeaderText}>
                            <Text style={{ fontWeight: 'bold' }}>Designation: </Text>
                            {data.lockedMonthlyAttendanceDetails.designation}
                        </Text>
                    ) : null}
                    {data.lockedMonthlyAttendanceDetails.branch ? (
                        <Text style={styles.subHeaderText}>
                            <Text style={{ fontWeight: 'bold' }}>Branch: </Text>
                            {data.lockedMonthlyAttendanceDetails.branch}
                        </Text>
                    ) : null}
                    {data.lockedMonthlyAttendanceDetails.department ? (
                        <Text style={styles.subHeaderText}>
                            <Text style={{ fontWeight: 'bold' }}>Department: </Text>
                            {data.lockedMonthlyAttendanceDetails.department}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.fullWidthContainer}>
                    <Text style={styles.sectionHeader}>Entitlements</Text>
                    {data.entitlements.map((item, index) => (
                        renderRow(item.entitlementName, item.amount)
                    ))}
                    {renderTotal('Total Entitlement', data.employeeTaxCalculations.totalEntitlement)}
                </View>

                <View style={styles.fullWidthContainer}>
                    <Text style={styles.sectionHeader}>Deductions</Text>
                    {data.deductions.map((item, index) => (
                        renderRow(item.deductionName, item.formulaWithValue)
                    ))}
                    {renderTotal('Total Deduction', data.employeeTaxCalculations.totalDeduction)}
                </View>

                <View style={styles.fullWidthContainer}>
                    <Text style={styles.sectionHeader}>Remarks</Text>
                    {renderRow('Paid Leave', data.lockedMonthlyAttendanceDetails.paidLeaveDays)}
                    {renderRow('Unpaid Leave Days', data.lockedMonthlyAttendanceDetails.unPaidLeaveDays)}
                    {renderRow('Absent Days', data.lockedMonthlyAttendanceDetails.absentDays)}
                    {renderRow('Insufficient Hours', data.lockedMonthlyAttendanceDetails.insufficientTime)}
                    {renderRow('Pay Days', data.lockedMonthlyAttendanceDetails.payableDays)}
                </View>

                <View style={styles.fullWidthContainer}>
                    {renderTotal('Net Salary', data.employeeTaxCalculations.netSalary)}
                    {renderTotal('SST', data.employeeTaxCalculations.sst)}
                    {renderTotal('RIT', data.employeeTaxCalculations.rit)}
                    {renderTotal('Total Tax', data.employeeTaxCalculations.totalTax)}
                    {renderTotal('Payable Amount', data.employeeTaxCalculations.netPayable)}
                </View>
            </View>
        </ScrollView>
    );
};

const renderRow = (label, value) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const renderTotal = (label, value) => (
    <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>{label}</Text>
        <Text style={styles.totalValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#555',
        width: '50%',
    },
    fullWidthContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginTop: 15,
        width: '100%',
        elevation: 5,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
    value: {
        fontSize: 14,
        color: '#333',
        textAlign: 'right',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right',
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PaySlipScreen;