import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import APIKit, { loadToken } from "../shared/APIKit";
import ApprovalStack from "./ApprovalStack";
import { useApproval } from "../context/AuthContext";
import {fetchApprovalCount} from "../utils/GetApprovalCount";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ScreenStacks = ({ screens, navigation }) => {
  return (
    <Stack.Navigator>
      {screens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={typeof screen.options === 'function' ? screen.options(navigation) : screen.options}
        />
      ))}
    </Stack.Navigator>
  );
};

const TabNavigator1 = ({ serviceScreens, homeScreens, otherScreens }) => {
  const { setApprovalCount,approvalCount } = useApproval();

  useEffect(() => {
    loadToken();
    const getBadgeData = async () => {
      const approvalCount = await fetchApprovalCount();
      const totalCount = approvalCount.leavePending + approvalCount.officeVisitPending +
          approvalCount.attendacePending  + approvalCount.lateInEarlyOutsPending + approvalCount.overTimePending
          + approvalCount.requestLeavePending + approvalCount.leaveEncashmentPending +  approvalCount.shiftChangeRequestPending
          +  approvalCount.advancePaymentRequestPending;
      setApprovalCount(totalCount);
    };
    getBadgeData();
  }, []);

  const resetToInitialScreen = (navigation, screenName) => {
    navigation.navigate(screenName, {
      screen: screenName,
    });
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarInactiveTintColor: "#000",
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tab.Screen
        name="Service"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="apps" color={color} size={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            resetToInitialScreen(navigation, serviceScreens[0].name);
          },
        })}
      >
        {({ navigation }) => <ScreenStacks screens={serviceScreens} navigation={navigation} />}
      </Tab.Screen>  

      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            resetToInitialScreen(navigation, homeScreens[0].name);
          },
        })}
      >
        {({ navigation }) => <ScreenStacks screens={homeScreens} navigation={navigation} />}
      </Tab.Screen>

      {otherScreens.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          options={{
            tabBarBadge: approvalCount,
            tabBarBadgeStyle: screen.badgeStyle,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={screen.icon} color={color} size={size} />
            ),
          }}
          listeners = {({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              if (screen.name === "Approval") {
                navigation.navigate(screen.name, {
                  screen: "ApprovalMain",
                });
              } else {
                resetToInitialScreen(navigation, screen.name);
              }
            },
          })}
          >
            {({ navigation }) => {
              if (screen.name === "Approval") {
                return <ApprovalStack />;
              }
              return <ScreenStacks screens={[screen]} navigation={navigation} />;
            }}

            {/* if (screen.name === 'Approval') {
              return <ApprovalStack />
            }
            return <ScreenStacks screens={[screen]} navigation={navigation} />;
          }}  */}
          {/* {({ navigation }) => (
            <Stack.Navigator>
              <Stack.Screen name={screen.name} component={screen.component} />
              {screen.name === 'Approval' && (
                <>
                  <Stack.Screen name="UpcomingLeave" component={UpcomingLeaveRequestScreen} />
                </>
              )}
            </Stack.Navigator>
          )} */}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator1;
