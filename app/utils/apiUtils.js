import APIKit from "../shared/APIKit"
import Toast from "react-native-toast-message";

export const fetchUserList = async () => {
    try {
        const response = await APIKit.get('/account/GetUserRelationList');
        return response.data
        .filter((user) => user.status === 1 || user.status === 3)
        .map((user) => ({
            id: user.userId,
            name: `${user.firstName} ${user.lastName} (${user.userId})`,
        }));
    } catch (error) {
        console.error('Error fetching user list:', error);
        throw error;
    }
};
export const fetchLatestVersion = async () => {
    try {
        const response = await fetch('https://cmfoxyapi.sajilomis.com/AppVersionInfo/GetLatestAndroidAppVersionInfo');
        
        if(response.status == 200)
        {
            const a = await response.json();
            return a;
        }
        else{
            return null
        }
   
    } catch (error) {
        console.error('Error fetching user list:', error);
        throw error;
    }
};
export const fetchUserDetails = async (userId) => {
    try {
      const response = await APIKit.get(`/account/GetUser/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };
export const getLeaveTypes = async() => {
    try {
        const response = await APIKit.get(`/leave/GetLeaveTypeList`);
        return response.data.map((item) => ({
            id: item.leaveId,
            name: item.leaveName
        }));
    } catch (error) {
        console.error('Error fetching leave type list:', error);
        throw error;
    }
};
export const getLeaveTypesWithFullDetails = async() => {
    try {
        const response = await APIKit.get(`/leave/GetLeaveTypeList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leave type list:', error);
        throw error;
    }
};

export const getOfficialVisitType = async () => {
    try {
        const response = await APIKit.get(`/OfficialVisit/GetOfficialVisitNameList`);
        return response.data.map((item) => ({
            id: item.officialVisitNameId,
            name: item.officialVisitName
        }));

    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to fetch leave type'
        });
    }
};


export const getCountryList = async () => {
    try {
        const response = await APIKit.get(`/Address/GetCountryList`);
        return response.data.map((item) => ({
            id: item.countryId,
            name: item.countryName
        }));
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to fetch leave type'
        });
    }
};

export const getLateInEarlyOutType =  () => {

    const lateInEarlyOutTypeArray = [
        { id: 1, name: "Late In" },
        { id: 2, name: "Early Out" },
    ];
    return [...lateInEarlyOutTypeArray];
};

export const getOverTimeType =  () => {

    const overTimeTypeArray = [
        { id: 1, name: "Before Shift" },
        { id: 2, name: "After Shift" },
        { id: 3, name: "Both" },

    ];
    return [...overTimeTypeArray];
};

export const getShifts = async () => {
    try {
        const response = await APIKit.get(`/shift/GetShiftList`);
        return response.data.map((item) => ({
            id: item.shiftId,
            name: item.shiftName
        }));

    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to fetch shift type'
        });
    }
};

export const getAdvanceSalaryType = async () => {
        try {
            const response = await APIKit.get(`/deduction/AdvanceDeductionType`);
            return response.data.map((item) => ({
                id: item.deductionId,
                name: item.deductionName
            }));

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch advance type'
            });
        }
    };

export const getAttendanceYearAndMonth = async () => {
    try {
      const response = await APIKit.get('/AttendanceYear/GetAttendanceYearAndMonth');
      return response.data.map((item) => ({
                attendanceMonths: item.attendanceMonths,
                attendanceYearId: item.attendanceYearId,
                attendanceYearName: item.attendanceYearName,
                attendanceYearStartDate: item.attendanceYearStartDate,
                attendanceYearEndDate: item.attendanceYearEndDate,
                isCurrentAttendanceYear: item.isCurrentAttendanceYear,

            }));
      } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch year'
            });
        }
    };

