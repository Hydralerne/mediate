
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';

import colors from '../../utils/colors';
import React from 'react';
import CheckBox from '../global/CheckBox';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';
import { useNavigation } from '@react-navigation/native';

const InputFooter = ({ replyText, style, isAnon, setIsAnon, hideAnon }) => {
    const t = useTranslation()
    const navigation = useNavigation()
    const makeSoon = () => {
        Alert.alert(t('leftMenu.alerts.soon.title'),t('leftMenu.alerts.soon.moreSoon'))
    }
    return (
        <View style={[styles.mainFooter, style]}>
            <View style={styles.characterCount}>
                <Text style={[
                    styles.characterCountText,
                    replyText.length > 950 && styles.characterCountWarning,
                    replyText.length === 1000 && styles.characterCountLimit
                ]}>
                    {replyText.length}/1000
                </Text>
            </View>
            <View style={styles.IconsInbox}>
                <TouchableButton onPress={() => navigation.navigate('Coder')} style={styles.inboxButton}>
                    <Image style={[styles.inboxIcon, { width: 30, height: 30 }]} source={require('../../assets/icons/home/code-17-1658431404.png')} />
                </TouchableButton>
                <TouchableButton onPress={makeSoon} style={styles.inboxButton}>
                    <Image style={styles.inboxIcon} source={require('../../assets/icons/home/image-211-1658434699.png')} />
                </TouchableButton>
                <TouchableButton onPress={makeSoon} style={styles.inboxButton}>
                    <Image style={styles.inboxIcon} source={require('../../assets/icons/home/setting-40-1662364403.png')} />
                </TouchableButton>
                <View style={styles.woler} />

                {!hideAnon && <>
                    <TouchableButton onPress={() => setIsAnon(!isAnon)}>
                        <View style={styles.inboxButton}>
                            <Image style={[styles.inboxIcon, !isAnon && { tintColor: colors.mainSecound }]} source={require('../../assets/icons/home/incognito-40-1691989601.png')} />
                        </View>
                    </TouchableButton>
                    <View style={styles.anonShit}>
                        <CheckBox
                            checked={isAnon}
                            onPress={() => setIsAnon(!isAnon)}
                            color={colors.main}
                        />
                    </View>
                </>
                }
            </View>
        </View>
    )
}

const styles = createStyles({
    woler: {
        width: 1,
        height: 20,
        marginHorizontal: 5,
        backgroundColor: colors.lightBorder
    },
    anonShit: {
        flexDirection: 'row'
    },
    setAnon: {
        color: colors.mainColor,
        marginLeft: 10,
        marginTop: 5
    },
    mainFooter: {
        justifyContent: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderTopWidth: 0.5,
        borderTopColor: colors.lightBorder,
    },

    characterCount: {
        alignSelf: 'flex-end',
    },

    characterCountText: {
        color: colors.mainSecound,
        fontSize: 13,
        fontFamily: 'main'
    },

    characterCountWarning: {
        color: '#FFD700',
    },

    characterCountLimit: {
        color: '#FF4444',
    },

    IconsInbox: {
        flexDirection: 'row',
        position: 'absolute',
        marginLeft: 5,
        flex: 1,
        alignItems: 'center',
    },

    inboxButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginLeft: 5,
    },
    inboxIcon: {
        tintColor: colors.main,
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
});

export default React.memo(InputFooter)