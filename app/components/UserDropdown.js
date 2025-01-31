import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { fetchUserList } from '../utils/apiUtils'; // Assuming fetchUserList is in apiUtils.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useModuleName} from "../utils/hooks/useModuleName";
import {AuthContext} from "../context/AuthContext";
import APIKit, {loadToken} from "../shared/APIKit";
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserDropdown = ({ onSelect, selectedValue, placeholder = "Select a user" }) => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const moduleName = useModuleName();
  const {userInfo} = useContext(AuthContext);
  const userId = userInfo.userId;


  useEffect(() => {
    loadToken();
    if (moduleName === "DashboardAdmin") {
      setIsAdmin(true);
    }
    else
    {
      setUserList(prevUserList => [
  ...prevUserList.filter(user => user.id !== userId),  // Remove existing user with the same id
  { id: userId, name: `${userInfo.firstName} ${userInfo.lastName} (${userId})` }
]);
    }
  }, [moduleName]);

  useEffect(() => {
  }, [current]);

  useEffect(() => {
    if(isAdmin == true)
    {

    // Fetch user list when component mounts
      const loadUsers = async () => {
        try {
          const users = await fetchUserList();
          setUserList(users);
        } catch (error) {
          console.error('Error fetching user list:', error);
        }
      };
      
         loadUsers();  // Wait for users to load
       }

       
     }, [isAdmin]);

  useEffect(() => {
    // Only run when userList is updated
    const loadCurrentuser = async () => {
      if (userList.length > 0) {
        let clientDetail = await AsyncStorage.getItem("userInfo");
            clientDetail = JSON.parse(clientDetail); // Parse the string into a JSON object
            const a = userList.find(user => user.id === clientDetail.userId);
            handleSelectUser({ id: clientDetail.userId});
            setCurrent(a);
          }
        };

    loadCurrentuser(); // Run after userList is populated
}, [userList]); // Run this effect when userList changes

  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectUser = (id) => {
    onSelect(id.id);
    const a = userList.find(user => user.id === id.id);
    setCurrent(a);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
    <Text style={[styles.pickerText, { flex: 1 }]}>
    {current ? current.name : "Select User"}
    </Text>
    <Ionicons name="chevron-down" size={20} style={{  }} color="black"/>
    </TouchableOpacity>

  {/* Modal for searching inside picker */}
  <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
  >
  <TouchableOpacity 
    style={styles.modalOverlay} 
    onPress={() => setModalVisible(false)} // Close the modal when background is touched
    >
  <View style={styles.modalOverlay}>
  <View style={styles.modalContent}>
  <TextInput
  style={styles.searchInput}
  placeholder="Search..."
  value={searchTerm}
  onChangeText={(text) => setSearchTerm(text)}
  />
  <FlatList
  data={filteredUsers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
    style={styles.userItem}
    onPress={() => handleSelectUser({ id: item.id })}
    >
    <Text>{item.name}</Text>
    </TouchableOpacity>
    )}
  />
  </View>
  </View>
  </TouchableOpacity>
  </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  pickerButton: {
    height: 40,
    width: '97%',
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  pickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  modalTouchPad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Full screen width
    height: '100%', // Full screen height
    backgroundColor: 'rgba(0, 0, 0, 0.3)',


  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },

  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default UserDropdown;
