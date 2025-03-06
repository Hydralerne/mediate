import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { memo, useState, useContext, useEffect } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useBottomSheet } from '../../contexts/BottomSheet';
import TldSelectorSheet from './TldSelectorSheet';

// TLD Option component with improved styling
const TldOption = ({ tld, price, isSelected, onSelect }) => (
    <TouchableOpacity 
        style={[
            styles.tldOption,
            isSelected && styles.selectedTldOption
        ]}
        onPress={() => onSelect(tld)}
        activeOpacity={0.7}
    >
        <Text style={[styles.tldText, isSelected && styles.selectedTldText]}>.{tld}</Text>
        <Text style={[styles.tldPrice, isSelected && styles.selectedTldPrice]}>${price}/year</Text>
        
        {isSelected && (
            <View style={styles.checkmarkContainer}>
                {/* <Image 
                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                    style={styles.checkmarkIcon} 
                /> */}
            </View>
        )}
    </TouchableOpacity>
);

// Domain Result component with improved styling
const DomainResult = ({ domain, tld, isAvailable, price, onSelect, isSelected }) => (
    <TouchableOpacity 
        style={[
            styles.domainResultItem,
            isSelected && styles.selectedDomainResult,
            !isAvailable && styles.unavailableDomainResult
        ]}
        onPress={() => isAvailable ? onSelect(`${domain}.${tld}`) : null}
        activeOpacity={isAvailable ? 0.7 : 1}
        disabled={!isAvailable}
    >
        <View style={styles.domainResultContent}>
            <Text style={[
                styles.domainResultText,
                isSelected && styles.selectedDomainResultText,
                !isAvailable && styles.unavailableDomainResultText
            ]}>
                {domain}<Text style={styles.tldInResult}>.{tld}</Text>
            </Text>
            
            <View style={styles.domainResultStatus}>
                {isAvailable ? (
                    <>
                        <Text style={styles.domainResultPrice}>${price}/year</Text>
                        {isSelected && (
                            <View style={styles.resultCheckmarkContainer}>
                                <Image 
                                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                    style={styles.resultCheckmarkIcon} 
                                />
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.takenBadge}>
                        <Text style={styles.takenText}>Taken</Text>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

const CustomDomainSelection = memo(() => {
    const [domainName, setDomainName] = useState('');
    const [selectedTld, setSelectedTld] = useState('com');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    
    // Use the bottom sheet context
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    
    const { profileData, setDomainInfo } = useContext(OnboardingContext);
    
    // Popular TLD options for quick selection
    const popularTlds = [
        { tld: 'com', price: 12 },
        { tld: 'net', price: 12 },
        { tld: 'org', price: 12 },
        { tld: 'io', price: 40 },
        { tld: 'co', price: 25 },
    ];
    
    // Suggest a domain based on user's name or brand
    const suggestedName = profileData?.name 
        ? profileData.name.toLowerCase().replace(/\s+/g, '') 
        : '';
    
    // Set suggested name when component mounts
    useEffect(() => {
        if (suggestedName && !domainName) {
            setDomainName(suggestedName);
        }
    }, [suggestedName]);
    
    const handleDomainNameChange = (value) => {
        // Only allow alphanumeric and hyphen
        const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setDomainName(sanitized);
        setSearchResults([]);
        setSelectedDomain(null);
    };
    
    const handleSelectTld = (tld) => {
        setSelectedTld(tld);
        setSearchResults([]);
        setSelectedDomain(null);
    };
    
    const handleOpenTldSelector = () => {
        // Open the bottom sheet with the TldSelectorSheet component
        openBottomSheet(
            <TldSelectorSheet 
                onSelect={handleSelectTld}
                selectedTld={selectedTld}
                onClose={closeBottomSheet}
            />,
            ['80%']
        );
    };
    
    const handleSearch = () => {
        if (!domainName || domainName.length < 3) return;
        
        setIsSearching(true);
        setSearchResults([]);
        
        // Simulate API call to check domain availability
        setTimeout(() => {
            // In a real app, you would check availability for the selected TLD
            // and also suggest alternatives
            
            // For demo purposes, let's create some results
            const mainResult = {
                domain: domainName,
                tld: selectedTld,
                isAvailable: (domainName.length + selectedTld.length) % 2 === 0, // Random availability
                price: getTldPrice(selectedTld)
            };
            
            // Generate alternative suggestions
            const alternatives = popularTlds
                .filter(option => option.tld !== selectedTld)
                .map(option => ({
                    domain: domainName,
                    tld: option.tld,
                    isAvailable: (domainName.length + option.tld.length) % 3 !== 0, // Different random availability
                    price: option.price
                }));
            
            setSearchResults([mainResult, ...alternatives]);
            setIsSearching(false);
            
            // Auto-select the first available domain
            const firstAvailable = [mainResult, ...alternatives].find(result => result.isAvailable);
            if (firstAvailable) {
                setSelectedDomain(`${firstAvailable.domain}.${firstAvailable.tld}`);
                setDomainInfo({
                    type: 'custom',
                    value: `${firstAvailable.domain}.${firstAvailable.tld}`
                });
            }
        }, 1500);
    };
    
    const getTldPrice = (tld) => {
        const found = popularTlds.find(item => item.tld === tld);
        return found ? found.price : 15; // Default price if not found
    };
    
    const handleSelectDomain = (domain) => {
        setSelectedDomain(domain);
        setDomainInfo({
            type: 'custom',
            value: domain
        });
    };
    
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Find Your Perfect Domain</Text>
                        <Text style={styles.subtitle}>
                            A custom domain enhances your professional image and makes your profile easier to find
                        </Text>
                    </View>
                    
                    <View style={styles.content}>
                        <View style={styles.domainBuilderContainer}>
                            <Text style={styles.sectionTitle}>Build Your Domain</Text>
                            
                            <View style={styles.domainNameContainer}>
                                <TextInput
                                    style={styles.domainNameInput}
                                    placeholder="Enter your domain name"
                                    placeholderTextColor='rgba(0,0,0,0.25)'
                                    value={domainName}
                                    onChangeText={handleDomainNameChange}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                
                                <TouchableOpacity 
                                    style={styles.tldSelector}
                                    onPress={handleOpenTldSelector}
                                >
                                    <Text style={styles.tldSelectorText}>.{selectedTld}</Text>
                                    <Image 
                                        source={require('../../assets/icons/home/chevron down-4-1696832126.png')} 
                                        style={styles.tldSelectorIcon} 
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableButton 
                                style={[
                                    styles.searchButton,
                                    (!domainName || domainName.length < 3) && styles.disabledButton
                                ]}
                                onPress={handleSearch}
                                disabled={!domainName || domainName.length < 3}
                            >
                                <Text style={styles.searchButtonText}>Check Availability</Text>
                            </TouchableButton>
                        </View>
                        
                        <Text style={styles.quickSelectTitle}>Quick Select TLD</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.tldContainer}
                            contentContainerStyle={styles.tldContainerContent}
                        >
                            {popularTlds.map(option => (
                                <TldOption 
                                    key={option.tld}
                                    tld={option.tld}
                                    price={option.price}
                                    isSelected={selectedTld === option.tld}
                                    onSelect={handleSelectTld}
                                />
                            ))}
                            
                            <TouchableOpacity 
                                style={styles.moreTldsButton}
                                onPress={handleOpenTldSelector}
                            >
                                <Text style={styles.moreTldsText}>More...</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        
                        {isSearching ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#000" />
                                <Text style={styles.loadingText}>Searching for available domains...</Text>
                            </View>
                        ) : searchResults.length > 0 ? (
                            <View style={styles.resultsContainer}>
                                <Text style={styles.resultsTitle}>Available Domains</Text>
                                {searchResults.map((result, index) => (
                                    <DomainResult 
                                        key={index}
                                        domain={result.domain}
                                        tld={result.tld}
                                        isAvailable={result.isAvailable}
                                        price={result.price}
                                        onSelect={handleSelectDomain}
                                        isSelected={selectedDomain === `${result.domain}.${result.tld}`}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Image 
                                    source={require('../../assets/icons/menu-bottom/search-123-1658435124.png')} 
                                    style={styles.emptyStateIcon} 
                                />
                                <Text style={styles.emptyStateText}>
                                    Search for your ideal domain name to see what's available
                                </Text>
                            </View>
                        )}
                        
                        <View style={styles.tipsContainer}>
                            <Text style={styles.tipsTitle}>Pro Tips:</Text>
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
                                <Text style={styles.tipText}>.com domains are most recognized</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Image 
                                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                                    style={styles.tipIcon} 
                                />
                                <Text style={styles.tipText}>Consider industry-specific TLDs (.dev for developers)</Text>
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
        paddingTop: 20,
        paddingBottom: 100,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 20,
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
    domainBuilderContainer: {
        marginBottom: 25,
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        padding: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 12,
    },
    domainNameContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    domainNameInput: {
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
    tldSelector: {
        height: 55,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 0,
    },
    tldSelectorText: {
        fontSize: 16,
        color: '#000',
        marginRight: 5,
    },
    tldSelectorIcon: {
        width: 16,
        height: 16,
        tintColor: 'rgba(0,0,0,0.5)',
    },
    searchButton: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.5,
    },
    quickSelectTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        marginHorizontal: 20,
        color: '#000',
    },
    tldContainer: {
        paddingTop: 5,
    },
    tldContainerContent: {
        paddingVertical: 5,
        marginHorizontal: 20,

    },
    tldOption: {
        backgroundColor: colors.lightBorder,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 10,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    selectedTldOption: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    tldText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    selectedTldText: {
        color: '#000',
    },
    tldPrice: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
    },
    selectedTldPrice: {
        color: 'rgba(0,0,0,0.7)',
    },
    checkmarkContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkIcon: {
        width: 20,
        height: 20,
    },
    moreTldsButton: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 20,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    moreTldsText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.7)',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
        marginTop: 15,
    },
    resultsContainer: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#000',
    },
    domainResultItem: {
        backgroundColor: colors.lightBorder,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedDomainResult: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    unavailableDomainResult: {
        opacity: 0.7,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    domainResultContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    domainResultText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    selectedDomainResultText: {
        color: '#000',
    },
    unavailableDomainResultText: {
        color: 'rgba(0,0,0,0.5)',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    tldInResult: {
        color: 'rgba(0,0,0,0.7)',
    },
    domainResultStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    domainResultPrice: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.7)',
        marginRight: 10,
    },
    resultCheckmarkContainer: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultCheckmarkIcon: {
        width: 20,
        height: 20,
    },
    takenBadge: {
        backgroundColor: 'rgba(255,0,0,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    takenText: {
        color: 'rgba(255,0,0,0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    emptyStateIcon: {
        width: 40,
        height: 40,
        tintColor: 'rgba(0,0,0,0.3)',
        marginBottom: 15,
    },
    emptyStateText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
    },
    tipsContainer: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        marginHorizontal: 20,
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

export default CustomDomainSelection; 