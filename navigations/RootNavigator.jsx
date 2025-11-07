import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { BottomSheetProvider } from '../contexts/BottomSheet';
import DrawerNavigator from './DrawerNavigation';

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
            </Stack.Navigator>
        </BottomSheetProvider>
    );
};

export default React.memo(RootNavigator);
