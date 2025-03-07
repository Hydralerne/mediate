import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './screens/home/Main';
import CustomDrawerContent from './components/CustomDrawerContent';

// Create navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Main stack that will be inside the drawer
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainHome" component={Main} />
      {/* Add other screens here */}
    </Stack.Navigator>
  );
};

// Root component with drawer navigation
const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '80%',
          },
        }}
      >
        <Drawer.Screen name="MainStack" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App; 