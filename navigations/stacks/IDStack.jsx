import React, { memo } from 'react';

import ID from '../../screens/ID/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function IDStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                fullScreenGestureEnabled: true,
                animationDuration: 200,
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="IDScreen"
                component={ID}
            />
        </Stack.Navigator>
    );
}

export default IDStack