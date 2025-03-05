import React, { useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native'
import colors from '../../utils/colors'

const TabsMenu = ({ tabs = ['Threads', 'Collections', 'Posts'] }) => {
    const [color, setColor] = useState(colors.main)
    const [activeIndex, setActiveIndex] = useState(0)
    const animatedPosition = useRef(new Animated.Value(0)).current
    const buttonRefs = useRef([])

    profileControler.setBottom = setColor

    const handleLayout = (event, index) => {
        if (index === 0) {
            const { x, width } = event.nativeEvent.layout
            animatedPosition.setValue(x + width / 2 - 35)
        }
    }

    const handleButtonPress = (index) => {
        setActiveIndex(index)
        buttonRefs.current[index]?.measure((fx, fy, width, height, px) => {
            const newPosition = px + width / 2 - 35
            Animated.timing(animatedPosition, {
                toValue: newPosition,
                duration: 200,
                useNativeDriver: false
            }).start()
        })
    }

    return (
        <View style={styles.container}>
            {tabs.map((label, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.buttonMenu}
                    onPress={() => handleButtonPress(index)}
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onLayout={(event) => handleLayout(event, index)}
                >
                    <Text
                        style={[
                            styles.textMenu,
                            { opacity: activeIndex === index ? 1 : 0.5 }
                        ]}
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
            <Animated.View
                style={[styles.moving, { backgroundColor: color, left: animatedPosition }]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    moving: {
        position: 'absolute',
        width: 70,
        height: 3,
        bottom: 0,
        borderRadius: 2
    },
    container: {
        width: '100%',
        height: 44,
        borderBottomColor: '#222',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textMenu: {
        color: '#fff',
        fontSize: 15,
    }
})

export default ProfileMenu
