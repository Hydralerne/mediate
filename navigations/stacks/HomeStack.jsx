import React, { memo, Suspense } from 'react';

import HomeScreen from '../../screens/tabs/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import sharedConfig from '../sharedConfig';
import PageLoader from '../../loaders/PageLoager';
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                fullScreenGestureEnabled: true,
                animationDuration: 200,
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />
            {sharedConfig.map(({ name, component: Component, props }) => (
                <Stack.Screen
                    key={name}
                    name={name}
                    options={{
                        headerShown: false,
                        ...props,
                    }}
                >
                    {(navProps) => (
                        <Suspense fallback={<PageLoader />}>
                            <Component {...navProps} />
                        </Suspense>
                    )}
                </Stack.Screen>
            ))}
        </Stack.Navigator>
    );
}

export default HomeStack