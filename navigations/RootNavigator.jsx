import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import modalsConfig from './modalsConfig';
import PageLoader from '../loaders/PageLoager';

const Stack = createNativeStackNavigator();

const SettingsStack = lazy(() => import('./stacks/SettingsStack'));
const IDStack = lazy(() => import('./stacks/IDStack'));

const RootNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={TabsNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                options={{ headerShown: false, fullScreenGestureEnabled: true }}
            >
                {(props) => (
                    <Suspense fallback={<PageLoader />}>
                        <SettingsStack {...props} />
                    </Suspense>
                )}
            </Stack.Screen>
            <Stack.Screen
                name="IDStack"
                options={{ headerShown: false, fullScreenGestureEnabled: true }}
            >
                {(props) => (
                    <Suspense fallback={<PageLoader />}>
                        <IDStack {...props} />
                    </Suspense>
                )}
            </Stack.Screen>
            {modalsConfig.map(({ name, component: Component, props }) => (
                <Stack.Screen key={name} name={name} options={{ headerShown: false, ...props }}>
                    {(navProps) => (
                        <Suspense fallback={<PageLoader />}>
                            <Component {...navProps} />
                        </Suspense>
                    )}
                </Stack.Screen>
            ))}
        </Stack.Navigator>
    );
};
export default RootNavigator;
