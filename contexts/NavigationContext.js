import React, { createContext, useContext, useRef } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const tabsNavigationRef = useRef({});
    const currentTabRef = useRef('HomeTab');

    const registerTabNavigation = (tabName, navigation) => {
        tabsNavigationRef.current[tabName] = navigation;
    };

    const unregisterTabNavigation = (tabName) => {
        delete tabsNavigationRef.current[tabName];
    };

    const setCurrentTab = (tabName) => {
        currentTabRef.current = tabName;
    };

    const navigateInCurrentTab = (routeName, params) => {
        if (tabsNavigationRef.current[currentTabRef.current]) {
            tabsNavigationRef.current[currentTabRef.current].push(routeName, params);
        } else {
            console.warn(`No navigation found for current tab: ${currentTabRef.current}`);
        }
    };

    const navigateInTab = (tabName, routeName, params) => {
        if (tabsNavigationRef.current[tabName]) {
            tabsNavigationRef.current[tabName].navigate(routeName, params);
        } else {
            console.warn(`No navigation found for tab: ${tabName}`);
        }
    };

    return (
        <NavigationContext.Provider
            value={{
                registerTabNavigation,
                unregisterTabNavigation,
                navigateInCurrentTab,
                navigateInTab,
                setCurrentTab,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => useContext(NavigationContext);