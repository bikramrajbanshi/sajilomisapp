import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RequestCard2 = ({user, fields, onApprove, onReject, onRecommend, onRecommendReject, isApproved, isRejected, canApproveAndReject, canRecommendAndReject}) => {

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/*<Text style={styles.userName}>{user}</Text>*/}
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.userName}>{user}</Text>
        {fields.map((field, index) => (
          <Text key={index} style={styles.infoText}><Text style={styles.heading}>{field.title}:</Text> {field.value}</Text>
        ))}
      </View>

      {(!(isRejected || isApproved) && (canApproveAndReject)) && (
          <View style={styles.footer}>
            <TouchableOpacity
                style={styles.approveButton}
                onPress={onApprove}
                disabled={!canApproveAndReject}
            >
              <Text style={styles.buttonText}>APPROVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.rejectButton}
                onPress={onReject}
            >
              <Text style={styles.buttonText}>REJECT</Text>
            </TouchableOpacity>
          </View>
      )}

      {(!(isRejected || isApproved) && (canRecommendAndReject)) && (
          <View style={styles.footer}>
            <TouchableOpacity
                style={styles.approveButton}
                onPress={onRecommend}
                disabled={!canRecommendAndReject}
            >
              <Text style={styles.buttonText}>RECOMMEND</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.rejectButton}
                onPress={onRecommendReject}
                disabled={!(canRecommendAndReject)}
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
    paddingHorizontal:10,
    paddingVertical:5,
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

  appliedDate: {
    color: '#888',
    fontSize: 12,
  },
  body: {
    marginBottom: 10,
    flexDirection:'row',
   flexWrap:'wrap',

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
    width:'50%',
  },
  userName:{
   fontSize: 16,
    marginBottom: 2,
    width:'100%',
    fontWeight:'bold',
    textAlign:'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 7,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 7,
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
  heading:{
  fontWeight:'bold',
  },
});

export default RequestCard2;
