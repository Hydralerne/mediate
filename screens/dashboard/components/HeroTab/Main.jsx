import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ContentHeader from '../ContentHeader';
import { useBottomSheet } from '../../../../contexts/BottomSheet';
import { socialIcons } from '../../../onboarding/components/SocialIcons';
import AddSocialSheet from '../AddSocialSheet';

// Define the component first, then wrap it with memo
const SocialTabComponent = ({ 
    socialLinks = [], 
    onAddSocialLink, 
    onRemoveSocialLink 
}) => {
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    
    // Open the bottom sheet to add a new social
    const handleAddMore = useCallback(() => {
        openBottomSheet(
            <AddSocialSheet 
                onClose={closeBottomSheet}
                onAdd={(newSocial) => {
                    onAddSocialLink(newSocial);
                    closeBottomSheet();
                }}
                connectedSocials={socialLinks}
            />,
            ['80%']
        );
    }, [openBottomSheet, closeBottomSheet, onAddSocialLink, socialLinks]);
    
    return (
        <View style={styles.tabContent}>
            <ContentHeader 
                title="Social Links" 
                subtitle="Connect your social media accounts to your website." 
            />            
            <View style={styles.socialSettings}>
                {/* Connected socials */}
                {socialLinks.length > 0 ? (
                    socialLinks.map(social => {
                        const socialData = socialIcons[social.type];
                        if (!socialData) return null; // Skip if icon data not found
                        
                        return (
                            <View key={social.type} style={styles.socialItem}>
                                <View style={styles.socialInfo}>
                                    <Image 
                                        source={socialData.image} 
                                        style={styles.socialIcon} 
                                    />
                                    <View style={styles.socialTextContainer}>
                                        <Text style={styles.socialLabel}>{socialData.title}</Text>
                                        <Text style={styles.socialUrl} numberOfLines={1}>{social.url}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.removeButton}
                                    onPress={() => onRemoveSocialLink(social.type)}
                                >
                                    <Image 
                                        source={require('../../../../assets/icons/home/trash-17-1658431404.png')} 
                                        style={styles.removeIcon} 
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Image 
                            source={require('../../../../assets/icons/home/link-57-1663582874.png')} 
                            style={styles.emptyIcon} 
                        />
                        <Text style={styles.emptyTitle}>No Social Links Added</Text>
                        <Text style={styles.emptyText}>
                            Add your social media profiles to connect with your audience
                        </Text>
                    </View>
                )}
                
                {/* Add button */}
                <TouchableOpacity 
                    style={styles.addSocialButton}
                    onPress={handleAddMore}
                >
                    <Text style={styles.addSocialButtonText}>+ Add Social Link</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Then wrap it with memo
const SocialTab = React.memo(SocialTabComponent);

const styles = StyleSheet.create({
    tabContent: {
        backgroundColor: '#f8f9fa',
    },
    socialSettings: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginHorizontal: 20,
    },
    socialItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    socialInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    socialTextContainer: {
        flex: 1,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialLabel: {
        fontSize: 16,
        color: '#000',
    },
    socialUrl: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
        marginTop: 2,
    },
    removeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeIcon: {
        width: 18,
        height: 18,
        tintColor: '#FF4D4F',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    emptyIcon: {
        width: 48,
        height: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    addSocialButton: {
        marginTop: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addSocialButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default SocialTab; 