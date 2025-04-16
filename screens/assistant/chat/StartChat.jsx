import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { GradientBorder } from '../../../components/global/GradientBorder';

const StartChat = ({ onSendMessage }) => {
    const fullPlaceholder = 'Describe a website to build...';

    const [placeholder, setPlaceholder] = useState(fullPlaceholder);
    const textInputRef = useRef(null);

    const [inputText, setInputText] = useState('');

    // One-time typing animation with initial delay
    useEffect(() => {
        // Add delay before starting animation
        let currentIndex = 0;
        const animationInterval = setInterval(() => {
            if (currentIndex <= fullPlaceholder.length) {
                setPlaceholder(fullPlaceholder.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(animationInterval);
            }
        }, 20);

        return () => clearInterval(animationInterval);

    }, []);

    return (
        <View style={styles.container}>
            <GradientBorder
                style={{ marginHorizontal: 8 }}
                radius={18}
                borderWidth={2.5}
                // colors={['#4B7BFF', '#f8b2af', '#fff', '#FF4B81', '#4B7BFF', '#ff4a36', '#FF4B81']}
                backgroundColor='rgba(0, 0, 0, 1)'
            />
            <View style={styles.chatBox}>
                <View style={styles.chatBoxContainer}>
                    <TextInput
                        ref={textInputRef}
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        multiline={true}
                        fontSize={16}
                        color='white'
                        value={inputText}
                        onChangeText={setInputText}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.leftButtonContainer}>
                        <TouchableOpacity style={styles.button}>
                            <Image source={require('../../../assets/icons/home/attach-1-1662364367.png')} style={styles.buttonImage} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            console.log('pencil');
                        }}>
                            <Image source={require('../../../assets/icons/home/pencil-421-1658238246.png')} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            onSendMessage(inputText);
                        }}>
                            <Image source={require('../../../assets/icons/home/send message-92-1660809844.png')} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        padding: 2,
        width: '100%',
        position: 'relative',
        paddingHorizontal: 6,
    },
    chatBox: {
        paddingVertical: 15,
        paddingBottom: 0,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 'auto',
        bottom: 0,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonImage: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    chatBoxContainer: {
        paddingHorizontal: 25,
    },
    input: {
        color: '#fff',
        minHeight: 70,
        textAlignVertical: 'top',
    },
    leftButtonContainer: {
        flexDirection: 'row',
        gap: 0,
        marginRight: 'auto',
        opacity: 0.5,
        // marginLeft: 5,
    },
    rightButtonContainer: {
        flexDirection: 'row',
    },
});

export default StartChat;
