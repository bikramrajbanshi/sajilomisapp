import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminStack from './AdminStack';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Remove DrawerNavigation header
      }}
    >
      <Drawer.Screen name="AdminHome" component={AdminStack} />
    </Drawer.Navigator>
  );
};

export default AdminDrawer;
