import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated, View, StyleSheet } from 'react-native';
import Welcome from '../screens/onboarding/Welcome';
import Setup from '../screens/onboarding/Setup';
import TemplateSelection from '../screens/onboarding/TemplateSelection';
import ContentCustomization from '../screens/onboarding/ContentCustomization';
import DomainConnection from '../screens/onboarding/DomainConnection';
import FreeDomainSelection from '../screens/onboarding/FreeDomainSelection';
import CustomDomainSelection from '../screens/onboarding/CustomDomainSelection';
import PricingPlans from '../screens/onboarding/PricingPlans';
import PaymentScreen from '../screens/onboarding/PaymentScreen';
import OnboardingSuccess from '../screens/onboarding/OnboardingSuccess';

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        animation: 'none',
        contentStyle: {
          backgroundColor: 'transparent',
        },
        cardOverlayEnabled: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen 
        name="OnboardingWelcome" 
        component={Welcome} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingSetup" 
        component={Setup} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingTemplateSelection" 
        component={TemplateSelection} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingContentCustomization" 
        component={ContentCustomization} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingDomainConnection" 
        component={DomainConnection} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingFreeDomain" 
        component={FreeDomainSelection} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingCustomDomain" 
        component={CustomDomainSelection} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingPricingPlans" 
        component={PricingPlans} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingPayment" 
        component={PaymentScreen} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
      <Stack.Screen 
        name="OnboardingSuccess" 
        component={OnboardingSuccess} 
        options={{ 
          contentStyle: { backgroundColor: 'transparent' } 
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  transparentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default OnboardingStack;