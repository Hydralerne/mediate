import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import React, { memo, useState, useContext, useEffect } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useBottomSheet } from '../../contexts/BottomSheet';
import Wrapper from './Wrapper';

// Import from our middleware
import { 
  SECTION_TYPES, 
  getSectionMetadata, 
  getSectionIcon,
  getConfigComponent
} from '../../middleware/content';

// Content configuration sheets for each section type
const AboutMeSheet = ({ onSave, initialData = {} }) => {
    const [bio, setBio] = useState(initialData.bio || '');

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

const ContentCustomization = memo(({ navigation }) => {
    // Get state from context
    const { 
        contentSections, 
        setContentSections, 
        contentData, 
        setContentData,
        isLoading 
    } = useContext(OnboardingContext);
    
    // Local state for UI management
    const [localActiveSections, setLocalActiveSections] = useState(contentSections || {});
    const [localSectionData, setLocalSectionData] = useState(contentData || {});
    
    // Update local state when context data changes
    useEffect(() => {
        if (!isLoading) {
            setLocalActiveSections(contentSections || {});
            setLocalSectionData(contentData || {});
        }
    }, [contentSections, contentData, isLoading]);

    const { openBottomSheet } = useBottomSheet();

    const toggleSection = (sectionKey) => {
        const updatedSections = {
            ...localActiveSections,
            [sectionKey]: !localActiveSections[sectionKey]
        };

        setLocalActiveSections(updatedSections);
        setContentSections(updatedSections);

        // If turning on a section, immediately open configuration
        if (!localActiveSections[sectionKey]) {
            configureSection(sectionKey);
        }
    };

    const configureSection = (sectionKey) => {
        // Get the configuration component for this section type
        const ConfigComponent = getConfigComponent(sectionKey);
        
        if (ConfigComponent) {
            openBottomSheet(
                <ConfigComponent
                    onSave={(data) => saveConfigData(sectionKey, data)}
                    initialData={localSectionData[sectionKey] || {}}
                />
            );
        } else {
            console.log(`No configuration component found for ${sectionKey}`);
        }
    };

    const saveConfigData = (sectionKey, data) => {
        const updatedData = {
            ...localSectionData,
            [sectionKey]: data
        };

        setLocalSectionData(updatedData);
        setContentData(updatedData);
    };

    if (isLoading) {
        return (
            <Wrapper allowScroll={false} navigation={navigation}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loadingText}>Loading your content...</Text>
                </View>
            </Wrapper>
        );
    }

    // Get all section types
    const allSectionTypes = Object.values(SECTION_TYPES);

    return (
        <Wrapper allowScroll={true} navigation={navigation}>
            <View style={styles.innerContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Customize Your Content</Text>
                    <Text style={styles.subtitle}>
                        Select and configure the sections you want to include in your profile
                    </Text>
                </View>

                <View style={styles.content}>
                    {allSectionTypes.map(type => {
                        const metadata = getSectionMetadata(type);
                        return (
                            <ContentSection
                                key={type}
                                title={metadata.title}
                                description={metadata.description}
                                icon={getSectionIcon(type)}
                                onPress={() => toggleSection(type)}
                                isActive={localActiveSections[type] || false}
                                onConfigure={() => configureSection(type)}
                            />
                        );
                    })}
                </View>
            </View>
        </Wrapper>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
    },
});

export default ContentCustomization; 