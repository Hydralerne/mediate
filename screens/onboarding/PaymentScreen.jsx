import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';
import React, { memo, useState, useRef, useEffect, useContext } from 'react';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { Animated } from 'react-native';
import { useBottomSheet } from '../../contexts/BottomSheet';
import { useNavigation } from '@react-navigation/native';
import Wrapper from './Wrapper';
// Import Expo's in-app purchases module
// import * as InAppPurchases from 'expo-in-app-purchases';

// Credit card input component with validation
const CreditCardInput = ({ label, placeholder, value, onChangeText, keyboardType, maxLength, icon, secureTextEntry, error }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
                {icon && (
                    <Image source={icon} style={styles.inputIcon} />
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType || 'default'}
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

// Order summary item component
const OrderItem = ({ title, description, price, isDiscount }) => (
    <View style={styles.orderItem}>
        <View style={styles.orderItemInfo}>
            <Text style={styles.orderItemTitle}>{title}</Text>
            {description && <Text style={styles.orderItemDescription}>{description}</Text>}
        </View>
        <Text style={[
            styles.orderItemPrice,
            isDiscount && styles.discountPrice
        ]}>
            {isDiscount ? '-' : ''}${price}
        </Text>
    </View>
);

// Receipt component for bottom sheet
const ReceiptSheet = ({ orderDetails, onClose }) => {
    const { pricingPlan, domainInfo, domainType } = orderDetails;

    const getOrderItems = () => {
        const items = [];

        // Add subscription plan
        if (pricingPlan === 'starter') {
            items.push({ title: 'Starter Plan', description: '14-day free trial', price: '0.00', isDiscount: false });
        } else if (pricingPlan === 'pro') {
            items.push({ title: 'Pro Plan', description: '14-day free trial', price: '0.00', isDiscount: false });
        } else if (pricingPlan === 'business') {
            items.push({ title: 'Business Plan', description: '14-day free trial', price: '0.00', isDiscount: false });
        }

        // Add domain if custom
        if (domainType === 'custom' && domainInfo.value) {
            items.push({
                title: `Domain: ${domainInfo.value}`,
                description: '1 year registration',
                price: domainInfo.price || '12.00',
                isDiscount: false
            });
        }

        return items;
    };

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
        <View style={styles.receiptContainer}>
            <View style={styles.receiptHeader}>
                <Text style={styles.receiptTitle}>Payment Receipt</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Image
                        source={require('../../assets/icons/home/close remove-802-1662363936.png')}
                        style={styles.closeIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.receiptContent}>
                <View style={styles.receiptLogo}>
                    <Image
                        source={require('../../assets/icons/home/check circle-3-1660219236.png')}
                        style={styles.successIcon}
                    />
                    <Text style={styles.successText}>Payment Successful</Text>
                </View>

                <View style={styles.receiptDivider} />

                <View style={styles.receiptOrderItems}>
                    <Text style={styles.receiptSectionTitle}>Order Summary</Text>
                    {getOrderItems().map((item, index) => (
                        <OrderItem
                            key={index}
                            title={item.title}
                            description={item.description}
                            price={item.price}
                            isDiscount={item.isDiscount}
                        />
                    ))}
                </View>

                <View style={styles.receiptDivider} />

                <View style={styles.receiptTotal}>
                    <Text style={styles.totalLabel}>Total Charged Today</Text>
                    <Text style={styles.totalAmount}>${calculateTotal()}</Text>
                </View>

                <View style={styles.receiptFooter}>
                    <Text style={styles.receiptNote}>
                        Your 14-day free trial starts today. You won't be charged for the subscription until {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                    </Text>
                    <Text style={styles.receiptNote}>
                        Receipt #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </Text>
                    <Text style={styles.receiptDate}>
                        {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const PaymentScreen = memo(({ navigation }) => {
    const { pricingPlan, domainType, domainInfo, setPaymentComplete } = useContext(OnboardingContext);
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    // Card details state
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Validation state
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'store'

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    // Initialize in-app purchases
    useEffect(() => {
        const setupPurchases = async () => {
            try {
                await InAppPurchases.connectAsync();
                console.log('Connected to store');

                // Set up subscription items
                // These IDs should match what you've set up in App Store Connect / Play Console
                const subscriptionItems = Platform.select({
                    ios: [
                        'com.yourapp.starter.monthly',
                        'com.yourapp.pro.monthly',
                        'com.yourapp.business.monthly'
                    ],
                    android: [
                        'com.yourapp.starter.monthly',
                        'com.yourapp.pro.monthly',
                        'com.yourapp.business.monthly'
                    ],
                    default: []
                });

                // Get subscription products info
                const { responseCode, results } = await InAppPurchases.getProductsAsync(subscriptionItems);

                if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                    console.log('Products loaded:', results);
                }

                // Set up purchase listener
                InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
                    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                        results.forEach(purchase => {
                            if (!purchase.acknowledged) {
                                console.log('Purchase successful:', purchase);

                                // Finish the transaction
                                InAppPurchases.finishTransactionAsync(purchase, true);

                                // Update app state
                                setIsProcessing(false);
                                setIsComplete(true);
                                setPaymentComplete(true);

                                // Navigate to success or next screen
                                navigation.navigate('OnboardingSuccess');
                            }
                        });
                    } else {
                        console.log('Purchase failed with code:', errorCode);
                        setIsProcessing(false);
                    }
                });
            } catch (error) {
                console.error('Error setting up in-app purchases:', error);
            }
        };
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
        // setupPurchases();

        return () => {
            // Disconnect when component unmounts
            // InAppPurchases.disconnectAsync();
        };
    }, []);

    // Format card number with spaces
    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    // Format expiry date with slash
    const formatExpiryDate = (text) => {
        const cleaned = text.replace(/[^0-9]/gi, '');
        if (cleaned.length > 2) {
            return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
        }
        return cleaned;
    };

    // Validate form
    const validateForm = () => {
        // Skip validation for store payments
        if (paymentMethod === 'store') {
            return true;
        }

        const newErrors = {};

        if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
            newErrors.cardNumber = 'Please enter a valid card number';
        }

        if (!cardName) {
            newErrors.cardName = 'Please enter the name on card';
        }

        if (!expiryDate || expiryDate.length < 5) {
            newErrors.expiryDate = 'Please enter a valid expiry date';
        } else {
            const [month, year] = expiryDate.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (parseInt(month) < 1 || parseInt(month) > 12) {
                newErrors.expiryDate = 'Invalid month';
            } else if (parseInt(year) < currentYear ||
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                newErrors.expiryDate = 'Card has expired';
            }
        }

        if (!cvv || cvv.length < 3) {
            newErrors.cvv = 'Please enter a valid CVV';
        }

        if (!zipCode || zipCode.length < 5) {
            newErrors.zipCode = 'Please enter a valid ZIP code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle payment submission via card
    const handleCardPayment = () => {
        if (validateForm()) {
            setIsProcessing(true);

            // Simulate payment processing
            setTimeout(() => {
                setIsProcessing(false);
                setIsComplete(true);
                setPaymentComplete(true);

                // Navigate to success screen
                navigation.navigate('OnboardingSuccess');
            }, 2000);
        }
    };

    // Handle App Store / Play Store payment
    const handleStorePurchase = async () => {
        setPaymentMethod('store');
        setIsProcessing(true);

        try {
            // Determine which product ID to use based on selected plan
            let productId;
            switch (pricingPlan) {
                case 'starter':
                    productId = 'com.yourapp.starter.monthly';
                    break;
                case 'business':
                    productId = 'com.yourapp.business.monthly';
                    break;
                case 'pro':
                default:
                    productId = 'com.yourapp.pro.monthly';
                    break;
            }

            // Purchase the subscription
            await InAppPurchases.purchaseItemAsync(productId);

            // Note: The purchase result will be handled by the purchase listener

        } catch (error) {
            console.error('Purchase error:', error);
            setIsProcessing(false);
        }
    };

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

    // Get plan details
    const getPlanDetails = () => {
        switch (pricingPlan) {
            case 'starter':
                return { name: 'Starter Plan', price: 9, features: ['Custom domain', 'Basic analytics', 'Up to 5 content sections'] };
            case 'pro':
                return { name: 'Pro Plan', price: 19, features: ['Everything in Starter', 'Advanced analytics', 'Unlimited content sections'] };
            case 'business':
                return { name: 'Business Plan', price: 49, features: ['Everything in Pro', 'Multiple team members', 'Advanced integrations'] };
            default:
                return { name: 'Pro Plan', price: 19, features: ['Everything in Starter', 'Advanced analytics', 'Unlimited content sections'] };
        }
    };

    const planDetails = getPlanDetails();

    return (
        <Wrapper allowScroll={true} navigation={navigation}>
            <Animated.View
                style={[
                    styles.innerContainer,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Complete Your Order</Text>
                    <Text style={styles.subtitle}>
                        Secure payment for your subscription and domain
                    </Text>
                </View>

                <View style={styles.content}>
                    {/* Order Summary - Enhanced Design */}
                    <View style={styles.orderSummaryContainer}>
                        <View style={styles.orderSummaryHeader}>
                            <Text style={styles.sectionTitle}>Order Summary</Text>
                            <Image
                                source={require('../../assets/icons/home/receipt-0-1693375323.png')}
                                style={styles.receiptIcon}
                            />
                        </View>

                        <View style={styles.orderSummary}>
                            <View style={styles.planCard}>
                                <View style={styles.planHeader}>
                                    <Text style={styles.planName}>{planDetails.name}</Text>
                                    <Text style={styles.planPrice}>${planDetails.price}/mo</Text>
                                </View>

                                <View style={styles.planFeatures}>
                                    {planDetails.features.map((feature, index) => (
                                        <View key={index} style={styles.featureRow}>
                                            <Image
                                                source={require('../../assets/icons/home/check circle-3-1660219236.png')}
                                                style={styles.featureIcon}
                                            />
                                            <Text style={styles.featureText}>{feature}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.trialBadge}>
                                    <Text style={styles.trialText}>14-day free trial</Text>
                                </View>
                            </View>

                            {domainType === 'custom' && domainInfo && domainInfo.value && (
                                <View style={styles.domainCard}>
                                    <View style={styles.domainHeader}>
                                        <Text style={styles.domainName}>{domainInfo.value}</Text>
                                        <Text style={styles.domainPrice}>${domainInfo.price || 12}/year</Text>
                                    </View>
                                    <Text style={styles.domainDescription}>1 year domain registration</Text>
                                </View>
                            )}

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total Today</Text>
                                <Text style={styles.totalAmount}>${calculateTotal()}</Text>
                            </View>
                        </View>

                        <View style={styles.trialNoteContainer}>
                            <Image
                                source={require('../../assets/icons/home/info circle-83-1658234612.png')}
                                style={styles.infoIcon}
                            />
                            <Text style={styles.trialNote}>
                                Your subscription will start with a 14-day free trial. You won't be charged until {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                            </Text>
                        </View>
                    </View>

                    {/* App Store / Play Store Payment Button - Enhanced Black Design */}
                    <TouchableOpacity
                        style={styles.storePayButton}
                        onPress={handleStorePurchase}
                        disabled={isProcessing || isComplete}
                    >
                        <View style={styles.storePayContent}>
                            <Image
                                source={Platform.OS === 'ios'
                                    ? require('../../assets/icons/home/apple-24-1666783710.png')
                                    : require('../../assets/icons/home/google-79-1666783710.png')}
                                style={[styles.storeIcon, { tintColor: '#fff' }]}
                            />
                            <Text style={styles.storePayText}>
                                {Platform.OS === 'ios'
                                    ? 'Pay with App Store'
                                    : 'Pay with Google Play'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.orDivider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Payment Details */}
                    <View style={styles.paymentDetails}>
                        <Text style={styles.sectionTitle}>Pay with Card</Text>

                        <View style={styles.cardTypes}>
                            {/* <Image source={require('../../assets/icons/home/visa-0-1693375323.png')} style={styles.cardTypeIcon} />
                                <Image source={require('../../assets/icons/home/mastercard-0-1693375323.png')} style={styles.cardTypeIcon} />
                                <Image source={require('../../assets/icons/home/amex-0-1693375323.png')} style={styles.cardTypeIcon} />
                                <Image source={require('../../assets/icons/home/discover-0-1693375323.png')} style={styles.cardTypeIcon} /> */}
                        </View>

                        <CreditCardInput
                            label="Card Number"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                            keyboardType="number-pad"
                            maxLength={19}
                            icon={require('../../assets/icons/home/credit card-0-1693375323.png')}
                            error={errors.cardNumber}
                        />

                        <CreditCardInput
                            label="Name on Card"
                            placeholder="John Doe"
                            value={cardName}
                            onChangeText={setCardName}
                            error={errors.cardName}
                        />

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInput}>
                                <CreditCardInput
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                                    keyboardType="number-pad"
                                    maxLength={5}
                                    error={errors.expiryDate}
                                />
                            </View>

                            <View style={styles.halfInput}>
                                <CreditCardInput
                                    label="CVV"
                                    placeholder="123"
                                    value={cvv}
                                    onChangeText={setCvv}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    secureTextEntry={true}
                                    error={errors.cvv}
                                />
                            </View>
                        </View>

                        <CreditCardInput
                            label="Billing ZIP Code"
                            placeholder="12345"
                            value={zipCode}
                            onChangeText={setZipCode}
                            keyboardType="number-pad"
                            maxLength={10}
                            error={errors.zipCode}
                        />

                        <View style={styles.secureNote}>
                            <Image
                                source={require('../../assets/icons/home/lock-0-1693375323.png')}
                                style={styles.lockIcon}
                            />
                            <Text style={styles.secureText}>
                                Your payment information is encrypted and secure. We never store your full card details.
                            </Text>
                        </View>
                    </View>

                    {/* Card Payment Button */}
                    <TouchableOpacity
                        style={[
                            styles.payButton,
                            isProcessing && styles.processingButton
                        ]}
                        onPress={handleCardPayment}
                        disabled={isProcessing || isComplete}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.payButtonText}>
                                {calculateTotal() === '0.00'
                                    ? 'Start Free Trial'
                                    : `Pay $${calculateTotal()}`}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        By proceeding, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription anytime from your account settings.
                    </Text>
                </View>
            </Animated.View>
        </Wrapper>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        padding: 20,
        paddingBottom: 100, // Space for the main controller button
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        color: '#000',
        fontSize: 28,
        fontWeight: '300',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(0,0,0,1)',
        fontSize: 14,
        fontWeight: '300',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    orderSummaryContainer: {
        marginBottom: 30,
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    orderSummaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    receiptIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(0,0,0,0.6)',
    },
    orderSummary: {
        padding: 20,
    },
    planCard: {
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    planName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    planPrice: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.8)',
    },
    planFeatures: {
        marginBottom: 10,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    featureText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.8)',
    },
    trialBadge: {
        position: 'absolute',
        top: -10,
        right: 15,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    trialText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    domainCard: {
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        padding: 20,
        paddingHorizontal: 0,
        marginBottom: 15,
    },
    domainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    domainName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    domainPrice: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.8)',
    },
    domainDescription: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    trialNoteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(59, 130, 246, 0.2)',
    },
    infoIcon: {
        width: 16,
        height: 16,
        marginRight: 10,
        marginTop: 2,
        tintColor: '#3B82F6',
    },
    trialNote: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)',
        flex: 1,
    },
    paymentDetails: {
        marginBottom: 30,
    },
    cardTypes: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    cardTypeIcon: {
        width: 40,
        height: 25,
        marginRight: 10,
        resizeMode: 'contain',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightBorder,
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    inputIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: 'rgba(0,0,0,0.5)',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#000',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 5,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    secureNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    lockIcon: {
        width: 16,
        height: 16,
        marginRight: 10,
        tintColor: 'rgba(0,0,0,0.6)',
    },
    secureText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
        flex: 1,
    },
    payButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    processingButton: {
        opacity: 0.7,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    termsText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        lineHeight: 18,
    },
    receiptContainer: {
        flex: 1,
    },
    receiptHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        position: 'relative',
    },
    receiptTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    closeIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(0,0,0,0.5)',
    },
    receiptContent: {
        padding: 20,
    },
    receiptLogo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    successIcon: {
        width: 60,
        height: 60,
        marginBottom: 10,
        tintColor: '#4CAF50',
    },
    successText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4CAF50',
    },
    receiptDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: 20,
    },
    receiptSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    receiptOrderItems: {
        marginBottom: 10,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderItemInfo: {
        flex: 1,
    },
    orderItemTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
    },
    orderItemDescription: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)',
        marginTop: 2,
    },
    orderItemPrice: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
    },
    discountPrice: {
        color: '#4CAF50',
    },
    receiptTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    receiptFooter: {
        marginTop: 20,
    },
    receiptNote: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)',
        marginBottom: 10,
    },
    receiptDate: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        marginTop: 10,
    },
    storePayButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    storePayContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    storeIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
        tintColor: '#fff',
    },
    storePayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    orText: {
        paddingHorizontal: 15,
        color: 'rgba(0,0,0,0.5)',
        fontSize: 14,
    },
});

export default PaymentScreen; 