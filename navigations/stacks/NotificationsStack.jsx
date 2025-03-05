import NotificationsScreen from '../../screens/tabs/NotificationsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import sharedConfig from '../sharedConfig';
import { memo, Suspense } from 'react';
import PageLoader from '../../loaders/PageLoager';

const Stack = createNativeStackNavigator();

function NotificationsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                fullScreenGestureEnabled: true,
                animationDuration: 200,
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="NotificationsScreen"
                component={NotificationsScreen}
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

export default NotificationsStack