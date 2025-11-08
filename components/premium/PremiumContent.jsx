import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Platform, Linking, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import createStyles from '@/utils/globalStyle';
import subscriptionConfig, { getPricingForRegion, detectUserRegion } from '@/configs/subscription';
import { useSubscription } from '@/contexts/SubscriptionContext';
import TouchableButton from '@/components/global/ButtonTap';
import TintBlur from '@/components/global/TintBlur';
import * as Haptics from 'expo-haptics';

const IS_IOS = Platform.OS === 'ios';

const PremiumContent = ({ navigation }) => {
    const { plus } = useSubscription();
    const [pricing, setPricing] = useState({});

    useEffect(() => {
        const region = detectUserRegion();
        const regionPricing = getPricingForRegion(region);
        setPricing(regionPricing);
    }, []);

    const formatRenewalDate = (dateString) => {
        if (!dateString) return 'Not available';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleManageSubscription = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        const title = Platform.OS === 'ios' ? 'Manage Your Subscription' : 'Manage Your Subscription';
        const message = Platform.OS === 'ios' 
            ? 'To cancel or modify your subscription, please go to your iPhone Settings > Apple ID > Subscriptions > ONVO Premium'
            : 'To cancel or modify your subscription, please go to Google Play Store > Account > Subscriptions > ONVO Premium';

        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: Platform.OS === 'ios' ? 'Open Settings' : 'Open Play Store',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            Linking.openURL('app-settings:');
                        } else {
                            Linking.openURL('https://play.google.com/store/account/subscriptions');
                        }
                    }
                }
            ]
        );
    };

    const FeatureItem = ({ feature }) => (
        <View style={styles.featureItem}>
            <Image source={feature.icon} style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
            <Image 
                source={require('@/assets/icons/check circle-3-1660219236.png')} 
                style={styles.checkIcon} 
            />
        </View>
    );

    return (
        <ImageBackground source={require('@/assets/bg.png')} style={styles.container}>
            <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
            <LinearGradient
                colors={['transparent', 'transparent', 'rgba(0, 0, 0, 1)']}
                locations={[0, 0.25, 1]}
                style={styles.overlay}
            />
            
            {/* Navigation Header */}
            <View style={styles.header}>
                <TintBlur
                    direction='top'
                    locations={[0.5, 0.25, 0]}
                    tint="dark"
                    intensity={30}
                    style={{ height: 120 }}
                />
                <TouchableButton
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    {IS_IOS ? <BlurView tint="light" intensity={30} style={styles.backBtnBlur} /> : ''}
                    <Image source={require('@/assets/icons/arrow right md-49-1696832059.png')} style={styles.leftIcon} />
                </TouchableButton>
                <Text style={styles.headerTitle}>Premium</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Premium Status Header */}
                <View style={styles.statusHeader}>
                    <View style={styles.crownContainer}>
                        <Image 
                            source={require('@/assets/icons/king-137-1658434754.png')} 
                            style={styles.crownIcon} 
                        />
                    </View>
                    <Text style={styles.statusTitle}>Premium Active</Text>
                    <Text style={styles.statusSubtitle}>You're enjoying all premium benefits</Text>
                </View>

                {/* Subscription Details Card */}
                <View style={styles.statusCard}>
                    {IS_IOS ? <BlurView tint="light" intensity={40} style={styles.cardBlur} /> : <View style={styles.cardBlurAndroid} />}
                    
                    <View style={styles.subscriptionDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Plan</Text>
                            <Text style={styles.detailValue}>
                                {plus?.planType === 'monthly' ? 'Monthly' : 'Yearly'} Premium
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Next Renewal</Text>
                            <Text style={styles.detailValue}>
                                {formatRenewalDate(plus?.renewalDate)}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Price</Text>
                            <Text style={styles.detailValue}>
                                {pricing.symbol}{plus?.planType === 'monthly' ? pricing.monthly : pricing.yearly}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Premium Features */}
                <View style={styles.featuresCard}>
                    {IS_IOS ? <BlurView tint="light" intensity={40} style={styles.cardBlur} /> : <View style={styles.cardBlurAndroid} />}
                    
                    {subscriptionConfig.features.map((feature) => (
                        <FeatureItem key={feature.id} feature={feature} />
                    ))}
                </View>

                {/* Manage Subscription */}
                <View style={styles.manageContainer}>
                    <TouchableButton
                        onPress={handleManageSubscription}
                        style={styles.manageButton}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.manageButtonText}>Manage Subscription</Text>
                        <Image 
                            source={require('@/assets/icons/center left layout-17-1692683663.png')} 
                            style={styles.manageIcon} 
                        />
                    </TouchableButton>
                    
                    <Text style={styles.manageDescription}>
                        To cancel or modify your subscription, you need to manage it through {' '}
                        {Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'} settings.
                    </Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = createStyles({
    leftIcon: {
        tintColor: '#fff',
        width: 24,
        height: 24,
    },
    crownIcon: {
        tintColor: '#000',
        width: 30,
        height: 30,
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        zIndex: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    backBtnBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'main',
    },
    headerSpacer: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 100,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    statusHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    crownContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    statusTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        fontFamily: 'main',
    },
    statusSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'main',
    },
    statusCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        position: 'relative',
    },
    cardBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    cardBlurAndroid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(25, 25, 25, 0.75)',
    },
    subscriptionDetails: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'main',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'main',
    },
    featuresCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        paddingVertical: 20,
        paddingBottom: 10,
        paddingHorizontal: 20,
        position: 'relative',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    featureIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
        marginRight: 16,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 1,
        fontFamily: 'main',
    },
    featureDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 18,
        fontFamily: 'main',
        fontWeight: '300'
    },
    checkIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
        marginLeft: 15
    },
    manageContainer: {
        alignItems: 'center',
    },
    manageButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#fff',
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    manageButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'main',
    },
    manageIcon: {
        marginLeft: 8,
        position: 'absolute',
        right: 20,
        width: 28,
        height: 28,
        tintColor: '#000',
    },
    manageDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 20,
        fontFamily: 'main',
    },
});

export default PremiumContent;