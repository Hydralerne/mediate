import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { memo, useState, useContext } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useBottomSheet } from '../../contexts/BottomSheet';

// Content configuration sheets for each section type
const AboutMeSheet = ({ onSave }) => {
    const [bio, setBio] = useState('');
    
    return (
        <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>About Me</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Write a short bio about yourself..."
                multiline
                value={bio}
                onChangeText={setBio}
            />
            <TouchableButton 
                style={styles.saveButton}
                onPress={() => onSave({ bio })}
            >
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableButton>
        </View>
    );
};


// Content section component
const ContentSection = ({ title, description, icon, onPress, isActive, onConfigure }) => (
    <TouchableOpacity 
        style={[styles.sectionCard, isActive && styles.activeSection]} 
        onPress={onPress}
    >
        <View style={styles.sectionHeader}>
            <Image source={icon} style={styles.sectionIcon} />
            <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionDescription}>{description}</Text>
            </View>
        </View>
        <View style={styles.sectionStatus}>
            {isActive ? (
                <TouchableOpacity 
                    style={styles.configureButton}
                    onPress={onConfigure}
                >
                    <Text style={styles.configureButtonText}>Configure</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                </View>
            )}
        </View>
    </TouchableOpacity>
);

const ContentCustomization = memo(() => {
    // Track which content sections are active
    const [activeSections, setActiveSections] = useState({
        about: false,
        portfolio: false,
        products: false,
        videos: false,
        blog: false,
        services: false,
        contact: false
    });

    // Track configuration data for each section
    const [sectionData, setSectionData] = useState({
        about: {},
        portfolio: [],
        products: [],
        videos: [],
        blog: [],
        services: [],
        contact: {}
    });

    const { setContentSections, setContentData } = useContext(OnboardingContext);
    const { openBottomSheet } = useBottomSheet();

    const toggleSection = (sectionKey) => {
        const updatedSections = {
            ...activeSections,
            [sectionKey]: !activeSections[sectionKey]
        };
        
        setActiveSections(updatedSections);
        setContentSections(updatedSections);
        
        // If turning on a section, immediately open configuration
        if (!activeSections[sectionKey]) {
            configureSection(sectionKey);
        }
    };

    const configureSection = (sectionKey) => {
        // Open appropriate configuration sheet based on section type
        switch(sectionKey) {
            case 'about':
                openBottomSheet(
                    <AboutMeSheet 
                        onSave={(data) => saveConfigData(sectionKey, data)} 
                        initialData={sectionData.about}
                    />
                );
                break;
            case 'portfolio':
                // Navigate to a full screen portfolio editor
                // navigation.navigate('PortfolioEditor', { 
                //     onSave: (data) => saveConfigData(sectionKey, data),
                //     initialData: sectionData.portfolio
                // });
                break;
            // Handle other section types...
            default:
                console.log(`Configure ${sectionKey}`);
        }
    };

    const saveConfigData = (sectionKey, data) => {
        const updatedData = {
            ...sectionData,
            [sectionKey]: data
        };
        
        setSectionData(updatedData);
        setContentData(updatedData);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Customize Your Content</Text>
                        <Text style={styles.subtitle}>
                            Select and configure the sections you want to include in your profile
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <ContentSection 
                            title="About Me" 
                            description="Share your story and background"
                            icon={require('../../assets/icons/home/user information-309-1658436041.png')}
                            onPress={() => toggleSection('about')}
                            isActive={activeSections.about}
                            onConfigure={() => configureSection('about')}
                        />
                        
                        <ContentSection 
                            title="Portfolio Showcase" 
                            description="Display your work and projects"
                            icon={require('../../assets/icons/home/roadmap-47-1681196106.png')}
                            onPress={() => toggleSection('portfolio')}
                            isActive={activeSections.portfolio}
                            onConfigure={() => configureSection('portfolio')}
                        />
                        
                        <ContentSection 
                            title="Products" 
                            description="Showcase items you're selling"
                            icon={require('../../assets/icons/home/store-116-1658238103.png')}
                            onPress={() => toggleSection('products')}
                            isActive={activeSections.products}
                            onConfigure={() => configureSection('products')}
                        />
                        
                        <ContentSection 
                            title="Videos" 
                            description="Share video content with your audience"
                            icon={require('../../assets/icons/home/youtube circle-0-1693375323.png')}
                            onPress={() => toggleSection('videos')}
                            isActive={activeSections.videos}
                            onConfigure={() => configureSection('videos')}
                        />
                        
                        <ContentSection 
                            title="Blog Posts" 
                            description="Share your thoughts and articles"
                            icon={require('../../assets/icons/home/feedly-180-1693375492.png')}
                            onPress={() => toggleSection('blog')}
                            isActive={activeSections.blog}
                            onConfigure={() => configureSection('blog')}
                        />
                        
                        <ContentSection 
                            title="Services" 
                            description="Highlight or directly buy services you offer"
                            icon={require('../../assets/icons/home/payoneer-0-1693375216.png')}
                            onPress={() => toggleSection('services')}
                            isActive={activeSections.services}
                            onConfigure={() => configureSection('services')}
                        />
                        
                        <ContentSection 
                            title="Contact Form" 
                            description="Let visitors get in touch with you"
                            icon={require('../../assets/icons/home/email sendng-69-1659689482.png')}
                            onPress={() => toggleSection('contact')}
                            isActive={activeSections.contact}
                            onConfigure={() => configureSection('contact')}
                        />
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
    sectionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 0,
        backgroundColor: colors.lightBorder,
        borderRadius: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeSection: {
        borderColor: '#000',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    sectionTitleContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.7)',
    },
    sectionStatus: {
        marginLeft: 10,
    },
    activeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
    activeText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#000',
        borderRadius: 12,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    configureButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
    },
    configureButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
    sheetContainer: {
        padding: 20,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 16,
        textAlign: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.lightBorder,
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ContentCustomization; 