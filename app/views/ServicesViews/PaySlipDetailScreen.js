import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import APIKit, {loadToken} from '../../shared/APIKit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FiscalYearPicker from '../../components/FiscalYearPicker';
import Toast from 'react-native-toast-message';

const PayslipDetailsTable = ({navigation}) => {
    const [data, setData] = useState([]);
    const screenWidth = Dimensions.get('window').width;
    const {userInfo} = useContext(AuthContext);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedYearId, setSelectedYearId] = useState(9);
    const [fiscalYears, setFiscalYears] = useState([]);

    useEffect(() => {
        loadToken();
        const fetchFiscalYears = async () => {
            try {
                const response = await APIKit.get('/FiscalYear/GetFiscalYear');
                const result = response.data;

                const formattedFiscalYears = result.map(fy => ({
                    id: fy.fiscalYearId,
                    name: fy.fiscalYearName,
                    isCurrent: fy.isCurrentFiscalYear,
                }));

                // console.log(formattedFiscalYears);
                setFiscalYears(formattedFiscalYears);

                const currentYear = formattedFiscalYears.find(fy => fy.isCurrent);
                if (currentYear) {
                    setSelectedYear(currentYear);
                    setSelectedYearId(currentYear.id);
                }
            } catch (error) {
                console.error('Error fetching fiscal years: ', error);
            }
        };
        fetchFiscalYears();
    }, []);

    useEffect(() => {
        loadToken();
        const fetchData = async () => {
            try {
                // console.log(`/GeneratedSalary/GetAnnuallyGeneratedSalaryDetail?userId=${userInfo.userId}&branchId=-1&departmentId=-1&fiscalYearId=${selectedYearId}`);
                const response = await APIKit.get(`/GeneratedSalary/GetAnnuallyGeneratedSalaryDetail?userId=${userInfo.userId}&branchId=-1&departmentId=-1&fiscalYearId=${selectedYearId}`);
                const result = response.data;

                if (Array.isArray(result) && result.length > 0) {
                    const resultArray = result[0];

                    if (resultArray.userAnnuallyGeneratedSalaryDetails) {
                        if (Array.isArray(resultArray.userAnnuallyGeneratedSalaryDetails)) {
                            const salaryDetails = resultArray.userAnnuallyGeneratedSalaryDetails.map((detail) => ({
                                month: detail.monthName || 'N/A',
                                basicSalary: detail.basicSalary || 0,
                                allowance: detail.allowance || 0,
                                ssf: detail.ssf || 0,
                                otherAllowance: detail.otherAllowance || 0,
                                ot: detail.ot || 0,
                                entitlementTotal: detail.entitlementTotal || 0,
                                ssfDeduction: detail.ssfDeduction || 0,
                                advance: detail.advance || 0,
                                otherDeduction: detail.otherDeduction || 0,
                                deductionTotal: detail.deductionTotal || 0,
                                netSalary: detail.netSalary || 0,
                                sst: detail.sst || 0,
                                rit: detail.rit || 0,
                                totalTax: detail.totalTax || 0,
                                netPayable: detail.netPayable || 0,
                                fiscalYearMonthId: detail.fiscalYearMonthId || null,
                            }));
                            setData(salaryDetails);
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: `userAnnuallyGeneratedSalaryDetails is not an array or not present`
                            });
                            setData([]); // Optionally set data to an empty array
                        }
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: `userAnnuallyGeneratedSalaryDetails is missing in API response`
                        });
                        setData([]); // Optionally set data to an empty array
                    }
                } else {
                    // console.error('API response is not an array or is empty');
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Payslip not found'
                    });
                    setData([]); // Optionally set data to an empty array
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `Error fetching data: ${error}`
                });
            }
        };

        fetchData();
    }, [selectedYearId]);
    // debugger;
    // let i = 0;
    // i++;
    // console.log(i);
    // console.log('years', fiscalYears);

    return (
        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{paddingHorizontal: 10}}>
            <FiscalYearPicker
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYearId}
            />
            <View style={[styles.container, {width: screenWidth - 20}]}>
                {data && data.length > 0 ? (
                    <>
                        <View style={styles.row}>
                            <Text style={[styles.headerCell, styles.fixedColumn]}>Payslip Detail</Text>
                            {data.map((item, index) => (
                                <View key={index} style={[styles.column, styles.flexColumn]}>
                                    <Text style={styles.headerCell}>{item.month}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('PayslipScreen', {fiscalYearMonthId: item.fiscalYearMonthId, monthName: item.month})}>
                                        <Ionicons name="eye" size={20} color="#333" style={styles.eyeIcon}/>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Rows for each payslip detail */}
        {/* {['Basic Salary', 'Allowance', 'SSF', 'Other Allowance', 'OT', 'Entitlement Total', 'SSF Deduction', 'Advance', 'Other Deduction', 'Deduction Total', 'Net Salary', 'SST', 'RIT', 'Total Tax', 'Net Payable'].map((label, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.detailCell}>{label}</Text>
            {data.map((item, index) => (
              <Text key={index} style={styles.cell}>
                {item.basicSalary}
              </Text>
            ))}
          </View>
        ))} */}

                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Basic Salary</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.basicSalary}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Allowance</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.allowance}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>SSF</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.ssf}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Other Allowance</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.otherAllowance}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>OT</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.ot}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Entitlement Total</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.entitlementTotal}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>SSF Deduction</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.ssfDeduction}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Advance</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.advance}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Other Deduction</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.otherDeduction}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Deduction Total</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.deductionTotal}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Net Salary</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.netSalary}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>SST</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.sst}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>RIT</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.rit}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Total Tax</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.totalTax}</Text>
                            ))}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailCell}>Net Payable</Text>
                            {data.map((item, index) => (
                                <Text key={index} style={styles.cell}>{item.netPayable}</Text>
                            ))}
                        </View>
                    </>
                ) : (
                    <Text>No data available</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 2, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
        paddingVertical: 8,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 5,
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
        color: '#333',
    },
    detailCell: {
        flex: 1,
        fontWeight: '600',
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 5,
        textAlign: 'center',
        color: '#555',
    },
    cell: {
        flex: 1,
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 5,
        textAlign: 'center',
        color: '#666',
    },
    column: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PayslipDetailsTable;
