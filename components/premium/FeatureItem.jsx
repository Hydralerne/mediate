import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import createStyles from '../../utils/globalStyle';

const FeatureItem = ({ feature, index, fadeAnim, slideAnim }) => (
    <Animated.View
        style={[
            styles.featureItem,
            {
                opacity: fadeAnim,
                transform: [{
                    translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 5)],
                    })
                }]
            }
        ]}
    >
        <Image source={feature.icon} style={styles.featureIcon} />
        <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
        <Image source={require('@/assets/icons/check circle-3-1660219236.png')} style={styles.rightIcon} />
    </Animated.View>
);

const styles = createStyles({
    featureIcon: {
        tintColor: '#fff',
        width: 24,
        height: 24,
        marginRight: 16,
    },
    rightIcon: {
        tintColor: '#fff',
        width: 24,
        height: 24,
        marginLeft: 15
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 1,
        fontFamily: 'main',
    },
    featureDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 18,
        fontFamily: 'main',
        fontWeight: '300'
    },
});

export default FeatureItem; 