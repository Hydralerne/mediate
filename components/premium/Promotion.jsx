import React, { useState, useEffect, memo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Animated,
    Image,
    ActivityIndicator,
    Platform,
    Alert
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import createStyles from '@/utils/globalStyle';
import subscriptionConfig, { getPricingForRegion, detectUserRegion } from '@/configs/subscription';
import FeatureItem from '@/components/premium/FeatureItem';
import PlanOption from '@/components/premium/PlanOption';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import TintBlur from '@/components/global/TintBlur';
import TouchableButton from '@/components/global/ButtonTap';

const IS_IOS = Platform.OS === 'ios'

const SubscriptionButton = memo(({ selectedPlan }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = () => {
        Alert.alert('Coming Soon','Thank you for your interest, Hekai Premium will be available in next update')
    }

    return (
        <TouchableButton
            onPress={handleSubscribe}
            style={styles.subscribeBtn}
            activeOpacity={0.9}
        >
            <Text style={styles.subscribeBtnText}>
                Start Premium {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'}
            </Text>
            {isLoading ? <ActivityIndicator style={styles.subscribeBtnIcon} size="small" color="#000" /> : <Image source={require('@/assets/icons/flow right-143-1696832127.png')} style={styles.subscribeBtnIcon} />}
        </TouchableButton>
    )
})

const Promotion = ({ navigation }) => {
    const [selectedPlan, setSelectedPlan] = useState('yearly');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));
    const [pricing, setPricing] = useState({});

    useEffect(() => {
        // Initialize animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Detect user region and set pricing
        const region = detectUserRegion();
        const pricing = getPricingForRegion(region);
        setPricing(pricing);
    }, []);

    const handlePlanSelect = (plan) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedPlan(plan);
    };

    const handleSubscribe = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    };


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
                <Text style={styles.headerTitle}>Hekai Premium</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Premium Header */}
                <Animated.View style={[styles.premiumHeader, { opacity: fadeAnim }]}>
                    <View style={styles.premiumIconContainer}>
                        <View style={styles.iconBackground}>
                            <Image source={require('@/assets/icons/king-137-1658434754.png')} style={styles.crownIcon} />
                        </View>
                    </View>
                    <Text style={styles.premiumTitle}>Premium</Text>
                    <Text style={styles.premiumSubtitle}>
                        Unlock the full potential of your experience, Cancel anytime
                    </Text>
                </Animated.View>

                {/* Features Card */}
                <Animated.View style={[styles.featuresCard, { opacity: fadeAnim }]}>
                    {IS_IOS ? <BlurView tint="light" intensity={40} style={styles.featuresCardBlur} /> : <View style={styles.featuresCardBlurAndroid} />}
                    {subscriptionConfig.features.map((feature, index) => (
                        <FeatureItem
                            key={feature.id}
                            feature={feature}
                            index={index}
                            fadeAnim={fadeAnim}
                            slideAnim={slideAnim}
                        />
                    ))}
                </Animated.View>

                {/* Pricing Plans */}
                <Animated.View style={[styles.pricingContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.pricingTitle}>Choose Your Plan</Text>

                    <View style={styles.plansStack}>
                        <PlanOption
                            planType="monthly"
                            price={pricing.monthly}
                            isSelected={selectedPlan === 'monthly'}
                            onPlanSelect={handlePlanSelect}
                            pricing={pricing}
                        />

                        <PlanOption
                            planType="yearly"
                            price={pricing.yearly}
                            originalPrice={(pricing.monthly * 12).toFixed(2)}
                            discount={pricing.yearlyDiscount}
                            isSelected={selectedPlan === 'yearly'}
                            onPlanSelect={handlePlanSelect}
                            pricing={pricing}
                        />
                    </View>
                </Animated.View>

                {/* Subscribe Button */}
                <Animated.View style={[styles.subscribeContainer, { opacity: fadeAnim }]}>
                    <SubscriptionButton selectedPlan={selectedPlan} />
                    <Text style={styles.termsText}>
                        By subscribing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </Animated.View>
            </ScrollView>
        </ImageBackground>
    )
}

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
    premiumHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    premiumIconContainer: {
        marginBottom: 16,
    },
    iconBackground: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    premiumTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        fontFamily: 'main',
    },
    premiumSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'main',
    },
    featuresCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        paddingVertical: 20,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    featuresCardBlurAndroid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(25, 25, 25, 0.75)',
    },
    featuresCardBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    featuresHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        opacity: 0.6,
    },
    gradientLine: {
        height: 0.5,
        width: '30%',
        backgroundColor: '#fff',
        opacity: 0.5,
    },
    featuresHeaderText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '300',
        fontFamily: 'main',
    },
    pricingContainer: {
        marginBottom: 30,
    },
    pricingTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'main',
    },
    plansStack: {
        gap: 16,
    },
    subscribeContainer: {
        alignItems: 'center',
    },
    subscribeBtn: {
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
    subscribeBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'main',
    },
    subscribeBtnIcon: {
        marginLeft: 8,
        position: 'absolute',
        right: 20,
        width: 28,
        height: 28,
    },
    termsText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 20,
        fontFamily: 'main',
    },
});

export default Promotion;

