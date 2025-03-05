import { useContext } from 'react';
import translations from '../translations/index';
import { LanguageContext } from '../contexts/LanguageProvider';

const t = (key, lang) => {
    const keys = key.split('.');
    let result = translations;

    keys.forEach(k => {
        result = result[k];
    });

    return result ? result[lang] : key;
};

const useTranslation = () => {
    const { language } = useContext(LanguageContext);

    return (key) => t(key, language);
};

export default useTranslation;
