import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { memo, useState, useContext } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useNavigation } from '@react-navigation/native';
import Wrapper from './Wrapper';

// Domain option card component
const DomainOption = ({ title, price, features, isSelected, onSelect, isPremium }) => (
    <TouchableOpacity
        style={[
            styles.domainCard,
            isSelected && styles.selectedDomainCard,
            isPremium && styles.premiumCard
        ]}
        onPress={onSelect}
    >
        {isPremium && (
            <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>RECOMMENDED</Text>
            </View>
        )}

        <View style={styles.domainCardHeader}>
            <Text style={[styles.domainTitle, isPremium && styles.premiumTitle]}>{title}</Text>
            <Text style={styles.domainPrice}>{price}</Text>
        </View>

        <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                    <Image
                        source={require('../../assets/icons/home/check circle-3-1660219236.png')}
                        style={styles.featureIcon}
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
);

const DomainConnection = memo(({ navigation }) => {
    const [selectedOption, setSelectedOption] = useState('free');
    const { setDomainType } = useContext(OnboardingContext);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setDomainType(option);
    };

    const handleContinue = () => {
        // Navigate to the appropriate domain selection screen based on the option
        if (selectedOption === 'free') {
            navigation.navigate('OnboardingFreeDomain');
        } else {
            navigation.navigate('OnboardingCustomDomain');
        }
    };

    return (
        <Wrapper allowScroll={true} navigation={navigation}>
            <View style={styles.innerContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Establish Your Professional Identity</Text>
                    <Text style={styles.subtitle}>
                        Your domain is your digital business card. Choose how you want to be found online.
                    </Text>
                </View>

                <View style={styles.content}>
                    <DomainOption
                        title="Free Domain"
                        price="$0/year"
                        features={[
                            "Professional web address",
                            "Easy to share",
                            "No setup required",
                            "Instant availability"
                        ]}
                        isSelected={selectedOption === 'free'}
                        onSelect={() => handleSelectOption('free')}
                        isPremium={false}
                    />

                    <DomainOption
                        title="Custom Domain"
                        price="From $12/year"
                        features={[
                            "Your own unique web address",
                            "Enhanced brand credibility",
                            "Better memorability",
                            "Full ownership"
                        ]}
                        isSelected={selectedOption === 'custom'}
                        onSelect={() => handleSelectOption('custom')}
                        isPremium={true}
                    />

                    <View style={styles.infoBox}>
                        <Image
                            source={require('../../assets/icons/home/info circle-83-1658234612.png')}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>
                            A professional domain makes your profile more credible and easier to remember.
                            {selectedOption === 'custom'
                                ? " Custom domains provide the highest level of professionalism and brand recognition."
                                : " Free domains are perfect for getting started quickly."}
                        </Text>
                    </View>
                </View>
            </View>
        </Wrapper>
    );
});

const styles = StyleSheet.create({
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
    domainCard: {
        padding: 20,
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    selectedDomainCard: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    premiumCard: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    premiumBadge: {
        position: 'absolute',
        top: -10,
        right: 20,
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    premiumBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: '700',
    },
    domainCardHeader: {
        marginBottom: 15,
    },
    domainTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 5,
    },
    premiumTitle: {
        color: '#000',
    },
    domainPrice: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
    },
    featuresContainer: {
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
    selectedIndicator: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    checkIcon: {
        width: 22,
        height: 22,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 15,
        borderRadius: 12,
        marginTop: 5,
    },
    infoIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: 'rgba(0,0,0,0.6)',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: 'rgba(0,0,0,0.7)',
        lineHeight: 18,
    },
});

export default DomainConnection; 