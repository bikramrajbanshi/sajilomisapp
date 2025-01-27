import { View, Text } from 'react-native'
import React from 'react'
import ApprovalsScreen from '../views/ApprovalsScreen'
import AppliedLeaveDetailScreen from '../views/ApprovalViews/AppliedLeaveDetailScreen'
import AppliedAttendanceDetailScreen from '../views/ApprovalViews/AppliedAttendanceDetailScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppliedOfficialVisitDetailScreen from '../views/ApprovalViews/AppliedOfficialVisitDetailScreen';
import AppliedLateInEarlyOutDetailScreen from '../views/ApprovalViews/AppliedLateInEarlyOutDetailScreen';
import AppliedOvertimeDetailScreen from '../views/ApprovalViews/AppliedOvertimeDetailScreen';
import AppliedShiftChangeDetailScreen from '../views/ApprovalViews/AppliedShiftChangeDetailScreen';
import AppliedLeaveEncashmentDetailScreen from '../views/ApprovalViews/AppliedLeaveEncashmentDetailScreen';
import AppliedAdvancePaymentDetailScreen from '../views/ApprovalViews/AppliedAdvancePaymentDetailScreen';
import AppliedRequestLeaveDetailScreen from '../views/ApprovalViews/AppliedRequestLeaveDetailScreen';

const Stack = createNativeStackNavigator();

const ApprovalStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name="ApprovalMain" 
            component={ApprovalsScreen} 
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="LeaveRequestScreen"
            component={AppliedLeaveDetailScreen}
            options={{
                title: 'Leave Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen
            name="AttendanceRequestScreen"
            component={AppliedAttendanceDetailScreen}
            options={{
                title: 'Attendance Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen 
            name="OfficialVisitDetailScreen"
            component={AppliedOfficialVisitDetailScreen}
            options={{ 
                title: 'Official Visit Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }} 
        />
        <Stack.Screen 
            name="LateInEarlyOutDetailScreen"
            component={AppliedLateInEarlyOutDetailScreen}
            options={{ 
                title: 'Late In Early Out Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen
            name="OvertimeDetailScreen"
            component={AppliedOvertimeDetailScreen}
            options={{
                title: 'Overtime Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen
            name="ShiftChangeDetailScreen"
            component={AppliedShiftChangeDetailScreen}
            options={{
                title: 'Shift Change Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen
            name="LeaveEncashmentDetailScreen"
            component={AppliedLeaveEncashmentDetailScreen}
            options={{
                title: 'Leave Encashment Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen
            name="AdvancePaymentDetailScreen"
            component={AppliedAdvancePaymentDetailScreen}
            options={{
                title: 'Advance Payment Requests',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
        <Stack.Screen
            name="RequestLeaveDetailScreen"
            component={AppliedRequestLeaveDetailScreen}
            options={{
                title: 'Request Leave',
                headerStyle: { backgroundColor: 'rgba(44,78,156,1)' },
                headerTintColor: '#fff',
            }}
        />
    </Stack.Navigator>
  )
}

export default ApprovalStack;