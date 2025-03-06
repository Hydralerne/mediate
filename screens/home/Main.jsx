import { View, StyleSheet, Text, Platform } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { memo } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import colors from '../../utils/colors';
import OnboardingStack from '../../navigations/stacks/OnboardingStack';
import TouchableButton from '../../components/global/ButtonTap';
import useOnboarding from '../onboarding/hooks/useOnboarding';
import { BottomSheetProvider } from '../../contexts/BottomSheet';
import { useState, useEffect, useContext } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { OnboardingProvider } from '../../contexts/OnboardingContext';

const HeaderVideo = memo(() => {
    const player = useVideoPlayer(require('../../assets/videos/welcome-perview.mp4'), player => {
        player.loop = true;
        player.play();
        player.muted = true;
    });

    return (
        <VideoView
            nativeControls={false}
            style={styles.video}
            player={player}
            objectFit="cover"
        />
    );
});

const OnboardingController = () => {
    const navigation = useNavigation();
    const { 
        templateSelection, 
        domainType, 
        domainInfo, 
        pricingPlan, 
        paymentComplete,
        setPaymentComplete 
    } = useContext(OnboardingContext);

    // Define onboarding steps
    const onboardingSteps = [
        'OnboardingWelcome',
        'OnboardingSetup',
        'OnboardingTemplateSelection',
        'OnboardingContentCustomization',
        'OnboardingDomainConnection',
        'OnboardingPricingPlans',
        'OnboardingPayment',
        // Add any future steps here
    ];

    // Domain selection screens (not in main flow)
    const domainScreens = [
        'OnboardingFreeDomain',
        'OnboardingCustomDomain'
    ];

    // Get current screen from navigation state
    const [currentStep, setCurrentStep] = useState('OnboardingWelcome');

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            // Get current route name
            const route = e.data.state.routes[e.data.state.index];
            if (route && route.state && route.state.routes) {
                const currentRouteName = route.state.routes[route.state.routes.length - 1].name;
                if ([...onboardingSteps, ...domainScreens].includes(currentRouteName)) {
                    setCurrentStep(currentRouteName);
                }
            }
        });

        return unsubscribe;
    }, [navigation]);

    const currentStepIndex = onboardingSteps.indexOf(currentStep);
    const isDomainScreen = domainScreens.includes(currentStep);

    // Check if the current step requires a selection before continuing
    const isButtonDisabled = () => {
        if (currentStep === 'OnboardingTemplateSelection' && !templateSelection) {
            return true;
        }
        if (currentStep === 'OnboardingDomainConnection' && !domainType) {
            return true;
        }
        if (isDomainScreen && !domainInfo.value) {
            return true;
        }
        if (currentStep === 'OnboardingPricingPlans' && !pricingPlan) {
            return true;
        }
        return false;
    };

    // Calculate total amount for payment
    const calculateTotal = () => {
        let total = 0;
        
        // During trial, subscription is free
        // Add domain cost if custom
        if (domainType === 'custom' && domainInfo.value) {
            total += parseFloat(domainInfo.price || 12);
        }
        
        return total.toFixed(2);
    };

    const handleContinue = () => {
        // Special case for payment screen - we'll let the payment screen handle its own navigation
        if (currentStep === 'OnboardingPayment') {
            // This will be handled by the payment screen's own button
            return;
        }
        
        // Special case for domain connection screen
        if (currentStep === 'OnboardingDomainConnection') {
            if (domainType === 'free') {
                navigation.navigate('Home', {
                    screen: 'OnboardingFreeDomain'
                });
            } else {
                navigation.navigate('Home', {
                    screen: 'OnboardingCustomDomain'
                });
            }
            return;
        }
        
        // Special case for domain selection screens
        if (isDomainScreen) {
            // Navigate to pricing plans after domain selection
            navigation.navigate('Home', {
                screen: 'OnboardingPricingPlans'
            });
            return;
        }
        
        // Special case for pricing plans screen
        if (currentStep === 'OnboardingPricingPlans') {
            navigation.navigate('Home', {
                screen: 'OnboardingPayment'
            });
            return;
        }
        
        // Normal flow for other screens
        if (currentStepIndex < onboardingSteps.length - 1) {
            navigation.navigate('Home', {
                screen: onboardingSteps[currentStepIndex + 1]
            });
        } else {
            console.log('Onboarding complete');
            // navigation.navigate('MainApp');
        }
    };

    const handlePreview = () => {
        // Implement preview functionality
        console.log('Preview template:', templateSelection);
        // You could navigate to a preview screen or show a modal
    };

    const handleSkip = () => {
        // Skip domain setup and go to next step or finish
        if (currentStepIndex < onboardingSteps.length - 1) {
            navigation.navigate('Home', {
                screen: onboardingSteps[currentStepIndex + 1]
            });
        } else {
            // Onboarding complete
            console.log('Onboarding complete');
            // navigation.navigate('MainApp');
        }
    };

    // Determine button text based on current step
    const getButtonText = () => {
        if (currentStepIndex === onboardingSteps.length - 1 && !isDomainScreen) {
            return 'Finish';
        }
        if (currentStep === 'OnboardingDomainConnection') {
            return 'Next';
        }
        if (isDomainScreen) {
            return 'Save & Continue';
        }
        if (currentStep === 'OnboardingPricingPlans') {
            return 'Continue to Payment';
        }
        return 'Continue';
    };

    // Hide controller for payment screen - we'll use the payment screen's own buttons
    if (currentStep === 'OnboardingPayment') {
        return null;
    }

    // Show different button configurations based on current screen
    if (currentStep === 'OnboardingTemplateSelection') {
        return (
            <View style={styles.continueButtonContainer}>
                <View style={styles.buttonRow}>
                    <TouchableButton
                        style={[
                            styles.previewButton,
                            !templateSelection && styles.disabledButton
                        ]}
                        onPress={handlePreview}
                        disabled={!templateSelection}
                    >
                        <Text style={styles.previewButtonText}>Preview</Text>
                    </TouchableButton>
                    
                    <TouchableButton
                        style={[
                            styles.continueButton,
                            isButtonDisabled() && styles.disabledButton
                        ]}
                        onPress={handleContinue}
                        disabled={isButtonDisabled()}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableButton>
                </View>
            </View>
        );
    }
    
    // Show Skip option for domain connection screen
    if (currentStep === 'OnboardingDomainConnection') {
        return (
            <View style={styles.continueButtonContainer}>
                <View style={styles.buttonRow}>
                    <TouchableButton
                        style={styles.skipButton}
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableButton>
                    
                    <TouchableButton
                        style={[
                            styles.continueButton,
                            isButtonDisabled() && styles.disabledButton
                        ]}
                        onPress={handleContinue}
                        disabled={isButtonDisabled()}
                    >
                        <Text style={styles.continueButtonText}>{getButtonText()}</Text>
                    </TouchableButton>
                </View>
            </View>
        );
    }

    // Special configuration for pricing screen
    if (currentStep === 'OnboardingPricingPlans') {
        return (
            <View style={styles.continueButtonContainer}>
                <TouchableButton
                    style={[
                        styles.singleButton,
                        isButtonDisabled() && styles.disabledButton
                    ]}
                    onPress={handleContinue}
                    disabled={isButtonDisabled()}
                >
                    <Text style={styles.continueButtonText}>{getButtonText()}</Text>
                </TouchableButton>
                <Text style={styles.trialDisclaimer}>
                    No credit card required. Cancel anytime.
                </Text>
            </View>
        );
    }

    // Default single button for other screens
    return (
        <View style={styles.continueButtonContainer}>
            <TouchableButton
                style={[
                    styles.singleButton,
                    isButtonDisabled() && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={isButtonDisabled()}
            >
                <Text style={styles.continueButtonText}>{getButtonText()}</Text>
            </TouchableButton>
        </View>
    );
};

const Main = () => {
    return (
        <OnboardingProvider>
            <BottomSheetProvider>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <HeaderVideo />
                    </View>
                    <View style={styles.content}>
                        <OnboardingStack />
                        <OnboardingController />
                    </View>
                </View>
            </BottomSheetProvider>
        </OnboardingProvider>
    );
};

const styles = StyleSheet.create({
    continueButtonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    container: {
        flex: 1,
    },
    header: {
        height: 150,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        position: 'relative',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: 200,
        marginTop: -20,
    },
    content: {
        flex: 1,
        backgroundColor: colors.mainColor,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        overflow: 'hidden',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    previewButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.075,
        shadowRadius: 2.5,
        
    },
    continueButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    singleButton: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    previewButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    skipButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '400',
    },
    disabledButton: {
        opacity: 0.5,
    },
    trialDisclaimer: {
        textAlign: 'center',
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
        marginTop: 8,
        fontWeight: '400',
    },
    paymentButton: {
        backgroundColor: '#000',
    },
});

export default memo(Main);
