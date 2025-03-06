import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated } from 'react-native';
import Welcome from '../../screens/onboarding/Welcome';
import Setup from '../../screens/onboarding/Setup';
import TemplateSelection from '../../screens/onboarding/TemplateSelection';
import ContentCustomization from '../../screens/onboarding/ContentCustomization';
import DomainConnection from '../../screens/onboarding/DomainConnection';
import FreeDomainSelection from '../../screens/onboarding/FreeDomainSelection';
import CustomDomainSelection from '../../screens/onboarding/CustomDomainSelection';
import PricingPlans from '../../screens/onboarding/PricingPlans';
import PaymentScreen from '../../screens/onboarding/PaymentScreen';
import OnboardingSuccess from '../../screens/onboarding/OnboardingSuccess';

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'none',
        contentStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={Welcome} />
      <Stack.Screen name="OnboardingSetup" component={Setup} />
      <Stack.Screen name="OnboardingTemplateSelection" component={TemplateSelection} />
      <Stack.Screen name="OnboardingContentCustomization" component={ContentCustomization} />
      <Stack.Screen name="OnboardingDomainConnection" component={DomainConnection} />
      <Stack.Screen name="OnboardingFreeDomain" component={FreeDomainSelection} />
      <Stack.Screen name="OnboardingCustomDomain" component={CustomDomainSelection} />
      <Stack.Screen name="OnboardingPricingPlans" component={PricingPlans} />
      <Stack.Screen name="OnboardingPayment" component={PaymentScreen} />
      <Stack.Screen name="OnboardingSuccess" component={OnboardingSuccess} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;