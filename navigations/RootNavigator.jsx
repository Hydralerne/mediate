import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import Main from '../screens/onboarding/Main';
import WebsiteDashboard from '../screens/dashboard/Main';

const Stack = createNativeStackNavigator();
import { BottomSheetProvider } from '../contexts/BottomSheet';

const RootNavigator = () => {
    const defaultScreenOptions = {
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
    };

    return (
        <BottomSheetProvider>
            <Stack.Navigator screenOptions={defaultScreenOptions}>
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNavigator}
                />
                <Stack.Screen
                    name="SetupSite"
                    component={Main}
                    options={{
                        contentStyle: { backgroundColor: '#000' }
                    }}
                />
                <Stack.Screen
                    name="WebsiteDashboard"
                    component={WebsiteDashboard}
                    options={{
                        animation: 'slide_from_right',
                        presentation: 'card',
                    }}
                />
            </Stack.Navigator>
        </BottomSheetProvider>
    );
};

export default React.memo(RootNavigator);
