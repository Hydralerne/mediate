import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { BottomSheetProvider } from '../contexts/BottomSheet';
import Assistant from '../screens/assistant/Main';

const RootNavigator = () => {
    return (
        <BottomSheetProvider>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name="Assistant"
                    component={Assistant}
                />
            </Stack.Navigator>
        </BottomSheetProvider>
    );
};

export default React.memo(RootNavigator);
