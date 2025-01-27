import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {geFullDate} from "../utils";

const LeaveCard = ({name, totalDays, appliedDate, dateFrom, dateTo, leaveName, isApproved, leaveReason, startTime, endTime, requestedTime, approver}) => {
    const totalDaysText = totalDays === 0.5 ? "Half Day Application" : `${totalDays}`;
    let formattedDateFrom = '';
    let formattedDateTo = '';
    let formattedAppliedDate = '';
    if (dateFrom) {
        const dateFromData = new Date(dateFrom);
        const formattedFrom = geFullDate(dateFromData, true);
        const nameofweek = dateFromData.toLocaleDateString("en-US", {
            weekday: "short",
        });
        formattedDateFrom =`${formattedFrom}, ${nameofweek}`;
    }

    if (dateTo) {
        const dateToData = new Date(dateTo);
        const formattedTo = geFullDate(dateToData, true);
        const nameofweek = dateToData.toLocaleDateString("en-US", {
            weekday: "short",
        });
        formattedDateTo = `${formattedTo}, ${nameofweek}`;
    }

    if (appliedDate) {
        const appliedDateData = new Date(appliedDate);
        formattedAppliedDate = appliedDateData.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        });
    }

    const approvalStatus =
        isApproved === true
            ? "Approved"
            : "Pending";

    const approvalStatusStyle = [
        styles.smallText,
        approvalStatus === "Approved" && styles.approved,
        approvalStatus === "Pending" && styles.awaiting,
    ];

    // Define styles based on leave name
    const leaveNameStyle = [
        styles.smallText,
        leaveName === "Casual Leave" && styles.casualLeave,
        leaveName === "Sick Leave" && styles.sickLeave,
        leaveName === "Annual Leave" && styles.annualLeave,
    ];

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.first}>
                    <Text style={[styles.boldText, {color: "#00072D"}]}>{name}</Text>

                    {leaveReason ? (
                        <Text style={leaveNameStyle}>{leaveName} ({leaveReason})</Text>
                    ) : (
                        <Text style={leaveNameStyle}>{leaveName}</Text>
                    )}
                </View>
                <View style={styles.second}>
                    {(formattedDateFrom && formattedDateTo) && (
                        <Text style={[styles.smallText, {color: "#00072D"}]}>
                            {formattedDateFrom} - {formattedDateTo}
                        </Text>
                    )}
                    {(startTime && endTime) && (
                        <Text style={[styles.smallText, {color: "#00072D"}]}>
                           Time: {startTime} - {endTime}
                        </Text>
                    )}
                    {(requestedTime) && (
                        <Text style={[styles.smallText, {color: "#00072D"}]}>
                            Requested Time: {requestedTime}
                        </Text>
                    )}
                    <Text style={styles.smallText}>Approver: ({approver})</Text>
                    <Text style={approvalStatusStyle}>Status:{approvalStatus}</Text>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    card: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 15,
        borderColor: "#f0f0f0",
        borderWidth: 2,
        marginBottom: 12,
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 10,
        justifyContent: "space-between",
        flexDirection: "row",

    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    smallText: {
        fontSize: 12,
        color: "black",
    },
    first: {
        width: "60%"
    },
    second: {
        width: "40%",
    },
    boldText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    approved: {
        color: "green",

        paddingHorizontal: 4,
        borderRadius: 5,

    },
    declined: {
        color: "red",
    },
    awaiting: {
        color: "red",

        paddingHorizontal: 4,
        borderRadius: 5
    },
    casualLeave: {
        color: "black",
    },
    sickLeave: {
        color: "black",
    },
    annualLeave: {
        color: "black",
    },
});

export default LeaveCard;
