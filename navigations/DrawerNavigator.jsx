import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../screens/home/Drawer';
import Main from '../screens/home/Main';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '80%',
          backgroundColor: '#fff',
        },
      }}
    >
      <Drawer.Screen name="Home" component={Main} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
