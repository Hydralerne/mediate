import * as Font from 'expo-font';
import { Platform } from 'react-native';

export async function loadFonts() {
    try {
        if (Platform.OS == 'android') {
            await Font.loadAsync({
                'main': require('../assets/fonts/arabic.ttf'),
            });
        }
    } catch (e) {
        console.log(e)
    }
}