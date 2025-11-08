import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const PlanOption = ({ planType, price, originalPrice, discount, isSelected, onPlanSelect, pricing }) => (
    <View style={styles.planWrapper}>
        {planType === 'yearly' && (
            <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>
        )}

        <TouchableButton
            onPress={() => onPlanSelect(planType)}
            style={[styles.planOption, isSelected && styles.selectedPlanOption]}
            activeOpacity={0.8}
        >
            {Platform.OS === 'ios' ? <BlurView tint="light" experimentalBlurMethod='dimezisBlurView' intensity={25} style={styles.planBlur} /> : <View style={styles.planBlurAndroid} />}
            <View style={styles.planContent}>
                <View style={styles.planLeft}>
                    <Text style={styles.planTitle}>
                        {planType === 'monthly' ? 'Monthly' : 'Yearly'}
                    </Text>
                    <Text style={styles.billingCycle}>
                        {planType === 'monthly' ? 'billed monthly' : 'billed annually'}
                    </Text>
                    {planType === 'yearly' && (
                        <View style={styles.saveBadge}>
                            <Text style={styles.saveText}>Save {discount}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.planRight}>
                    <View style={styles.priceSection}>
                        <Text style={styles.currentPrice}>
                            {pricing.symbol}{price}
                        </Text>
                        {planType === 'yearly' && (
                            <Text style={styles.crossedPrice}>
                                {pricing.symbol}{originalPrice}
                            </Text>
                        )}
                    </View>

                    {isSelected ? (
                        <Image source={require('@/assets/icons/check circle-3-1660219236.png')} style={styles.tickIcon} />
                    ) : (
                        <View style={styles.unselectedIndicator}>
                            <View style={styles.radioButton} />
                        </View>
                    )}
                </View>
            </View>
        </TouchableButton>
    </View>
);

const styles = createStyles({
    tickIcon: {
        tintColor: '#fff',
        width: 24,
        height: 24,
    },
    planWrapper: {
        position: 'relative',
        paddingTop: 12,
    },
    planBlurAndroid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(25, 25, 25, 0.75)',
        width: '100%',
        height: '100%',
    },
    bestValueBadge: {
        position: 'absolute',
        top: 0,
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bestValueText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#000',
        fontFamily: 'main',
        letterSpacing: 0.5,
    },
    planOption: {
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
    },
    selectedPlanOption: {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 2,
    },
    planBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
    },
    planContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    planLeft: {
        flex: 1,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        fontFamily: 'main',
    },
    billingCycle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        fontFamily: 'main',
    },
    saveBadge: {
        backgroundColor: 'rgba(0, 230, 118, 0.9)',
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
    },
    saveText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'main',
    },
    planRight: {
        alignItems: 'flex-end',
    },
    priceSection: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    currentPrice: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'main',
    },
    crossedPrice: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        textDecorationLine: 'line-through',
        fontFamily: 'main',
    },
    unselectedIndicator: {
        // Radio button when not selected
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
});

export default PlanOption; 