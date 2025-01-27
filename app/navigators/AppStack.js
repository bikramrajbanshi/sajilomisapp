import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import TabNavigator1 from './TabNavigator1';
import OnVisitTodayScreen from '../views/HomeViews/OnVisitTodayScreen';
import UpcomingLeaveListScreen from '../views/HomeViews/UpcomingLeaveListScreen';
import UpcomingOfficialVisitScreen from '../views/HomeViews/UpcomingOfficialVisitScreen';
import UpcomingHolidaysScreen from '../views/HomeViews/UpcomingHolidaysScreen';
import UpcomingLateInEarlyOutScreen from '../views/HomeViews/UpcomingLateInEarlyOutScreen';
import ServicesScreen from '../views/ServicesScreen';
import PersonalAttendanceScreen from '../views/ServicesViews/PersonalAttendanceScreen';
import DutyRosterScreen from '../views/ServicesViews/DutyRosterScreen';
import LateInEarlyOutScreen from '../views/ServicesViews/LateInEarlyOutScreen';
import LeaveListScreen from '../views/ServicesViews/LeaveListScreen';
import OfficeVisitScreen from '../views/ServicesViews/OfficeVisitScreen';
import ApplyLeaveScreen from '../views/ServicesViews/ApplyLeaveScreen';
import ApplyOfficeVisitScreen from '../views/ServicesViews/ApplyOfficeVisitScreen';
import ApplyLateInEarlyOutScreen from '../views/ServicesViews/ApplyLateInEarlyOutScreen';
import HomeScreen from '../views/HomeScreen';
import OnLeaveTodayScreen from '../views/HomeViews/OnLeaveTodayScreen';
import ApprovalScreen from '../views/ApprovalsScreen';
import CustomButton from '../components/CustomButton';
import ShiftChangeScreen from "../views/ServicesViews/ShiftChangeScreen";
import ApplyShiftChangeScreen from "../views/ServicesViews/ApplyShiftChangeScreen";
import PaySlipDetailScreen from "../views/ServicesViews/PaySlipDetailScreen";
import PaySlipScreen from "../views/ServicesViews/PaySlipScreen";
import OverTimeScreen from "../views/ServicesViews/OverTimeScreen";
import ApplyOverTimeScreen from "../views/ServicesViews/ApplyOverTimeScreen";
import AdvanceApplyScreen from "../views/ServicesViews/ApplyAdvanceScreen";
import AdvancePaymentScreen from "../views/ServicesViews/AdvancePaymentScreen";
import UserDetailScreen from "../views/AdminHomeViews/UserDetailScreen";
import PersonalInfoScreen from "../views/AdminHomeViews/PersonalInfoScreen";
import WorkInfoScreen from "../views/AdminHomeViews/WorkInfoScreen";



const Stack = createNativeStackNavigator();

const userScreens = {
  serviceScreens: [
    {
      name: "Service",
      component: ServicesScreen,
      options: () => ({ headerShown: false }),
    },
    {
      name: "PersonalAttendance",
      component: PersonalAttendanceScreen,
      options: () => ({
        title: "Personal Attendance",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "DutyRoster",
      component: DutyRosterScreen,
      options: () => ({
        title: "Duty Roster",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "LateInEarlyOut",
      component: LateInEarlyOutScreen,
      options: ({ navigation }) => ({
        title: "Late in Early out",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "LeaveList",
      component: LeaveListScreen,
      options: (navigation) => ({
        title: "Leave List",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "OfficeVisit",
      component: OfficeVisitScreen,
      options: (navigation) => ({
        title: "Office Visit List",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ApplyLeave",
      component: ApplyLeaveScreen,
      options:() => ({
        title: "Apply Leave",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ApplyOfficeVisit",
      component: ApplyOfficeVisitScreen,
      options:() => ({
        title: "Apply Office Visit",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ApplyLateInEarlyOut",
      component: ApplyLateInEarlyOutScreen,
      options:() => ({
        title: "Late in Early out",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "PayslipDetailsScreen",
      component: PaySlipDetailScreen,
      options: () => ({
        title: "PaySlipDetails",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "PayslipScreen",
      component: PaySlipScreen,
      options: () => ({
        title: "PaySlip",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "OvertimeScreen",
      component: OverTimeScreen,
      options: () => ({
        title: "Overtime",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ApplyOverTime",
      component: ApplyOverTimeScreen,
      options: () => ({
        title: "Apply Overtime",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ShiftChange",
      component: ShiftChangeScreen,
      options: () => ({
        title: "Shift Change",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ApplyShiftChange",
      component: ApplyShiftChangeScreen,
      options: () => ({
        title: "Apply Shift Change",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "ApplyAdvance",
      component: AdvanceApplyScreen,
      options: () => ({
        title: "Apply Advance Payment",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "Advance",
      component: AdvancePaymentScreen,
      options: () => ({
        title: "Advance",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
  ],
  homeScreens: [
    { name: "Home1", component: HomeScreen, options: { headerShown: false } },
    {
      name: "OnLeaveToday",
      component: OnLeaveTodayScreen,
      options: () => ({
        title: "On Leave",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "OnVisitToday",
      component: OnVisitTodayScreen,
      options: () => ({
        title: "Today on Visit",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "UserDetail",
      component: UserDetailScreen,
      options: () => ({
        title: "Profile",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "PersonalInfo",
      component: PersonalInfoScreen ,
      options: () => ({
        title: "Personal Information",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "WorkInfo",
      component: WorkInfoScreen ,
      options: () => ({
        title: "Work Information",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "UpcomingLeave",
      component: UpcomingLeaveListScreen,
      options: () => ({
        title: "Upcoming Leaves",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "UpcomingOfficialVisit",
      component: UpcomingOfficialVisitScreen,
      options: () => ({
        title: "Upcoming Official Visit",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "UpcomingHolidays",
      component: UpcomingHolidaysScreen,
      options: () => ({
        title: "Upcoming Holidays",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
    {
      name: "UpcomingLateInEarlyOut",
      component: UpcomingLateInEarlyOutScreen,
      options: () => ({
        title: "Upcoming Late In Early Out",
        headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
        headerTintColor: "#fff",
      }),
    },
  ],
  otherScreens: [
    //   {
    //       name: "Approval",
    //       component: ApprovalScreen,
    //       badge: 3,
    //       badgeStyle: { backgroundColor: "orange" },
    //       icon: "checkmark-circle",
    //   },
  ],
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tab">
    {() =>  <TabNavigator1 {...userScreens} />}
    </Stack.Screen>
    </Stack.Navigator>
    )
}

export default AppStack;