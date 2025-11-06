import React from 'react';
import { enableScreens, enableFreeze } from 'react-native-screens';
import Main from './main';
import { I18nManager } from 'react-native';
import { UserProvider } from '../contexts/UserContext';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from '../utils/colors';
// import firebase from '../services/firebase'

enableScreens(true);

I18nManager.allowRTL(false);

function App() {
    const theme = colors.themes
    return (
        <SafeAreaProvider>
            <NavigationContainer theme={theme}>
                <UserProvider>
                    <Main />
                </UserProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

registerRootComponent(App);

export default App;