import React, { useContext, useEffect, useState } from "react";

import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ToastWrapper from "./ToastWrapper";
import AuthStack from "./AuthStack";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminDrawer from "./AdminDrawer";
import AppDrawer from "./AppDrawer";

const AppNav = () => {
  const { isLoading, userToken, moduleName } = useContext(AuthContext);
  // console.log("module Name app nav", moduleName);
  const navigationRef = useNavigationContainerRef();
  const [userModuleName, setModuleName] = useState(null);
  const [token, setToken] = useState(null);

  const customMiddleware = (state) => {
    if (!state) {
      return;
    }

    const currentRoute = state.routeNames[state.index];
    const originalNavigate = navigationRef.current.navigate;

    navigationRef.current.navigate = (routeName, params) => {
      console.log("Navigation to:", routeName, "with params:", params);

      if (!userToken && routeName !== 'Login') {
        console.log('User not authenticated, redirecting to Login.');
        return originalNavigate('Login');
      }

      return originalNavigate(routeName, params);
    };
  };

  const fetchstorageValues = async () => {
    const mn = await AsyncStorage.getItem("moduleName");
    const token =  await AsyncStorage.getItem("userToken");
    setModuleName(mn);
    setToken(token);
  }

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener("state", (e) => {
      customMiddleware(e.data.state);
    });

    fetchstorageValues();

    return unsubscribe;
  }, [navigationRef, token]);
  // }, []);

  const renderLoading = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  );

  if (isLoading) {
    return renderLoading();
  }

  return (
    // <DrawerNavigator />
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
         {userToken === null ? (
            <AuthStack />
          ) : moduleName === "DashboardAdmin" || userModuleName === "DashboardAdmin"? (
            <AdminDrawer />
          ) : (
          <AppDrawer />
        )}
      </NavigationContainer>
      <ToastWrapper />
    </GestureHandlerRootView>
  );
};

export default AppNav;
