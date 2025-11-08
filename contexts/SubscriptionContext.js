import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const { userData } = useUserContext()
    const [plus, setPlus] = useState({})
    const [ads, setAds] = useState({})

    const adsUnitsRef = useRef({})

    const value = {
        plus,
        ads,
        adsUnitsRef,
    }

    return (
        <SubscriptionContext.Provider
            value={value}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => useContext(SubscriptionContext);