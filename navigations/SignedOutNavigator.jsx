import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/signed-out/MainScreen'
import LoginModal from '../modals/Login'
const Stack = createNativeStackNavigator();

const SignedOutNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainOutLog"
                component={MainScreen}
                options={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#000000' }
                }}
            />
            <Stack.Screen
                name="LoginModal"
                component={LoginModal}
                options={{
                    presentation: 'modal',
                    headerShown: false,
                    cardStyle: { backgroundColor: '#000000' }
                }}
            />
        </Stack.Navigator>
    );
};

export default SignedOutNavigator