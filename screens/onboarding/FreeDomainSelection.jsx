import { View, Text, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import React, { memo, useState, useContext, useEffect } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const FreeDomainSelection = memo(() => {
    const [subdomain, setSubdomain] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const { profileData, setDomainInfo } = useContext(OnboardingContext);
    
    // Suggest a domain based on user's name or brand
    const suggestedName = profileData?.name 
        ? profileData.name.toLowerCase().replace(/\s+/g, '') 
        : '';
    
    // Set suggested name when component mounts
    useEffect(() => {
        if (suggestedName && !subdomain) {
            setSubdomain(suggestedName);
            checkAvailability(suggestedName);
        }
    }, [suggestedName]);
    
    const checkAvailability = (value) => {
        if (!value) return;
        
        setIsChecking(true);
        
        // Simulate API call to check availability
        setTimeout(() => {
            // For demo purposes, let's say it's available if longer than 5 chars
            const available = value.length >= 3;
            setIsAvailable(available);
            setIsChecking(false);
            
            if (available) {
                setDomainInfo({
                    type: 'free',
                    value: `${value}.oblien.com`
                });
            }
        }, 800);
    };
    
    const handleSubdomainChange = (value) => {
        // Only allow alphanumeric and hyphen
        const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSubdomain(sanitized);
        setIsAvailable(null);
        
        if (sanitized.length >= 3) {
            checkAvailability(sanitized);
        }
    };
    
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Choose Your Free Domain</Text>
                        <Text style={styles.subtitle}>
                            Select a unique name for your free Oblien domain
                        </Text>
                    </View>
                    
                    <View style={styles.content}>
                        <View style={styles.domainInputContainer}>
                            <TextInput
                                style={styles.domainInput}
                                placeholder="yourname"
                                value={subdomain}
                                onChangeText={handleSubdomainChange}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <View style={styles.domainSuffix}>
                                <Text style={styles.domainSuffixText}>.oblien.com</Text>
                            </View>
                        </View>
                        
                        <View style={styles.availabilityContainer}>
                            {isChecking ? (
                                <Text style={styles.checkingText}>Checking availability...</Text>
                            ) : isAvailable === true ? (
                                <View style={styles.availabilityStatus}>
                                    <Image 
                                        source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                        style={styles.statusIcon} 
                                    />
                                    <Text style={styles.availableText}>Available!</Text>
                                </View>
                            ) : isAvailable === false ? (
                                <View style={styles.availabilityStatus}>
                                    <Image 
                                        // source={require('../../assets/icons/home/x-circle.png')} 
                                        style={[styles.statusIcon, styles.unavailableIcon]} 
                                    />
                                    <Text style={styles.unavailableText}>Not available. Try another name.</Text>
                                </View>
                            ) : null}
                        </View>
                        
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewLabel}>Your domain will look like:</Text>
                            <View style={styles.domainPreview}>
                                <Text style={styles.domainPreviewText}>
                                    {subdomain || 'yourname'}.oblien.com
                                </Text>
                            </View>
                        </View>
                        
                        <View style={styles.tipsContainer}>
                            <Text style={styles.tipsTitle}>Tips for a good domain:</Text>
                            <View style={styles.tipItem}>
                                <Image 
                                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                    style={styles.tipIcon} 
                                />
                                <Text style={styles.tipText}>Keep it short and memorable</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Image 
                                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                    style={styles.tipIcon} 
                                />
                                <Text style={styles.tipText}>Use your name or brand</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Image 
                                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                    style={styles.tipIcon} 
                                />
                                <Text style={styles.tipText}>Avoid numbers unless part of your brand</Text>
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
        paddingBottom: 100,
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
    domainInputContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    domainInput: {
        flex: 1,
        height: 55,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    domainSuffix: {
        height: 55,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    domainSuffixText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
    },
    availabilityContainer: {
        height: 30,
        marginBottom: 20,
    },
    availabilityStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    unavailableIcon: {
        tintColor: '#FF3B30',
    },
    checkingText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 14,
    },
    availableText: {
        color: '#34C759',
        fontSize: 14,
        fontWeight: '500',
    },
    unavailableText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '500',
    },
    previewContainer: {
        marginBottom: 30,
    },
    previewLabel: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        marginBottom: 8,
    },
    domainPreview: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    domainPreviewText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    tipsContainer: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 15,
        borderRadius: 12,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    tipText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.8)',
    },
});

export default FreeDomainSelection; 