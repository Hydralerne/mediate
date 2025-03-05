import { createContext, useState } from 'react';
import * as Localization from 'expo-localization';

export const LanguageContext = createContext();

const whitelist = ['ar','en']

export const LanguageProvider = ({ children }) => {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    const lang = whitelist.includes(deviceLanguage) ? deviceLanguage : 'en'
    const [language, setLanguage] = useState(lang);
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
