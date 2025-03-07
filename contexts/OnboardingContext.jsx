import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [templateSelection, setTemplateSelection] = useState(null);
    const [contentSections, setContentSections] = useState({
        about: false,
        portfolio: false,
        products: false,
        videos: false,
        blog: false,
        services: false,
        contact: false
    });
    const [contentData, setContentData] = useState({
        about: {},
        portfolio: [],
        products: [],
        videos: [],
        blog: [],
        services: [],
        contact: {}
    });
    const [domainType, setDomainType] = useState(null); // 'free' or 'custom'
    const [domainInfo, setDomainInfo] = useState({ value: '', isAvailable: false, price: '12.00' });
    const [pricingPlan, setPricingPlan] = useState('pro');
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        tagline: '',
        links: [],
        profileImage: null
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load saved state when the app starts
    useEffect(() => {
        const loadSavedState = async () => {
            try {
                setIsLoading(true);
                
                // Load template selection
                const savedTemplate = await AsyncStorage.getItem('onboarding_template');
                if (savedTemplate) setTemplateSelection(JSON.parse(savedTemplate));
                
                // Load content sections
                const savedContentSections = await AsyncStorage.getItem('onboarding_content_sections');
                if (savedContentSections) setContentSections(JSON.parse(savedContentSections));
                
                // Load content data
                const savedContentData = await AsyncStorage.getItem('onboarding_content_data');
                if (savedContentData) setContentData(JSON.parse(savedContentData));
                
                // Load domain type
                const savedDomainType = await AsyncStorage.getItem('onboarding_domain_type');
                if (savedDomainType) setDomainType(savedDomainType);
                
                // Load domain info
                const savedDomainInfo = await AsyncStorage.getItem('onboarding_domain_info');
                if (savedDomainInfo) setDomainInfo(JSON.parse(savedDomainInfo));
                
                // Load pricing plan
                const savedPricingPlan = await AsyncStorage.getItem('onboarding_pricing_plan');
                if (savedPricingPlan) setPricingPlan(savedPricingPlan);
                
                // Load payment status
                const savedPaymentComplete = await AsyncStorage.getItem('onboarding_payment_complete');
                if (savedPaymentComplete) setPaymentComplete(JSON.parse(savedPaymentComplete));
                
                // Load profile data
                const savedProfileData = await AsyncStorage.getItem('onboarding_profile_data');
                if (savedProfileData) setProfileData(JSON.parse(savedProfileData));
                
            } catch (error) {
                console.error('Error loading saved onboarding state:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadSavedState();
    }, []);
    
    // Save template selection when it changes
    useEffect(() => {
        if (templateSelection !== null) {
            AsyncStorage.setItem('onboarding_template', JSON.stringify(templateSelection));
        }
    }, [templateSelection]);
    
    // Save content sections when they change
    useEffect(() => {
        AsyncStorage.setItem('onboarding_content_sections', JSON.stringify(contentSections));
    }, [contentSections]);
    
    // Save content data when it changes
    useEffect(() => {
        AsyncStorage.setItem('onboarding_content_data', JSON.stringify(contentData));
    }, [contentData]);
    
    // Save domain type when it changes
    useEffect(() => {
        if (domainType !== null) {
            AsyncStorage.setItem('onboarding_domain_type', domainType);
        }
    }, [domainType]);
    
    // Save domain info when it changes
    useEffect(() => {
        if (domainInfo.value) {
            AsyncStorage.setItem('onboarding_domain_info', JSON.stringify(domainInfo));
        }
    }, [domainInfo]);
    
    // Save pricing plan when it changes
    useEffect(() => {
        if (pricingPlan) {
            AsyncStorage.setItem('onboarding_pricing_plan', pricingPlan);
        }
    }, [pricingPlan]);
    
    // Save payment status when it changes
    useEffect(() => {
        AsyncStorage.setItem('onboarding_payment_complete', JSON.stringify(paymentComplete));
    }, [paymentComplete]);
    
    // Save profile data when it changes
    useEffect(() => {
        if (profileData.name || profileData.tagline || profileData.links.length > 0 || profileData.profileImage) {
            AsyncStorage.setItem('onboarding_profile_data', JSON.stringify(profileData));
        }
    }, [profileData]);
    
    // Function to reset all onboarding data (useful for testing or if user wants to start over)
    const resetOnboardingData = async () => {
        try {
            await AsyncStorage.multiRemove([
                'onboarding_template',
                'onboarding_content_sections',
                'onboarding_content_data',
                'onboarding_domain_type',
                'onboarding_domain_info',
                'onboarding_pricing_plan',
                'onboarding_payment_complete',
                'onboarding_profile_data'
            ]);
            
            // Reset state
            setTemplateSelection(null);
            setContentSections({
                about: false,
                portfolio: false,
                products: false,
                videos: false,
                blog: false,
                services: false,
                contact: false
            });
            setContentData({
                about: {},
                portfolio: [],
                products: [],
                videos: [],
                blog: [],
                services: [],
                contact: {}
            });
            setDomainType(null);
            setDomainInfo({ value: '', isAvailable: false, price: '12.00' });
            setPricingPlan('pro');
            setPaymentComplete(false);
            setProfileData({
                name: '',
                tagline: '',
                links: [],
                profileImage: null
            });
            
        } catch (error) {
            console.error('Error resetting onboarding data:', error);
        }
    };

    return (
        <OnboardingContext.Provider value={{
            templateSelection,
            setTemplateSelection,
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
            setPaymentComplete,
            profileData,
            setProfileData,
            isLoading,
            resetOnboardingData
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}; 