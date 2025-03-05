import { Appearance } from 'react-native'
import { DefaultTheme } from '@react-navigation/native';

const dark = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000000',
    },
};

const light = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#ffffff',
    },
};

const mainSecound = '#7e7e8a'

const rawColors = {
    secoundBackground: { dark: '#151517', light: '#f0f0f0' },
    postsBackground: { dark: '#1d1d20', light: '#f0f0f0' },
    themes: { dark, light },
    blurTint: { dark: 'dark', light: 'light' },
    true: '#00e676',
    warnText: '#ff9696',
    openedStory: '#555',
    mainColor: { dark: '#fff', light: '#000' },
    blackRGB: { dark: 0, light: 255 },
    whiteRGB: { dark: 255, light: 0 },
    headerBack: '#010101',
    main: '#9c96ff',
    mainBold: { dark: '#2a2a2e', light: '#bfbfc5' },
    askButton: { dark: '#222', light: '#f0f0f0' },
    lightBorder: { dark: 'rgba(255,255,255,0.1)', light: 'rgba(0,0,0,0.075)' },
    mediumBorder: { dark: 'rgba(255,255,255,0.2)', light: 'rgba(0,0,0,0.2)' },
    background: { dark: '#000', light: '#fff' },
    border: { dark: '#222', light: 'rgba(0,0,0,0.2)' },
    tap: { dark: '#121212', light: '#f0f0f0' },
    mainSecound,
    checkBox: { dark: '#2a2a2e', light: '#d8d8dc' },
    mainMedium: { dark: '#2a2a2e', light: '#bfbfc5' },
    verifyIcon: { dark: '#fff', light: '#9c96ff' },
    placeholder: { dark: '#555', light: '#aaa' },
    lightBorderMixed: { dark: '#222', light: '#e0e0e0' },
    profileHaderOverlay: { dark: '#0e0e0e', light: '#e0e0e0' },
    draggOverlay: { dark: '#2a2a2e', light: '#000' },
    posts: {
        threadLine: { dark: '#2a2a2e', light: '#f0f0f0' },
        icons: mainSecound,
        handle: mainSecound,
        dot: mainSecound,
        time: mainSecound,
        overlay: { dark: '#121212', light: '#f0f0f0' },
        repost: '#f4be75',
        threadBorder: { dark: 'rgba(255,255,255,0.1)', light: 'rgba(0,0,0,0.05)' }
    },
    loader: {
        image: '#222'
    },
    inputBack: { dark: null, light: 'rgba(0,0,0,0.05)' }
}

// Get system theme asynchronously
const scheme = Appearance.getColorScheme() || 'light'; // Default to light if undefined

// Recursive function to replace { dark, light } values at any depth
const resolveColors = (obj, theme) => {
    if (typeof obj !== 'object' || obj === null) return obj; // Return primitives as-is

    if ('dark' in obj && 'light' in obj) return obj[theme]; // Return theme-specific value

    // Recursively process all keys in the object
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, resolveColors(value, theme)])
    );
};

// Process colors deeply
const colors = resolveColors(rawColors, scheme);

export default colors;
