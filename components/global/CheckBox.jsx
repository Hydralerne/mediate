import React, { memo, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import TouchableButton from './ButtonTap';

const Checkbox = ({ checked, style, onPress, color = colors.main }) => {
    const indicatorPosition = useRef(new Animated.Value(checked ? 17 : 3)).current;
    const backgroundColorAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

    const backgroundColor = backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.checkBox, color],
    });

    useEffect(() => {
        Animated.parallel([
            Animated.timing(indicatorPosition, {
                toValue: checked ? 17 : 3,
                duration: 100,
                useNativeDriver: false, 
            }),
            Animated.timing(backgroundColorAnim, {
                toValue: checked ? 1 : 0, 
                duration: 100,
                useNativeDriver: false, 
            }),
        ]).start();
    }, [checked]);

    return (
        <TouchableButton onPress={onPress}>
            <Animated.View
                style={[
                    styles.container,
                    style,
                    { backgroundColor }, 
                ]}
            >
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            marginLeft: indicatorPosition,
                        },
                        checked && {opacity: 1}
                    ]}
                />
            </Animated.View>
        </TouchableButton>
    );
};

const styles = createStyles({
    indicator: {
        width: 18,
        height: 18,
        backgroundColor: '#fff',
        borderRadius: 50,
        opacity: colors.blurTint == 'dark' ? 0.5 : 1
    },
    container: {
        width: 38,
        height: 24,
        borderRadius: 50,
        justifyContent: 'center',
    },
});

export default memo(Checkbox);