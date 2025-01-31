import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import APIKit, { loadToken } from "../../shared/APIKit";

const AllUserListScreen = ({ navigation }) => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadToken();
    fetchUserListData();
  }, []);

  const fetchUserListData = async () => {
    try {
      const response = await APIKit.get(`/account/GetUserRelationList`);
      const presentListData = response.data;
      presentListData.forEach(item => {
    delete item.userProfileImage;
});
      const filteredData = presentListData.filter(item => item.status != 2 && item.status != 4);
      setUserList(filteredData);
    } catch (error) {
      console.error("Error fetching present list data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const name = `${item.firstName} ${item.lastName}`;
    const branch = item.branchName;
    const designation = item.designationName;
    const department = item.departmentName;
    const contactNumber = item.contactNo;
    const email = item.email;
    const userId = item.userId;

    return (
      <View style={styles.row}>
        <Text
          style={styles.nameCell}
        >
          {name}({userId})
          <Text style={styles.designation}>
          {`\n${designation}`}
           </Text>
        </Text>
        <Text style={styles.cell}>{branch}</Text>
        <Text style={styles.cell}>{department}</Text>
        <TouchableOpacity
          style={[ styles.cell]}
          onPress={() => navigation.navigate("UserDetail", { userId: userId })}
        >
          <Ionicons style={styles.actionCell} name="settings-sharp" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserListData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerNameText}>Name</Text>
            <Text style={styles.headerText}>Branch</Text>
            <Text style={styles.headerText}>Department</Text>
          </View>
          <FlatList
            data={userList}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'visible',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: "lightgray",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 2,
     marginVertical: 4,
     justifyContent: "left",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000",
     width: '25%',
  },
  headerNameText:{
   fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000",
    width: '40%',
  },


  row: {
    flexDirection: "row",
    marginVertical: 4,
    paddingVertical: 12,
    paddingHorizontal: 2,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  nameCell:{
   width: '40%',
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 0, 
  },
  cell: {
     width: '25%',
    fontSize: 13,
    color: "#333",
    paddingVertical: 0, 
  },

  designation: {
     width: '25%',
    fontWeight: "normal",
    fontSize: 11,
    color: "#333",
    paddingVertical: 0, 
  },
actionCell:{
width: '20%',
textAlign: "center",
justifyContent: "center",
},
});

export default AllUserListScreen;
