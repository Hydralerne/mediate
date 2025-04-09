import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import Main from '../screens/onboarding/Main';
import WebsiteDashboard from '../screens/dashboard/Main';
import WebsitePreview from '../screens/dashboard/WebsitePreview';
import EditorRouter from './EditorRouter';
const Stack = createNativeStackNavigator();
import { BottomSheetProvider } from '../contexts/BottomSheet';
import { DashboardProvider } from '../contexts/DashboardContext';
import Assistant from '../screens/assistant/Main';

const RootNavigator = () => {

    return (
        <DashboardProvider>
            <BottomSheetProvider>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        contentStyle: { backgroundColor: 'transparent' },
                        fullScreenGestureEnabled: true,
                    }}
                >
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
                    <Stack.Screen
                        name="WebsitePreview"
                        component={WebsitePreview}
                        options={{
                            presentation: 'modal',
                        }}
                    />
                    <Stack.Screen
                        name="EditorSheet"
                        component={EditorRouter}
                        options={{
                            animation: 'slide_from_right',
                            presentation: 'card',
                            fullScreenGestureEnabled: false,
                        }}
                    />
                    <Stack.Screen
                        name="Assistant"
                        component={Assistant}
                    />
                </Stack.Navigator>
            </BottomSheetProvider>
        </DashboardProvider>
    );
};

export default React.memo(RootNavigator);
