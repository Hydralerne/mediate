import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { request } from '../utils/requests';
import { getSystemInfo, getToken } from '../utils/token';
import { getData, saveData } from '../utils/storage/localStorage';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Localization from 'expo-localization';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initializeFromCache = async () => {
            try {
                const cachedUserData = await getData('userData');
                if (cachedUserData) {
                    setUserData(cachedUserData);
                }
                setIsReady(true);
            } catch (e) {
                console.error("Error loading cached user data:", e);
            }
        };
        initializeFromCache();
    }, []);

    const appVersion = Constants.expoConfig?.version || 'unknown'; // Prevent crash if expoConfig is undefined

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const localization = Localization.getLocales()?.[0] || {}; // Ensure localization is always an object
            const notiToken = await getData('notiToken');
            const info = await getSystemInfo();
            const token = await getToken();

            const data = await request(
                'https://api.oblien.com/auth/status',
                {
                    os: Platform.OS,
                    info,
                    stack: 'expo',
                    localization,
                    notiToken,
                    version: appVersion,
                },
                'POST',
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!data) {
                // throw new Error("Empty response from server");
            }

            if (data.error) {
                // Alert.alert(data.type, data.message);
            }

            if (data.status) {
                setUserData(data);
                await saveData('userData', data);
            } else {
                // Alert.alert(
                //     'Error occurred',
                //     "Looks like there's an issue with the connection. Want to try again?",
                //     [
                //         {
                //             text: 'Try again',
                //             onPress: fetchUserData, // FIXED: Calls fetchUserData function
                //         },
                //         {
                //             text: 'Cancel',
                //             style: 'cancel',
                //         },
                //     ],
                //     { cancelable: true }
                // );
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert(
                'Server Error',
                'An unexpected error occurred. Please check your connection and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const isLogedIn = !!userData?.isLoged;

    const login = async (userData) => {
        const updatedUserData = { ...userData, isLoged: true };
        setUserData(updatedUserData);
        await saveData('userData', updatedUserData);
    };

    const logout = async () => {
        setUserData(null);
        await saveData('userData', null);
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            userData,
            isLogedIn,
            isLoading,
            login,
            logout,
            isReady,
            fetchUserData,
        }),
        [userData, isLogedIn, isLoading]
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useData = () => useContext(UserContext);