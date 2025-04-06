import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavigationOptions = ({ selectedOption, onOptionSelect }) => {
    const options = [
        {
            id: 'topBar',
            label: 'Top Bar',
            icon: 'menu-outline',
            description: 'Traditional navigation bar at the top'
        },
        {
            id: 'bottomBar',
            label: 'Bottom Bar',
            icon: 'apps-outline',
            description: 'Mobile-friendly tab bar at the bottom'
        },
        {
            id: 'hamburger',
            label: 'Hamburger Menu',
            icon: 'menu',
            description: 'Compact menu hidden behind an icon'
        }
    ];

    return (
        <View style={styles.container}>
            {options.map(option => (
                <TouchableOpacity
                    key={option.id}
                    style={[
                        styles.optionCard,
                        selectedOption === option.id && styles.selectedOption
                    ]}
                    onPress={() => onOptionSelect(option.id)}
                >
                    <View style={styles.optionHeader}>
                        <View style={[
                            styles.iconContainer,
                            selectedOption === option.id && styles.selectedIconContainer
                        ]}>
                            <Ionicons
                                name={option.icon}
                                size={20}
                                color={selectedOption === option.id ? '#fff' : '#000'}
                            />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={[
                                styles.optionLabel,
                                selectedOption === option.id && styles.selectedText
                            ]}>
                                {option.label}
                            </Text>
                            <Text style={[
                                styles.optionDescription,
                                selectedOption === option.id && styles.selectedText
                            ]}>
                                {option.description}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    optionCard: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedOption: {
        backgroundColor: '#000',
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    selectedIconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 3,
    },
    optionDescription: {
        fontSize: 13,
        color: '#555',
        lineHeight: 16,
    },
    selectedText: {
        color: '#fff',
    },
});

export default NavigationOptions; 