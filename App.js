import React, { useContext, useEffect, useRef } from "react";
import { AuthContext, AuthProvider } from "./app/context/AuthContext";
import AppNav from "./app/navigators/AppNav";
import APIKit from "./app/shared/APIKit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import ToastWrapper from "./app/navigators/ToastWrapper";


const App = () => {
  return (
    <AuthProvider>
      <MainApp />
      <ToastWrapper />
    </AuthProvider>
  );
};

const MainApp = () => {
  const { logout } = useContext(AuthContext);
  const navigationRef = useRef();

  useEffect(() => {
    const setupInterceptors = () => {
      APIKit.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          // console.log("error", error.response.message);
          if (error.response.status === 401) {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userInfo");
            logout();
            // navigationRef.current?.navigate("Login");
            return Promise.reject(error);
          } else if (error.response.status === 400) {
            Toast.show({
              type: "error",
              text1: "Login Error",
              text2: "Invalid credentials, please try again.",
            });
            // navigationRef.current?.navigate("Login");
          } else {
            // console.log("else ma gayo");
          }

          return Promise.reject(error);
        }
      );
    };

    setupInterceptors();
  }, [logout]);

  return (
    <>
      <AppNav navigationRef={navigationRef} />
        <ToastWrapper />
    </>
  );
};

export default App;
