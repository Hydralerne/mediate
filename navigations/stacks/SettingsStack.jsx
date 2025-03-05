import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsProvider } from '../../contexts/SettingsProvider';
import PageLoader from '../../loaders/PageLoager';

const Stack = createNativeStackNavigator();

const Main = lazy(() => import('../../screens/settings/Main'));
const YourAccount = lazy(() => import('../../screens/settings/YourAccount'));
const Inbox = lazy(() => import('../../screens/settings/Inbox'));
const Notifications = lazy(() => import('../../screens/settings/Notifications'));
const Saftey = lazy(() => import('../../screens/settings/Saftey'));

const SettingsStack = () => {
    return (
        <SettingsProvider>
            <Stack.Navigator
                screenOptions={{
                    fullScreenGestureEnabled: true,
                    headerShown: false,
                }}
            >
                <Stack.Screen name="MainSettings">
                    {(props) => (
                        <Suspense fallback={<PageLoader />}>
                            <Main {...props} />
                        </Suspense>
                    )}
                </Stack.Screen>
                <Stack.Screen name="YourAccount">
                    {(props) => (
                        <Suspense fallback={<PageLoader />}>
                            <YourAccount {...props} />
                        </Suspense>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Saftey">
                    {(props) => (
                        <Suspense fallback={<PageLoader />}>
                            <Saftey {...props} />
                        </Suspense>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Inbox">
                    {(props) => (
                        <Suspense fallback={<PageLoader />}>
                            <Inbox {...props} />
                        </Suspense>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Notifications">
                    {(props) => (
                        <Suspense fallback={<PageLoader />}>
                            <Notifications {...props} />
                        </Suspense>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </SettingsProvider>
    );
};

export default SettingsStack;
