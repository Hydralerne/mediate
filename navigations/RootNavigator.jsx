import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { BottomSheetProvider } from '../contexts/BottomSheet';
import { DashboardProvider } from '../contexts/DashboardContext';
import Assistant from '../screens/assistant/Main';

const RootNavigator = () => {
    return (
        <DashboardProvider>
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
        </DashboardProvider>
    );
};

export default React.memo(RootNavigator);
