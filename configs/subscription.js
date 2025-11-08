// Regional pricing configuration for premium subscription
// Prices are in local currency for each region
import * as Localization from 'expo-localization';

const subscriptionConfig = {
    // Features included in premium subscription
    features: [
        {
            id: 'no_ads',
            title: 'No Ads',
            description: 'Enjoy an ad-free experience across the entire app',
            icon: require('@/assets/icons/forbidden sign-88-1658435662.png')
        },
        {
            id: 'extended',
            title: 'More research usage',
            description: 'Get more research usage per day',
            icon: require('@/assets/icons/document infinity-59-1662364367.png')
        },
        {
            id: 'custom_instructions',
            title: 'Better models',
            description: 'Use better models for the research agent',
            icon: require('@/assets/icons/ai brain-5-1686045593.png')
        },
        {
            id: 'priority_support',
            title: 'Priority Support',
            description: 'Get priority support from the team',
            icon: require('@/assets/icons/headphone-25-1663753435.png')
        }
    ],

    // Regional pricing for different countries/regions
    pricing: {
        // United States & Canada
        'US': {
            currency: 'USD',
            symbol: '$',
            monthly: 7.99,
            yearly: 79.99,
            yearlyDiscount: '17%'
        },
        'CA': {
            currency: 'CAD',
            symbol: 'C$',
            monthly: 10.99,
            yearly: 109.99,
            yearlyDiscount: '17%'
        },

        // European Union
        'EU': {
            currency: 'EUR',
            symbol: '€',
            monthly: 7.99,
            yearly: 79.99,
            yearlyDiscount: '17%'
        },

        // United Kingdom
        'GB': {
            currency: 'GBP',
            symbol: '£',
            monthly: 6.99,
            yearly: 69.99,
            yearlyDiscount: '17%'
        },

        // Australia & New Zealand
        'AU': {
            currency: 'AUD',
            symbol: 'A$',
            monthly: 12.99,
            yearly: 129.99,
            yearlyDiscount: '17%'
        },
        'NZ': {
            currency: 'NZD',
            symbol: 'NZ$',
            monthly: 13.99,
            yearly: 139.99,
            yearlyDiscount: '17%'
        },

        // Asia Pacific
        'JP': {
            currency: 'JPY',
            symbol: '¥',
            monthly: 1000,
            yearly: 10000,
            yearlyDiscount: '17%'
        },
        'KR': {
            currency: 'KRW',
            symbol: '₩',
            monthly: 10000,
            yearly: 100000,
            yearlyDiscount: '17%'
        },
        'SG': {
            currency: 'SGD',
            symbol: 'S$',
            monthly: 10.99,
            yearly: 109.99,
            yearlyDiscount: '17%'
        },
        'HK': {
            currency: 'HKD',
            symbol: 'HK$',
            monthly: 68,
            yearly: 680,
            yearlyDiscount: '17%'
        },

        'SA': { 
            currency: 'SAR',
            symbol: '﷼ ',
            monthly: 27.99,
            yearly: 279.99,
            yearlyDiscount: '17%'
        },

        'AE': {
            currency: 'AED',
            symbol: 'د. إ ',
            monthly: 27.99,
            yearly: 279.99,
            yearlyDiscount: '17%'
        },

        'EG': {
            currency: 'EGP',
            symbol: 'EGP ',
            monthly: 79.99,
            yearly: 799.99,
            yearlyDiscount: '17%'
        },
        
        // India
        'IN': {
            currency: 'INR',
            symbol: '₹',
            monthly: 599,
            yearly: 5999,   
            yearlyDiscount: '17%'
        },

        // Brazil
        'BR': {
            currency: 'BRL',
            symbol: 'R$',
            monthly: 27.99,
            yearly: 279.99,
            yearlyDiscount: '17%'
        },

        // Mexico
        'MX': {
            currency: 'MXN',
            symbol: '$',
            monthly: 179,
            yearly: 1799,
            yearlyDiscount: '17%'
        },
    }
};

// Helper function to get pricing for user's region
export const getPricingForRegion = (regionCode = 'US') => {
    return subscriptionConfig.pricing[regionCode] || subscriptionConfig.pricing.US;
};

// Helper function to detect user's region (you can integrate with device locale)
export const detectUserRegion = () => {
    // This would typically use device locale or IP geolocation
    // For now, returning default
    return Localization.getLocales()?.[0]?.regionCode || 'US';
};

export default subscriptionConfig; 