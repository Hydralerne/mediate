import React, { memo, useCallback } from 'react';
import { Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const TouchableButton = ({ onPress, children, style, ...props }) => {
    if (Platform.OS == 'android') {
        const tapGesture = useCallback(
            Gesture.Tap().onStart(() => {
                if (props.onPressIn) {
                    runOnJS(props.onPressIn)();
                }
            }).onEnd(() => {
                if (props.onPressOut) {
                    runOnJS(props.onPressOut)();
                }
                if (onPress && !props.disabled) {
                    runOnJS(onPress)();
                }
            }),
            [onPress, props.onPressIn, props.onPressOut]
        );
        return (
            <GestureDetector gesture={tapGesture}>
                {style ? <View collapsable={false} style={style}>{children}</View> : children}
            </GestureDetector>
        );
    } else {
        return style ?
            (
                <TouchableOpacity {...props} onPress={onPress} style={style}>{children}</TouchableOpacity>
            )
            :
            (
                <TouchableWithoutFeedback onPress={onPress} {...props}>{children}</TouchableWithoutFeedback>
            );
    }
};

export default memo(TouchableButton);
