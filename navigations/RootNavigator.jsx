import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageLoader from '../loaders/PageLoager';
import Main from '../screens/home/Main';
import Dashboard from '../screens/dashboard/Dashboard';
import ModernDashboard from '../screens/dashboard/ModernDashboard';
import CreatorDashboard from '../screens/dashboard/CreatorDashboard';

const Stack = createNativeStackNavigator();

const SettingsStack = lazy(() => import('./stacks/SettingsStack'));

const SettingsScreen = React.memo(({ ...props }) => (
    <Suspense fallback={<PageLoader />}>
        <SettingsStack {...props} />
    </Suspense>
));

const RootNavigator = () => {
    const defaultScreenOptions = {
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
    };

    const settingsScreenOptions = {
        ...defaultScreenOptions,
        fullScreenGestureEnabled: true,
    };

    return (
        <Stack.Navigator screenOptions={defaultScreenOptions}>
            <Stack.Screen
                name="Home"
                component={Main}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={settingsScreenOptions}
            />
        </Stack.Navigator>
    );
};

export default React.memo(RootNavigator);
