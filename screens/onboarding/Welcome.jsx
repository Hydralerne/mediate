import { View, Text, StyleSheet } from 'react-native';
import { memo } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import { OptionButton } from './components/OptionButton';
import useOnboarding from './hooks/useOnboarding';
import colors from '../../utils/colors';

const OPTIONS = [
    {
        id: 'personal',
        title: 'Personal Identity',
        description: 'Create your digital presence & personal portfolio',
        icon: require('../../assets/icons/login/user-222-1658436042.png')
    },
    {
        id: 'brand',
        title: 'Brand Identity',
        description: 'Showcase your business or products',
        icon: require('../../assets/icons/home/airtable-47-1693375491.png')
    },
    {
        id: 'creator',
        title: 'Creator Portfolio',
        description: 'Share your work & connect with audience',
        icon: require('../../assets/icons/home/categories-0-1662364403.png')
    },
    {
        id: 'other',
        title: 'Something Else',
        description: 'Have a different idea? Let\'s make it happen',
        icon: require('../../assets/icons/home/sparkling-100-1687505465.png')
    }
];

const Welcome = memo(() => {
    const { selectedOption, setSelectedOption } = useOnboarding();

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Welcome to Oblien</Text>
                <Text style={styles.subtitle}>
                    Let's begin your journey, Tell us what you want to create, and we'll help you build something amazing
                </Text>
            </View>
            <View style={styles.optionsContainer}>
                {OPTIONS.map((option) => (
                    <OptionButton
                        key={option.id}
                        option={option}
                        selected={selectedOption === option.id}
                        onPress={() => setSelectedOption(option.id)}
                    />
                ))}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center',
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
    },
    optionsContainer: {
        gap: 12,
        marginTop: 50,
    },
    
});

export default Welcome; 