import APIKit from "../shared/APIKit";

export const fetchApprovalCount = async () => {
    try {
        // const currentDate = new Date().toISOString().split('T')[0];
        const response = await APIKit.get(`/Home/GetIsPendingApplicationExist/true`);
        const totalCount = response.data.leavePending + response.data.officeVisitPending +
            response.data.attendacePending  + response.data.lateInEarlyOutsPending + response.data.overTimePending
            + response.data.requestLeavePending + response.data.leaveEncashmentPending +  response.data.shiftChangeRequestPending
        +  response.data.advancePaymentRequestPending;
        return response.data;
    } catch (error) {
        console.error('Failed to fetch badge data', error);
        return 0;
    }
}

export const resetApprovalCount = async (setApprovalCount,setAttendanceCount,setLeaveCount, setOfficialCount, setLateCount,setOvertimeCount,
                                         setShiftChangeCount,setLeaveEncashmentCount,setAdvancePaymentCount,setRequestLeaveCount) => {

    try {
        const response = await APIKit.get(`/Home/GetIsPendingApplicationExist/true`);
        const approvalCount = response.data;
        const totalCount = approvalCount.leavePending + approvalCount.officeVisitPending +
            approvalCount.attendacePending  + approvalCount.lateInEarlyOutsPending + approvalCount.overTimePending
            + approvalCount.requestLeavePending + approvalCount.leaveEncashmentPending +  approvalCount.shiftChangeRequestPending
            +  approvalCount.advancePaymentRequestPending;

        setApprovalCount(totalCount);
        setAttendanceCount(approvalCount.attendacePending);
        setLeaveCount(approvalCount.leavePending);
        setOfficialCount(approvalCount.officeVisitPending);
        setLateCount(approvalCount.lateInEarlyOutsPending);
        setOvertimeCount(approvalCount.overTimePending);
        setShiftChangeCount(approvalCount.shiftChangeRequestPending);
        setLeaveEncashmentCount(approvalCount.leaveEncashmentPending);
        setAdvancePaymentCount(approvalCount.advancePaymentRequestPending);
        setRequestLeaveCount(approvalCount.requestLeavePending);
    } catch (error) {
        console.error('Failed to fetch badge data', error);
        return 0;
    }
}
