import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, withTiming } from 'react-native-reanimated';
import colors from '../../utils/colors';
import ProfileController from '../../hooks/ProfileColorControler';
import createStyles from '../../utils/globalStyle';
import TouchableButton from './ButtonTap'
// import { TouchableOpacity } from 'react-native-gesture-handler';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TabBar = ({ tabs, swipeX, viewWidth = SCREEN_WIDTH, style }) => {
    const [color, setColor] = useState('transparent');
    ProfileController.setBottom = setColor;

    const buttonRefs = useRef([]);
    const animatedPosition = useSharedValue(0);

    const handleLayout = (event, index) => {
        if (index === 0) {
            const { x, width } = event.nativeEvent.layout;
            animatedPosition.value = x + width / 2 - 35;
            setTimeout(() => {
                setColor(colors.main);
            }, 100);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: swipeX.value / tabs.length }],
    }));

    const textOpacityStyles = tabs.map((_, index) => {
        return useAnimatedStyle(() => {
            const tabPosition = index * viewWidth;
            const opacity = interpolate(
                swipeX.value,
                [tabPosition - viewWidth, tabPosition, tabPosition + viewWidth],
                [0.5, 1, 0.5],
                'clamp'
            );

            return {
                opacity,
            };
        });
    });

    return (
        <View style={[styles.container, style]}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.buttonMenu}
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onLayout={(event) => handleLayout(event, index)}
                    onPress={() => {
                        swipeX.value = withTiming(index * viewWidth, { duration: 200 });
                        if (tab.onTap) {
                            tab.onTap()
                        }
                    }}
                >
                    <Animated.Text
                        style={[
                            styles.textMenu,
                            textOpacityStyles[index],
                        ]}
                    >
                        {tab.title}
                    </Animated.Text>
                </TouchableOpacity>
            ))}
            <Animated.View
                style={[styles.moving, { backgroundColor: color, left: animatedPosition.value }, animatedStyle]}
            />
        </View>
    );
};

const styles = createStyles({
    moving: {
        position: 'absolute',
        width: 70,
        height: 3,
        bottom: 0,
        borderRadius: 2,
    },
    container: {
        width: '100%',
        height: 44,
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 1
    },
    textMenu: {
        color: colors.mainColor,
        fontSize: 15,
        flexShrink: 1,
        flex: 1,
        position: 'absolute',
        fontFamily: 'main'
    },
});

export default React.memo(TabBar);