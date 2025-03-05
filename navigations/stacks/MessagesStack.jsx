

import MessageScreen from '../../screens/tabs/MessagesScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import sharedConfig from '../sharedConfig';
import { memo, Suspense } from 'react';
import PageLoader from '../../loaders/PageLoager';

const Stack = createNativeStackNavigator();

function MessagesStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                fullScreenGestureEnabled: true,
                animationDuration: 200,
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="MessageScreen"
                component={MessageScreen}
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

export default MessagesStack