import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { memo, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useContext } from 'react';

const OnboardingSuccess = memo(() => {
    const navigation = useNavigation();
    const { pricingPlan, domainType, domainInfo } = useContext(OnboardingContext);
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);
    
    const handleContinue = () => {
        // Navigate to the main app
        // navigation.navigate('MainApp');
        console.log('Onboarding complete, navigating to main app');
    };
    
    // Get plan details
    const getPlanDetails = () => {
        switch(pricingPlan) {
            case 'starter':
                return { name: 'Starter Plan', price: 9 };
            case 'pro':
                return { name: 'Pro Plan', price: 19 };
            case 'business':
                return { name: 'Business Plan', price: 49 };
            default:
                return { name: 'Pro Plan', price: 19 };
        }
    };
    
    const planDetails = getPlanDetails();
    
    // Calculate total amount
    const calculateTotal = () => {
        let total = 0;
        
        // During trial, subscription is free
        // Add domain cost if custom
        if (domainType === 'custom' && domainInfo.value) {
            total += parseFloat(domainInfo.price || 12);
        }
        
        return total.toFixed(2);
    };
    
    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.innerContainer,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
            >
                <View style={styles.successIconContainer}>
                    <Image 
                        source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                        style={styles.successIcon} 
                    />
                </View>
                
                <Text style={styles.title}>Payment Successful!</Text>
                
                <Text style={styles.subtitle}>
                    {calculateTotal() === '0.00' 
                        ? 'Your free trial has started' 
                        : 'Your payment has been processed'}
                </Text>
                
                <View style={styles.receiptCard}>
                    <Text style={styles.receiptTitle}>Order Summary</Text>
                    
                    <View style={styles.receiptItem}>
                        <Text style={styles.receiptItemName}>{planDetails.name}</Text>
                        <Text style={styles.receiptItemPrice}>
                            14-day free trial
                        </Text>
                    </View>
                    
                    {domainType === 'custom' && domainInfo.value && (
                        <View style={styles.receiptItem}>
                            <Text style={styles.receiptItemName}>
                                Domain: {domainInfo.value}
                            </Text>
                            <Text style={styles.receiptItemPrice}>
                                ${domainInfo.price || 12}/year
                            </Text>
                        </View>
                    )}
                    
                    <View style={styles.receiptDivider} />
                    
                    <View style={styles.receiptTotal}>
                        <Text style={styles.totalLabel}>Total Charged</Text>
                        <Text style={styles.totalAmount}>${calculateTotal()}</Text>
                    </View>
                </View>
                
                <Text style={styles.trialNote}>
                    {calculateTotal() === '0.00' 
                        ? `Your subscription will start with a 14-day free trial. You won't be charged until ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`
                        : `Your domain has been registered. Your subscription will start with a 14-day free trial. You won't be charged for the subscription until ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`
                    }
                </Text>
                
                <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>
                        Continue to Dashboard
                    </Text>
                </TouchableOpacity>
                
                <Text style={styles.receiptNumber}>
                    Receipt #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </Text>
            </Animated.View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    innerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successIcon: {
        width: 40,
        height: 40,
        tintColor: '#2ecc71',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 30,
        textAlign: 'center',
    },
    receiptCard: {
        width: '100%',
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    receiptTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    receiptItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    receiptItemName: {
        fontSize: 15,
        color: 'rgba(0,0,0,0.8)',
        flex: 1,
    },
    receiptItemPrice: {
        fontSize: 15,
        color: 'rgba(0,0,0,0.8)',
        fontWeight: '500',
    },
    receiptDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: 15,
    },
    receiptTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    trialNote: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    continueButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        height: 55,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    receiptNumber: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
    },
});

export default OnboardingSuccess; 