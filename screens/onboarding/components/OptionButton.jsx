import { View, Text, Image, StyleSheet } from 'react-native';
import TouchableButton from '../../../components/global/ButtonTap';
import { GradientBorder } from './GradientBorder';
import colors from '../../../utils/colors';

export const OptionButton = ({ option, selected, onPress }) => {
    return (
        <View style={styles.optionWrapper}>
            <GradientBorder selected={selected} />
            <TouchableButton onPress={onPress}>
                <View style={[styles.optionButton, selected && styles.selectedOption]}>
                    <Image 
                        source={option.icon} 
                        style={[styles.optionIcon, selected && styles.selectedIcon]} 
                    />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>{option.title}</Text>
                        <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                </View>
            </TouchableButton>
        </View>
    );
};

const styles = StyleSheet.create({
    optionWrapper: {
        position: 'relative',
        borderRadius: 12,
        padding: 2,
    },
    optionButton: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    selectedOption: {
        backgroundColor: '#fff',
    },
    optionIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginRight: 16,
        tintColor: '#666',
    },
    selectedIcon: {
        tintColor: '#4B7BFF',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 4,
    },
    optionDescription: {
        color: '#666',
        fontSize: 13,
        fontWeight: '300',
    },
}); 