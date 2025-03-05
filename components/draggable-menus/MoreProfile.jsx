import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../utils/colors';
import TouchableButton from '../global/ButtonTap';
import createStyles from '../../utils/globalStyle';

const MoreProfile = ({ id, controller, title }) => {

    const handlePress = (type) => {
        global.DraggableMenuController.close()
        controller[type](id)
    }

    let items = [
        { icon: require('../../assets/icons/posts/Share_uW5tAxkk9km3moG6kJ9dM875oyD8p7Of2RF8.png'), title: 'Share profile', action: 'share' },
        { icon: require('../../assets/icons/posts/error triangle-19-1662452248.png'), title: 'Report '+title, action: 'report' },
        { icon: require('../../assets/icons/posts/forbidden sign-48-1658435663.png'), title: 'Block '+title, action: 'block' }
    ]

    return (
        <View style={styles.shareContainer}>
            {items.map((item, index) => {
                return (
                    <TouchableButton
                        key={index}
                        onPress={() => handlePress(item.action)}
                    >
                        <View style={styles.button}>
                            <Image source={item.icon} style={[styles.icon, item.style]} />
                            <Text style={styles.buttonText}>{item.title}</Text>
                        </View>
                    </TouchableButton>
                );
            })}
            <TouchableButton onPress={global.DraggableMenuController.close} style={styles.cancelBtn}>
                <Text style={styles.textCancel}>Cancel</Text>
            </TouchableButton>
        </View>
    );
}
const styles = createStyles({
    cancelBtn: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        borderRadius: 50,
        marginTop: 20
    },
    textCancel: {
        color: colors.mainColor
    },
    icon: {
        tintColor: colors.mainColor,
        width: 26,
        height: 26,
        marginRight: 15,
        opacity: 0.5
    },
    button: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        marginBottom: 5
    },
    buttonText: {
        color: colors.mainColor,
        fontSize: 16,
        fontFamily: 'main'
    },
    shareContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 50,
        zIndex: 99
    }
})

export default memo(MoreProfile)