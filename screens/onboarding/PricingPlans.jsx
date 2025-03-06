import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { memo, useState, useRef, useEffect } from 'react';
import colors from '../../utils/colors';
import { useContext } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';

// Plan card component with animated effects
const PlanCard = ({ title, price, features, isPopular, isSelected, onSelect, trialDays }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    useEffect(() => {
        if (isSelected) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.03,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isSelected]);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
                style={[
                    styles.planCard, 
                    isSelected && styles.selectedPlanCard,
                    isPopular && styles.popularPlanCard
                ]} 
                onPress={onSelect}
                activeOpacity={0.9}
            >
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                    </View>
                )}
                
                <View style={styles.planHeader}>
                    <Text style={[styles.planTitle, isPopular && styles.popularPlanTitle]}>{title}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currency}>$</Text>
                        <Text style={styles.planPrice}>{price}</Text>
                        <Text style={styles.pricePeriod}>/month</Text>
                    </View>
                    {trialDays > 0 && (
                        <View style={styles.trialBadge}>
                            <Text style={styles.trialText}>{trialDays}-day free trial</Text>
                        </View>
                    )}
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <Image 
                                source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                style={[
                                    styles.featureIcon,
                                    isPopular && styles.popularFeatureIcon
                                ]} 
                            />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
                
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Image 
                            source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                            style={styles.checkIcon}
                        />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const PricingPlans = memo(() => {
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const { setPricingPlan } = useContext(OnboardingContext);
    
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setPricingPlan(plan);
    };
    
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Choose Your Plan</Text>
                        <Text style={styles.subtitle}>
                            Start with a 14-day free trial. Cancel anytime.
                        </Text>
                    </View>
                    
                    <View style={styles.content}>
                        <PlanCard 
                            title="Starter"
                            price={9}
                            features={[
                                "Custom domain",
                                "Basic analytics",
                                "Up to 5 content sections",
                                "Mobile-optimized profile",
                                "Email support"
                            ]}
                            isSelected={selectedPlan === 'starter'}
                            onSelect={() => handleSelectPlan('starter')}
                            isPopular={false}
                            trialDays={14}
                        />
                        
                        <PlanCard 
                            title="Pro"
                            price={19}
                            features={[
                                "Everything in Starter",
                                "Advanced analytics",
                                "Unlimited content sections",
                                "Priority support",
                                "Remove branding",
                                "Custom CSS",
                                "SEO optimization tools"
                            ]}
                            isSelected={selectedPlan === 'pro'}
                            onSelect={() => handleSelectPlan('pro')}
                            isPopular={true}
                            trialDays={14}
                        />
                        
                        <PlanCard 
                            title="Business"
                            price={49}
                            features={[
                                "Everything in Pro",
                                "Multiple team members",
                                "Advanced integrations",
                                "Dedicated account manager",
                                "Custom development",
                                "White-label solution",
                                "Priority feature requests"
                            ]}
                            isSelected={selectedPlan === 'business'}
                            onSelect={() => handleSelectPlan('business')}
                            isPopular={false}
                            trialDays={14}
                        />
                        
                        <View style={styles.guaranteeContainer}>
                            <Image 
                                source={require('../../assets/icons/home/shield-124-1691989601.png')} 
                                style={styles.guaranteeIcon} 
                            />
                            <View style={styles.guaranteeTextContainer}>
                                <Text style={styles.guaranteeTitle}>100% Satisfaction Guarantee</Text>
                                <Text style={styles.guaranteeText}>
                                    Try risk-free for 14 days. If you're not completely satisfied, cancel before your trial ends and you won't be charged.
                                </Text>
                            </View>
                        </View>
                        
                        <View style={styles.faqContainer}>
                            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
                            
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>When will I be charged?</Text>
                                <Text style={styles.faqAnswer}>
                                    Your 14-day free trial starts today. You won't be charged until the trial period ends.
                                </Text>
                            </View>
                            
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>Can I change plans later?</Text>
                                <Text style={styles.faqAnswer}>
                                    Yes, you can upgrade or downgrade your plan at any time from your account settings.
                                </Text>
                            </View>
                            
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>How do I cancel my subscription?</Text>
                                <Text style={styles.faqAnswer}>
                                    You can cancel your subscription anytime from your account settings. If you cancel during your trial period, you won't be charged.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
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
    planCard: {
        padding: 20,
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    selectedPlanCard: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    popularPlanCard: {
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 20,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    popularBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    planHeader: {
        marginBottom: 15,
        alignItems: 'center',
    },
    planTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    popularPlanTitle: {
        color: '#3B82F6',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 10,
    },
    currency: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
        marginBottom: 5,
    },
    planPrice: {
        fontSize: 36,
        fontWeight: '700',
        color: '#000',
    },
    pricePeriod: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 5,
        marginLeft: 2,
    },
    trialBadge: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 5,
    },
    trialText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.7)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: 15,
    },
    featuresContainer: {
        marginBottom: 10,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    popularFeatureIcon: {
        tintColor: '#3B82F6',
    },
    featureText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.8)',
        flex: 1,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    checkIcon: {
        width: 22,
        height: 22,
    },
    guaranteeContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 25,
        alignItems: 'center',
    },
    guaranteeIcon: {
        width: 30,
        height: 30,
        marginRight: 15,
        tintColor: '#000',
    },
    guaranteeTextContainer: {
        flex: 1,
    },
    guaranteeTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 5,
    },
    guaranteeText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)',
        lineHeight: 18,
    },
    faqContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    faqTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
        textAlign: 'center',
    },
    faqItem: {
        marginBottom: 15,
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 15,
        borderRadius: 12,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 5,
    },
    faqAnswer: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)',
        lineHeight: 18,
    },
});

export default PricingPlans; 