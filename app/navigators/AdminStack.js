import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import TabNavigator1 from "./TabNavigator1";
import AdminHomeScreen from "../views/AdminHomeScreen";
import ServicesScreen from "../views/ServicesScreen";
import PersonalAttendanceScreen from "../views/ServicesViews/PersonalAttendanceScreen";
import DutyRosterScreen from "../views/ServicesViews/DutyRosterScreen";
import LateInEarlyOutScreen from "../views/ServicesViews/LateInEarlyOutScreen";
import CustomButton from "../components/CustomButton";
import LeaveListScreen from "../views/ServicesViews/LeaveListScreen";
import OfficeVisitScreen from "../views/ServicesViews/OfficeVisitScreen";
import ApplyLeaveScreen from "../views/ServicesViews/ApplyLeaveScreen";
import ApplyOfficeVisitScreen from "../views/ServicesViews/ApplyOfficeVisitScreen";
import ApplyLateInEarlyOutScreen from "../views/ServicesViews/ApplyLateInEarlyOutScreen";
import ApprovalScreen from "../views/ApprovalsScreen";
import PresentListScreen from "../views/AdminHomeViews/PresentListScreen";
import AbsentListScreen from "../views/AdminHomeViews/AbsentListScreen";
import AdminLeaveListScreen from "../views/AdminHomeViews/LeaveListScreen";
import OfficialVisitListScreen from "../views/AdminHomeViews/OfficialVisitListScreen";
import WeekendListScreen from "../views/AdminHomeViews/WeekendListScreen";
import OnHolidayListScreen from "../views/AdminHomeViews/OnHolidayListScreen";
import AllUserListScreen from "../views/AdminHomeViews/AllUsersListScreen";
import UserDetailScreen from "../views/AdminHomeViews/UserDetailScreen";
import PersonalInfoScreen from "../views/AdminHomeViews/PersonalInfoScreen";
import WorkInfoScreen from "../views/AdminHomeViews/WorkInfoScreen";
import UpcomingLeaveListScreen from "../views/HomeViews/UpcomingLeaveListScreen";
import UpcomingOfficialVisitScreen from "../views/HomeViews/UpcomingOfficialVisitScreen";
import UpcomingHolidaysScreen from "../views/HomeViews/UpcomingHolidaysScreen";
import UpcomingLateInEarlyOutScreen from "../views/HomeViews/UpcomingLateInEarlyOutScreen";
import PaySlipScreen from "../views/ServicesViews/PaySlipScreen";
import OverTimeScreen from "../views/ServicesViews/OverTimeScreen";
import ApplyOverTimeScreen from "../views/ServicesViews/ApplyOverTimeScreen";
import ShiftChangeScreen from "../views/ServicesViews/ShiftChangeScreen";
import ApplyShiftChangeScreen from "../views/ServicesViews/ApplyShiftChangeScreen";
import PaySlipDetailScreen from "../views/ServicesViews/PaySlipDetailScreen";
import AdvanceApplyScreen from "../views/ServicesViews/ApplyAdvanceScreen";
import AdvancePaymentScreen from "../views/ServicesViews/AdvancePaymentScreen";


const Stack = createNativeStackNavigator();

const adminScreens = {
    serviceScreens: [
        {
            name: "Service",
            component: ServicesScreen,
            options: () =>  ({ headerShown: false }),
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
            options: (navigation) => ({
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
            options: () => ({
                title: "Apply Leave",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "ApplyOfficeVisit",
            component: ApplyOfficeVisitScreen,
            options: () => ({
                title: "Apply Office Visit",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "ApplyLateInEarlyOut",
            component: ApplyLateInEarlyOutScreen,
            options: () => ({
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
        { name: "Home1", component: AdminHomeScreen, options: () => ({ headerShown: false }) },
        {
            name: "PresentList",
            component: PresentListScreen,
            options: () => ({
                title: "Present Today",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "AbsentList",
            component: AbsentListScreen,
            options: () => ({
                title: "Absent Today",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "AdminLeaveList",
            component: AdminLeaveListScreen,
            options: () => ({
                title: "Leave Today",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "OfficialVisitList",
            component: OfficialVisitListScreen,
            options: () => ({
                title: "Official Visit Today",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "WeekendList",
            component: WeekendListScreen,
            options: () => ({
                title: " On Weekend",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "OnHolidayList",
            component: OnHolidayListScreen,
            options: () => ({
                title: "On Holiday Today",
                headerStyle: { backgroundColor: "rgba(44,78,156,1)" },
                headerTintColor: "#fff",
            }),
        },
        {
            name: "AllUsersList",
            component: AllUserListScreen,
            options: () => ({
                title: "All Users",
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
        {
            name: "Approval",
            component: ApprovalScreen,
            badgeStyle: {
                backgroundColor: 'orange'
            },
            icon: 'checkmark-circle',
        },
    ],
};

const AdminStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tab">
                {() => <TabNavigator1 {...adminScreens} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default AdminStack;
