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
      setUserList(presentListData);
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
    const department = item.departmentName;
    const contactNumber = item.contactNo;
    const email = item.email;
    const userId = item.userId;

    return (
      <View style={styles.row}>
        <Text
          style={[styles.cell, styles.nameCell]}
        >
          {name}({userId})
        </Text>
        <Text style={styles.cell}>{branch}</Text>
        <Text style={styles.cell}>{department}</Text>
        <Text style={styles.cell}>{contactNumber}</Text>
        <Text style={[styles.cell, styles.emailCell]}>{email}</Text>
        <TouchableOpacity
          style={[ styles.cell]}
          onPress={() => navigation.navigate("UserDetail", { userId: userId })}
        >
          <Ionicons name="settings-sharp" size={20} color="#4CAF50" />
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
      <ScrollView horizontal>
        <View>
          <View style={styles.header}>
            <Text style={[styles.headerText, styles.nameCell]}>Name</Text>
            <Text style={styles.headerText}>Branch</Text>
            <Text style={styles.headerText}>Department</Text>
            <Text style={styles.headerText}>Contact No.</Text>
            <Text style={[styles.headerText, styles.emailCell]}>Email</Text>
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
      </ScrollView>
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
     marginVertical: 4,
     justifyContent: "left",
     marginHorizontal: 0,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000",
    paddingHorizontal: 10,
    width: 120,
  },

  row: {
    flexDirection: "row",
    marginVertical: 4,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 0,
  },
  emailCell:{
  minWidth:200,
  },
  cell: {
    width: 120,
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 0, 
  },

actionCell:{
width: 120,
},
});

export default AllUserListScreen;
