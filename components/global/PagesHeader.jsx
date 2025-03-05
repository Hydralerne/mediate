import React, { useState, useContext, useEffect, useRef, memo } from 'react';
import { View, StyleSheet, Text, Image, Platform, Pressable } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { BlurView } from 'expo-blur';
const isAndroid = Platform.OS == 'android'
import { sharedMenuHandler } from '../../hooks/useMenuHandler';
import createStyles from '../../utils/globalStyle';
import TouchableButton from './ButtonTap';
import colors from '../../utils/colors';

const PagesHeader = ({ title, center, contextMenu, navigation, onProfile, isMainStack, contextIcon, components, style, innerStyle }) => {
    const { userData } = useContext(UserContext);

    return (
        <View style={[styles.main, style]}>
            {isAndroid ? '' : <BlurView
                intensity={35}
                tint={colors.blurTint}
                style={styles.blurHeader}
            >
            </BlurView>}
            <View style={[styles.innerMain, innerStyle]}>
                {isMainStack || onProfile ?
                    <TouchableButton onPress={onProfile ? onProfile : sharedMenuHandler.openMenu} style={styles.UserImageButton}>
                        <Image source={{ uri: userData?.data?.image }} style={styles.userImage} />
                    </TouchableButton>
                    : <TouchableButton onPress={navigation?.goBack} style={styles.backButton}>
                        <Image style={styles.backIcon} source={require('../../assets/icons/profile/arrow right md-49-1696832059.png')} />
                    </TouchableButton>}
                <View style={styles.centerHeader}>
                    {title && <Text style={styles.titleText}>{title}</Text>}
                    {center}
                </View>
                {contextIcon ? contextIcon : contextMenu && <TouchableButton onPress={contextMenu} style={[styles.backButton, styles.contextMenu]}>
                    <Image style={[styles.backIcon, styles.contextIcon]} source={require('../../assets/icons/profile/info menu-42-1661490994.png')} />
                </TouchableButton>}
            </View>
            {components}
        </View>
    )
}

const styles = createStyles({
    userImage: {
        resizeMode: 'cover',
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 50,
        position: 'absolute',
    },
    UserImageButton: {
        position: 'absolute',
        top: 0,
        marginTop: -4,
        zIndex: 99,
        width: 50,
        height: 50,
        marginLeft: 15,
    },
    titleText: {
        color: colors.mainColor,
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'main'
    },
    centerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        left: 0,
        margin: 'auto',
        width: 'auto',
    },
    contextMenu: {
        left: null,
        right: 0,
        marginLeft: 0,
        marginRight: 15
    },
    backButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        lef: 0,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },
    backIcon: {
        tintColor: colors.mainColor,
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    blurHeader: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    innerMain: {
        width: '100%',
        height: 'auto',
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 60
    },
    main: {
        width: '100%',
        height: 'auto',
        backgroundColor: colors.headerBack,
        overflow: 'hidden',
        backgroundColor: isAndroid ? colors.background : `rgba(${colors.blackRGB}, ${colors.blackRGB}, ${colors.blackRGB}, 0.75)`,
        zIndex: 999,
        position: 'absolute',
        borderBottomWidth: 0.5,
        borderColor: colors.lightBorder,
        minHeight: 100
    }
})

export default memo(PagesHeader)