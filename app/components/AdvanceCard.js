import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {geFullDate} from "../utils";

const AdvanceCard = ({name, deductionFrom, advanceType, amount, isApproved, reason, approver, isBS}) => {
    let formattedDeductionFrom = '';
    if (deductionFrom) {
        const dateFromData = new Date(deductionFrom);
         formattedDeductionFrom = geFullDate(dateFromData, isBS);
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
        advanceType === advanceType && styles.casualLeave,
    ];

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.first}>
                    <Text style={[styles.boldText, {color: "#00072D"}]}>{name}</Text>

                    {reason ? (
                        <Text style={leaveNameStyle}>{advanceType} ({reason})</Text>
                    ) : (
                        <Text style={leaveNameStyle}>{advanceType}</Text>
                    )}
                    <Text style={styles.approverSt}>Approver: ({approver})</Text>
                </View>
                <View style={styles.second}>
                    {(formattedDeductionFrom) && (
                        <Text style={[styles.smallText, {color: "#00072D"}]}>
                            Date : {formattedDeductionFrom}
                             {'\n'}
                            Total Amount : {amount} 

                        </Text>
                    )}
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
        width: "60%",
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

        borderRadius: 5,
        flex: 1,  // Allow the container to take all available space
         justifyContent: 'flex-end',  // Align text to the bottom
        alignItems: 'flex-start', 
    },
     approverSt: {
        fontSize: 12,
        color: "black",
       flex: 1,  // Allow the container to take all available space
         justifyContent: 'flex-end',  // Align text to the bottom
        alignItems: 'flex-start', 

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

export default AdvanceCard;
