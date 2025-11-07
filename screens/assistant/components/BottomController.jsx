import { View, TextInput, TouchableOpacity, ActivityIndicator, Platform, StyleSheet, Dimensions, Image, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../utils/colors';
import TintBlur from '../../../components/global/TintBlur'
import Animated, {
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    useSharedValue,
    cancelAnimation,
    Easing,
    interpolate,
    Extrapolate,
    runOnJS
} from 'react-native-reanimated';
import { useEffect, useState, useRef, memo } from 'react';

const { width } = Dimensions.get('window');
import { onSendMessage } from '../chat/utils';

const BottomController = ({
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    textInputRef,
    sendMessageRef,
    flatListRef,
}) => {
    const [chatMode, setChatMode] = useState(false);
    const [inputText, setInputText] = useState('');
    // Animation values
    const pulseValue = useSharedValue(1);
    const micScale = useSharedValue(1);
    const micPosition = useSharedValue(0); // 0 = center, 1 = right
    const inputExpandProgress = useSharedValue(0);
    const recordingOpacity = useSharedValue(0);

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            if (!isKeyboardVisible) setIsKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Handle focus events
    const handleInputFocus = () => {
        if (!chatMode) {
            setChatMode(true);
        }
    };

    const handleInputBlur = () => {
    };

    // Handle recording animation
    useEffect(() => {
        if (isRecording) {
            // Start pulse animation for mic
            pulseValue.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1,
                true
            );
            // Show recording indicator
            recordingOpacity.value = withTiming(1, { duration: 300 });
            // Scale up mic button
            micScale.value = withTiming(1.2, { duration: 300 });
            // Move mic to center if it was on right (chat mode)
            if (chatMode) {
                setChatMode(false);
                micPosition.value = withTiming(0, {
                    duration: 400,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                });
                inputExpandProgress.value = withTiming(0, {
                    duration: 400,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                });
            }
        } else {
            // Stop pulse animation
            cancelAnimation(pulseValue);
            pulseValue.value = withTiming(1);
            // Hide recording indicator
            recordingOpacity.value = withTiming(0, { duration: 300 });
            // Scale mic button back
            micScale.value = withTiming(1, { duration: 300 });
        }
    }, [isRecording]);

    // Handle chat mode animation
    useEffect(() => {
        if (chatMode) {
            // Expand input
            inputExpandProgress.value = withTiming(1, {
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
            // Move mic to right
            micPosition.value = withTiming(1, {
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
        } else {
            // Collapse input
            inputExpandProgress.value = withTiming(0, {
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
            // Move mic back to center if not recording
            if (!isRecording) {
                micPosition.value = withTiming(0, {
                    duration: 400,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                });
            }
        }
    }, [chatMode]);

    // Toggle chat mode
    const toggleChatMode = () => {
        setChatMode(true);
        if (!chatMode) {
            // Focus text input when entering chat mode
            setTimeout(() => {
                textInputRef?.current?.focus();
            }, 400);
        }
    };

    // Handle starting recording
    const handleStartRecording = () => {
        if (chatMode) {
            setChatMode(false);
            // Add small delay before starting recording to allow animations to complete
            setTimeout(() => {
                startRecording();
            }, 300);
        } else {
            startRecording();
        }
    };

    // Animated styles
    const micButtonStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            micPosition.value,
            [0, 1],
            [0, width / 2 - 40],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { scale: micScale.value },
                { translateX }
            ],
        };
    });

    const inputContainerStyle = useAnimatedStyle(() => {
        // Full width minus padding and space for mic (added extra 15px gap)
        const maxWidth = width - 90; // Changed from 100 to 115 to create a gap

        return {
            width: interpolate(
                inputExpandProgress.value,
                [0, 1],
                [48, maxWidth],
                Extrapolate.CLAMP
            ),
            height: 48,
            backgroundColor: colors.secoundBackground,
            borderColor: colors.lightBorder,
            transform: [
                {
                    translateX: interpolate(
                        inputExpandProgress.value,
                        [0, 1],
                        [0, 8],
                        Extrapolate.CLAMP
                    )
                }
            ]
        };
    });

    const chatIconStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                inputExpandProgress.value,
                [0, 0.3],
                [1, 0],
                Extrapolate.CLAMP
            ),
            position: 'absolute',
            left: 0,
            top: 0,
            width: 48,
            height: 48,
            display: inputExpandProgress.value > 0.3 ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
        };
    });

    const textInputStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                inputExpandProgress.value,
                [0.4, 0.8],
                [0, 1],
                Extrapolate.CLAMP
            ),
            flex: 1,
            paddingHorizontal: interpolate(
                inputExpandProgress.value,
                [0.4, 0.8],
                [0, 16],
                Extrapolate.CLAMP
            ),
            // Add right padding to create space from the mic button when expanded
            paddingRight: interpolate(
                inputExpandProgress.value,
                [0, 1],
                [0, 15],
                Extrapolate.CLAMP
            ),
        };
    });

    const settingsButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                inputExpandProgress.value,
                [0, 0.5],
                [1, 0],
                Extrapolate.CLAMP
            ),
        };
    });

    const sendMsg = () => {
        setInputText('')
        sendMessageRef.current(inputText)
        flatListRef.current.scrollToEnd({ animated: true })
    }

    const texting = inputText.trim().length > 0

    return (
        <View style={[styles.container, { paddingHorizontal: chatMode ? 0 : 20, paddingBottom: chatMode && isKeyboardVisible ? 10 : 50 }]}>
            <View style={styles.controlsContainer}>
                {/* Left side with chat button/input */}
                <View style={[
                    styles.leftSide,
                    // Dynamically adjust position based on chat mode
                    { left: chatMode ? 8 : 16 }
                ]}>
                    <Animated.View style={[styles.chatButton, inputContainerStyle]}>
                        {/* Chat icon */}
                        <TouchableOpacity
                            style={styles.chatButtonTouchable}
                            onPress={toggleChatMode}
                            activeOpacity={0.7}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Animated.View style={chatIconStyle}>
                                <Image
                                    source={require('../../../assets/icons/home/messages-274-1658433902.png')}
                                    style={{ width: 24, height: 24, tintColor: '#fff' }}
                                />
                            </Animated.View>
                        </TouchableOpacity>

                        {/* Text input with send button */}
                        <Animated.View style={[styles.textInputContainer, textInputStyle]}>
                            <TextInput
                                ref={textInputRef}
                                style={styles.textInput}
                                placeholder="Type a message..."
                                placeholderTextColor="#999"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={500}
                                editable={!isRecording && !isProcessing}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                        </Animated.View>
                    </Animated.View>
                </View>

                {/* Mic Button (animates between center and right) */}
                <Animated.View style={[styles.micButtonContainer, micButtonStyle]}>
                    <TouchableOpacity
                        style={[
                            styles.micButton,
                            isRecording && styles.recordingButton,
                            isProcessing && styles.processingButton,
                            chatMode && styles.micButtonChat
                        ]}
                        onPress={texting ? sendMsg : (isRecording ? stopRecording : handleStartRecording)}
                        disabled={isProcessing}
                    >
                        {(
                            texting && chatMode ?
                                <Image
                                    source={require('../../../assets/icons/home/send message-92-1660809844.png')}
                                    style={{ width: 24, height: 24, tintColor: '#fff' }}
                                />
                                :
                                <Image
                                    source={isRecording || isProcessing ? require('../../../assets/icons/home/songs wave-101-1663075945.png') : require('../../../assets/icons/home/microphone-38-1663075945.png')}
                                    style={{
                                        width: texting && chatMode ? 24 : 32,
                                        height: texting && chatMode ? 24 : 32,
                                        tintColor: isRecording ? '#000' : '#fff',
                                        opacity: isProcessing ? 0.2 : 1
                                    }}
                                />
                        )}
                    </TouchableOpacity>
                </Animated.View>

                {/* Settings Button (right) */}
                <Animated.View style={[
                    styles.rightButtonContainer,
                    settingsButtonStyle,
                    // Dynamically adjust position based on chat mode to move closer to edge
                    { right: chatMode ? 8 : 16 }
                ]}>
                    <TouchableOpacity style={styles.sideButton}>
                        <Image
                            source={require('../../../assets/icons/home/Gallery_ai_jkN3YHmetpDSDiDnH6icWZtZP2qKn1oNICfG.png')}
                            style={{ width: 24, height: 24, tintColor: '#fff' }}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        paddingHorizontal: 20,
        // height: 125,
        bottom: 0,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 10,
        overflow: 'hidden',
        marginTop: 'auto',
    },
    blur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        position: 'relative',
    },
    leftSide: {
        position: 'absolute',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: 100,
    },
    rightButtonContainer: {
        position: 'absolute',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        zIndex: 10,
    },
    sideButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.secoundBackground,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 100,
    },
    chatButton: {
        borderRadius: 24,
        overflow: 'visible',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 100,
    },
    chatButtonTouchable: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    micButtonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        zIndex: 20,
    },
    micButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.secoundBackground,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    micButtonChat: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    recordingButton: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.4,
    },
    processingButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    textInput: {
        flex: 1,
        color: colors.mainColor,
        fontSize: 14,
        maxHeight: 100,
        paddingVertical: 8,
        fontWeight: '300'
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    recordingIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        marginTop: 10,
    },
    activityIndicator: {
        marginRight: 8,
    },
    recordingText: {
        color: colors.mainColor,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default memo(BottomController);