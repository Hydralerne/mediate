let activeTab = 0; 
let listeners = [];


import { useEffect, useState } from 'react';

export const setActiveTab = (newTab) => {
    activeTab = newTab;
    listeners.forEach((listener) => listener(activeTab));
};

export const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

export const useSharedState = (state) => {
    const [activeTab, setActiveTabState] = useState(state);
    return [activeTab, setActiveTab];
};