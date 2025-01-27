// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Ionicons from "react-native-vector-icons/Ionicons";

// //Screens
// import HomeScreen from "../views/HomeScreen";
// import ApprovalScreen from "../views/ApprovalsScreen";
// import ServicesScreen from "../views/ServicesScreen";

// //Screen names
// const homeName = "Home";
// const servicesName = "Services";
// const approvalsName = "Approvals";
// const moreName = "More";

// const Tab = createBottomTabNavigator();

// const MainContainer = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName={homeName}
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;
//           let rn = route.name;

//           if (rn === homeName) {
//             iconName = focused ? "home" : "home-outline";
//           } else if (rn === servicesName) {
//             iconName = focused ? "apps" : "apps-outline";
//           } else if (rn === approvalsName) {
//             iconName = focused
//               ? "checkmark-circle"
//               : "checkmark-circle-outline";
//           } else if (rn === moreName) {
//             iconName = focused ? "list-circle" : "list-circle-outline";
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "orange",
//         tabBarInactiveTintColor: "grey",
//         tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
//         tabBarStyle: { padding: 10, height: 70, backgroundColor: '#00072D' },
//       })}
//     >
//       <Tab.Screen
//         name={servicesName}
//         component={ServicesScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name={homeName}
//         component={HomeScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name={approvalsName}
//         component={ApprovalScreen}
//         options={{ headerShown: false }}
//       />
//       {/* <Tab.Screen name={moreName} /> */}
//     </Tab.Navigator>
//   );
// };

// export default MainContainer;
