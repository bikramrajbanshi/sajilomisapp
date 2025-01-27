import React, { useContext, useEffect, useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './AuthStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AdminStack from './AdminStack';
import AppStack from './AppStack';
import ToastWrapper from './ToastWrapper';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { userToken, moduleName, logout } = useContext(AuthContext);
  const navigationRef = useNavigationContainerRef();
  const [userModuleName, setModuleName] = useState(null);

  const fetchStorageValues = async() => {
    const mn = await AsyncStorage.getItem('moduleName');
    setModuleName(mn);
  };

  const customMiddleware = (state) => {
    if (!state) {
        return;
    }

    const currentRoute = state.routeNames[state.index];
    const originalNavigate = navigationRef.current.navigate;

    navigationRef.current.navigate = (routeName, params) => {
        console.log('Navigation to: ', routeName, 'with params: ', params);

        if(!userToken && routeName != 'Login') {
            console.log('User not authenticated, redirecting to Login.');
            return originalNavigate('Login');
        }

        return originalNavigate(routeName, params);
    };
  };

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener('state', (e) => {
        customMiddleware(e.data.state);
    });

    fetchStorageValues();

    return unsubscribe;
  }, [navigationRef, userToken]);
  
  if (userToken === null) {
    return (
        <NavigationContainer ref={navigationRef}>
            <AuthStack />
        </NavigationContainer>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator initialRouteName='Home1'>
                {moduleName != 'DashboardAdmin' ||  userModuleName != 'DashboardAdmin' ? (
                    <Drawer.Screen name='Admin Home' component={AdminStack}/>
                ) : (
                    <Drawer.Screen name='User Home' component={AppStack} />
                )}
            </Drawer.Navigator>
        </NavigationContainer>
        <ToastWrapper />
    </GestureHandlerRootView>
  )
}

export default DrawerNavigator