import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { BottomSheetProvider } from '../contexts/BottomSheet';
import DrawerNavigator from './DrawerNavigation';
import Premium from '../screens/Premium';

const RootNavigator = () => {
    return (
        <BottomSheetProvider>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNavigator}
                />
                <Stack.Screen
                    name="Premium"
                    component={Premium}
                    options={{
                        presentation: 'modal'
                    }}
                />
            </Stack.Navigator>
        </BottomSheetProvider>
    );
};

export default React.memo(RootNavigator);
