import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    Alert
} from 'react-native';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';

const MediaAttachScroller = ({ onPress = {} }) => {
    const t = useTranslation()

    const btns = [
        {
            header: t('profile.box.draw.title'),
            text: t('profile.box.draw.lable'),
            icon: require('../../assets/icons/profile/pen-401-1658238246.png'),
            onPress: Platform.OS == 'android' ? () => {
                Alert.alert(t('leftMenu.alerts.soon.title'), t('leftMenu.alerts.soon.moreSoon'));
                onPress.openBoard();
            } : onPress.draw
        },
        {
            header: t('profile.box.music.title'),
            text: t('profile.box.music.lable'),
            icon: require('../../assets/icons/profile/song notes-317-1658234823.png'),
            onPress: onPress.music
        },
        {
            header: t('profile.box.movie.title'),
            text: t('profile.box.movie.lable'),
            icon: require('../../assets/icons/profile/movie reel-132-1658436130.png'),
            onPress: onPress.movies
        }
    ]
    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            {btns.map(item => (
                <TouchableButton activeOpacity={0.75} onPress={item.onPress} style={styles.btnContainer}>
                    <Image source={item.icon} style={styles.btnIcon} />
                    <View style={styles.gridBtnText}>
                        <Text style={styles.btnTextHeader}>{item.header}</Text>
                        <Text style={styles.btnTextDescription}>{item.text}</Text>
                    </View>
                </TouchableButton>
            )
            )}
        </ScrollView>
    )
}

const styles = createStyles({
    gridBtnText: {
        marginLeft: 15
    },
    btnTextDescription: {
        color: colors.mainColor,
        fontSize: 14,
        opacity: 0.5,
        lineHeight: 18,
        fontFamily: 'main'
    },
    btnTextHeader: {
        color: colors.mainColor,
        marginBottom: 5,
        lineHeight: 18,
        fontFamily: 'main'
    },
    btnContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        backgroundColor: colors.tap
    },
    btnIcon: {
        tintColor: colors.mainColor,
        width: 35,
        height: 35
    },
    container: {
        minHeight: 80,
        flexDirection: 'row',
        backgroundColor: colors.background,
        marginBottom: 20,
        paddingHorizontal: 15
    }
})

export default MediaAttachScroller