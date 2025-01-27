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

