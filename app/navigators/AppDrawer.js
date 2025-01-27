import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppStack from './AppStack';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Drawer.Screen name="UserHome" component={AppStack} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
