import React, { createContext, useEffect, useState, useContext } from "react";

import APIKit, { setClientToken, setClientId } from "../shared/APIKit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import  {fetchBadgeData} from "../utils/GetApprovalCount";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [clientId, setClientIdState] = useState(null);
  const [moduleName, setModuleName] = useState(null);
  const [approvalCount, setApprovalCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [officialCount, setOfficialCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [overtimeCount, setOvertimeCount] = useState(0);
  const [shiftChangeCount, setShiftChangeCount] = useState(0);
  const [leaveEncashmentCount, setLeaveEncashmentCount] = useState(0);
  const [advancePaymentCount, setAdvancePaymentCount] = useState(0);
  const [requestLeaveCount, setRequestLeaveCount] = useState(0);

  const login = async (username, password, isChecked, clientId) => {
    if (!clientId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Domain is incorrect.",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      setClientId(clientId);
      const res = await APIKit.post("Account/Login", { username, password });
      let userInfo = res.data;
      // console.log("userdata", userInfo);
      const firstUserRolePermission = userInfo.userRolePermission[0];
      const moduleName = firstUserRolePermission.moduleName;
      // console.log("module name auth context bata ", moduleName);
      setModuleName(moduleName);
      setUserInfo(userInfo);
      setUserToken(userInfo.tokenId);
      setClientToken(userInfo.tokenId);
      await AsyncStorage.setItem("moduleName", moduleName);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      await AsyncStorage.setItem("userToken", userInfo.tokenId);
      await AsyncStorage.setItem("userName", username);
    } catch (e) {
      // console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("moduleName");
    } catch (e) {
      console.error("Failed to remove token", e);
    }
    setUserToken(null);
    setUserInfo(null);
    setIsLoading(false);
    setModuleName(null);
    setClientToken(null);
  };


  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("userToken");
      let userInfo = await AsyncStorage.getItem("userInfo");

      if (userToken) {
        setUserToken(userToken);
        setUserInfo(JSON.parse(userInfo));
        setClientToken(userToken);
      }
    } catch (e) {
      console.log(`isLoggedIn error ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
    value={{ login, logout, isLoading, userToken, userInfo, setClientIdState, moduleName, approvalCount, setApprovalCount, attendanceCount, setAttendanceCount,
      leaveCount, setLeaveCount,officialCount, setOfficialCount, lateCount, setLateCount, overtimeCount, setOvertimeCount, shiftChangeCount, setShiftChangeCount,
      leaveEncashmentCount, setLeaveEncashmentCount, advancePaymentCount, setAdvancePaymentCount, requestLeaveCount, setRequestLeaveCount}}
      >
      {children}
      </AuthContext.Provider>
      );
    };

    // Custom hook to use the ApprovalContext
//
    export const useApproval = () => useContext(AuthContext);
