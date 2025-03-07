import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const FloatingAddButton = ({ onPress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const animation = React.useRef(new Animated.Value(0)).current;
    
    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        
        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();
        
        setIsOpen(!isOpen);
    };
    
    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                }),
            },
        ],
    };
    
    const sectionButtonStyle = {
        transform: [
            { scale: animation },
            { translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
            })},
        ],
        opacity: animation,
    };
    
    const contentButtonStyle = {
        transform: [
            { scale: animation },
            { translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -120],
            })},
        ],
        opacity: animation,
    };
    
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.menuButton, contentButtonStyle]}>
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => {
                        toggleMenu();
                        onPress('content');
                    }}
                >
                    <Image 
                        source={require('../../../assets/icons/home/plus 4-12-1662493809.png')}
                        style={styles.buttonIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.buttonText}>Add Content</Text>
                </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={[styles.menuButton, sectionButtonStyle]}>
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => {
                        toggleMenu();
                        onPress('section');
                    }}
                >
                    <Image 
                        source={require('../../../assets/icons/home/plus 4-12-1662493809.png')}
                        style={styles.buttonIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.buttonText}>Add Section</Text>
                </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
                style={styles.button}
                onPress={toggleMenu}
                activeOpacity={0.8}
            >
                <Animated.View style={rotation}>
                    <Image 
                        source={require('../../../assets/icons/home/plus 4-12-1662493809.png')}
                        style={styles.mainButtonIcon}
                        resizeMode="contain"
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
    },
    menuButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        flexDirection: 'row',
    },
    secondaryButton: {
        width: 'auto',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    mainButtonIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    buttonIcon: {
        width: 16,
        height: 16,
        tintColor: '#000',
        marginRight: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
});

export default FloatingAddButton; 