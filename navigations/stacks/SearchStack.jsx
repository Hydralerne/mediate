import SearchScreen from '../../screens/tabs/SearchScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import sharedConfig from '../sharedConfig';
import { Suspense } from 'react';
import PageLoader from '../../loaders/PageLoager';

const Stack = createNativeStackNavigator();

function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                animationDuration: 200,
                fullScreenGestureEnabled: true,
                headerShown: false,
            }}
        >
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            
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

export default SearchStack;
