import React, { createContext, useState } from 'react';

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [templateSelection, setTemplateSelection] = useState(null);
    const [profileData, setProfileData] = useState({
        name: '',
        tagline: '',
        links: []
    });
    const [contentSections, setContentSections] = useState({
        about: false,
        portfolio: false,
        products: false,
        videos: false,
        blog: false,
        services: false,
        contact: false
    });
    const [contentData, setContentData] = useState({});
    const [domainType, setDomainType] = useState(null);
    const [domainInfo, setDomainInfo] = useState({ value: '', isAvailable: false, price: '12.00' });
    const [pricingPlan, setPricingPlan] = useState('pro');
    const [paymentComplete, setPaymentComplete] = useState(false);

    return (
        <OnboardingContext.Provider value={{
            templateSelection,
            setTemplateSelection,
            profileData,
            setProfileData,
            contentSections,
            setContentSections,
            contentData,
            setContentData,
            domainType,
            setDomainType,
            domainInfo,
            setDomainInfo,
            pricingPlan,
            setPricingPlan,
            paymentComplete,
            setPaymentComplete
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}; 