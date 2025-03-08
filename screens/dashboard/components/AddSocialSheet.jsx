import React, { useState, useRef, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList,
    Image
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { socialIcons } from '../../onboarding/components/SocialIcons';

// Define the SocialItem component first, then wrap it with memo
const SocialItemComponent = ({ 
    code, 
    data, 
    isSelected, 
    onSelect 
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.socialItem,
                isSelected && styles.selectedSocialItem
            ]}
            onPress={() => onSelect(code)}
            activeOpacity={0.7}
        >
            <View style={styles.socialContent}>
                <View style={[
                    styles.socialIconContainer,
                    isSelected && styles.selectedSocialIconContainer
                ]}>
                    <Image 
                        source={data.image} 
                        style={styles.socialIcon} 
                    />
                </View>
                
                <Text style={[
                    styles.socialName,
                    isSelected && styles.selectedSocialName
                ]}>
                    {data.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// Then wrap it with memo
const SocialItem = React.memo(SocialItemComponent);

// Define the AddSocialSheet component first, then wrap it with memo
const AddSocialSheetComponent = ({ 
    onAdd, 
    onClose,
    connectedSocials = []
}) => {
    const [selectedType, setSelectedType] = useState(null);
    const [socialUrl, setSocialUrl] = useState('');
    const inputRef = useRef(null);
    
    const handleAdd = useCallback(() => {
        if (selectedType && socialUrl) {
            // Make sure we're passing the correct data structure
            const newSocial = {
                type: selectedType,
                url: socialUrl.trim()
            };
            
            console.log('Adding social:', newSocial);
            onAdd(newSocial);
        }
    }, [selectedType, socialUrl, onAdd]);
    
    const handleSelectType = useCallback((code) => {
        setSelectedType(code);
        setSocialUrl(''); // Reset URL when changing selection
        // Focus the input after a short delay to ensure the UI has updated
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    }, []);
    
    // Filter out already connected socials
    const availableSocials = Object.entries(socialIcons)
        .filter(([code]) => !connectedSocials.some(social => social.type === code));
    
    const renderSocialItem = useCallback(({ item }) => {
        const [code, data] = item;
        return (
            <SocialItem
                code={code}
                data={data}
                isSelected={selectedType === code}
                onSelect={handleSelectType}
            />
        );
    }, [selectedType, handleSelectType]);
    
    const keyExtractor = useCallback(([code]) => code, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add Social Link</Text>
                
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Image 
                        source={require('../../../assets/icons/home/close remove-802-1662363936.png')} 
                        style={styles.closeIcon} 
                    />
                </TouchableOpacity>
            </View>
            
            <Text style={styles.subtitle}>
                Choose a social platform to connect to your website
            </Text>
            
            <FlatList
                data={availableSocials}
                renderItem={renderSocialItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.socialsList}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                windowSize={5}
            />
            
            <View style={styles.footer}>
                {selectedType ? (
                    <>
                        <View style={styles.urlInputContainer}>
                            <Text style={styles.urlLabel}>
                                Enter your {socialIcons[selectedType]?.title} profile URL:
                            </Text>
                            <BottomSheetTextInput
                                ref={inputRef}
                                style={styles.urlInput}
                                placeholder="https://"
                                value={socialUrl}
                                onChangeText={setSocialUrl}
                                autoCapitalize="none"
                                keyboardType="url"
                                autoFocus={true}
                            />
                        </View>
                        
                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                !socialUrl && styles.addButtonDisabled
                            ]}
                            onPress={handleAdd}
                            disabled={!socialUrl}
                        >
                            <Text style={[
                                styles.addButtonText,
                                !socialUrl && styles.addButtonTextDisabled
                            ]}>
                                Add Social Link
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.selectPrompt}>
                        Select a social platform to continue
                    </Text>
                )}
            </View>
        </View>
    );
};

// Then wrap it with memo
const AddSocialSheet = React.memo(AddSocialSheetComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '300',
        color: '#000',
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '300',
        color: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    socialsList: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    socialItem: {
        width: '33.33%',
        padding: 8,
    },
    selectedSocialItem: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
    },
    socialContent: {
        alignItems: 'center',
        padding: 8,
    },
    socialIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedSocialIconContainer: {
        borderWidth: 2,
        borderColor: '#000',
    },
    socialIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    socialName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    selectedSocialName: {
        fontWeight: '700',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        marginTop: 'auto',
    },
    urlInputContainer: {
        marginBottom: 16,
    },
    urlLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
    },
    urlInput: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    addButtonTextDisabled: {
        color: 'rgba(0,0,0,0.4)',
    },
    selectPrompt: {
        textAlign: 'center',
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        fontStyle: 'italic',
    },
});

export default AddSocialSheet; 