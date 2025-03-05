import React, { createContext, useState, useEffect, useContext } from 'react';
import { request } from '../utils/requests'
import { getToken } from '../utils/token'

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [data, setInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getInfo = async () => {
        try {
            setLoading(true);
            const response = await request('https://api.onvo.me/v2/settings/info', {}, 'GET', {
                Authorization: `Bearer ${await getToken()}`
            });
            setInfo(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <SettingsContext.Provider value={{ data, loading, error, refresh: getInfo }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
