import React, { Suspense } from 'react';
import DiscoveryScreen from '../../screens/tabs/DiscoveryScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import sharedConfig from '../sharedConfig';
import PageLoader from '../../loaders/PageLoager';

const Stack = createNativeStackNavigator();

function DiscoveryStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                fullScreenGestureEnabled: true,
                animationDuration: 200,
                headerShown: false,
            }}
        >
            <Stack.Screen name="HomeScreen" component={DiscoveryScreen} />
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

export default DiscoveryStack;
