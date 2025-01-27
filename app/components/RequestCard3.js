import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RequestCard3 = ({user, appliedDate, fields, onApprove, onReject, isApproved, isRejected, canApproveAndReject, canRejectOnly}) => {

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user}</Text>
          <Text style={styles.appliedDate}>Applied on {appliedDate}</Text>
        </View>
      </View>
      <View style={styles.body}>
        {fields.map((field, index) => (
          <Text key={index} style={styles.infoText}>{field.title}: {field.value}</Text>
        ))}
      </View>

      {!(isRejected || isApproved) && (
          <View style={styles.footer}>
            <TouchableOpacity
                style={[styles.approveButton, !canApproveAndReject && styles.approveButton]}
                onPress={onApprove}
                disabled={!canApproveAndReject}
            >
              <Text style={styles.buttonText}>APPROVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.rejectButton, !(canRejectOnly  || canApproveAndReject) && styles.rejectButton]}
                onPress={onReject}
                disabled={!(canRejectOnly || canApproveAndReject)}
            >
              <Text style={styles.buttonText}>REJECT</Text>
            </TouchableOpacity>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
     elevation: 10,

  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appliedDate: {
    color: '#888',
    fontSize: 12,
  },
  body: {
    marginBottom: 10,
  },
  leaveType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sickLeave: {
    color: 'green',
  },
  casualLeave: {
    color: 'blue',
  },
  annualLeave: {
    color: 'orange',
  },
  unpaidLeave: {
    color: 'red',
  },
  officialVisit: {
    color: 'purple',
  },
  lateInEarlyOut: {
    color: 'brown',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RequestCard3;
