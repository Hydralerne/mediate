import React, { useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Image, Platform, Alert } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import StoriesFetch from '../stories/StoriesFetch';
import { BlurView } from 'expo-blur';
import { sharedMenuHandler } from '../../hooks/useMenuHandler';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';
import LogoWord from '../global/LogoWord';

const isAndroid = Platform.OS === 'android';

const HomeHeader = ({ tabs, activeTab, setActiveTab, swipeX, viewWidth, scrollY }) => {
    const t = useTranslation();
    const { userData } = useContext(UserContext);

    const filterHome = () => {
        Alert.alert(t('leftMenu.alerts.soon.title'), t('leftMenu.alerts.soon.filtering'));
    };

    return (
        <Animated.View style={[styles.main, { transform: [{ translateY: scrollY }] }]}>
            {!isAndroid && <BlurView intensity={35} tint={colors.blurTint} style={styles.blurHeader} />}
            <View style={styles.innerMain}>
                <TouchableButton onPress={sharedMenuHandler.openMenu} style={styles.UserImageButton}>
                    <Image source={{ uri: userData?.data?.image }} style={styles.userImage} />
                </TouchableButton>
                <View style={styles.logoWrapper}>
                    <LogoWord style={[styles.logo,{marginTop: 0}]} width="70px" height="100px" color={colors.mainColor} />
                </View>
                <TouchableButton onPress={filterHome} style={styles.filterButton}>
                    <Image source={require('../../assets/icons/home/filter-25-1662364403.png')} style={styles.filterIcon} />
                </TouchableButton>
                {/* <TabBar style={styles.tabBar} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} swipeX={swipeX} viewWidth={viewWidth} /> */}
                <StoriesFetch style={{marginTop: 85}} />
            </View>
        </Animated.View>
    );
};

const styles = createStyles({
    filterButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        right: 0,
        marginTop: 54,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        zIndex: 99
    },
    filterIcon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    tabBar: {
        position: 'relative',
        marginTop: 65,
        flex: 1,
    },
    UserImageButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 50,
        zIndex: 999,
        marginLeft: 15,
        marginTop: 56,
    },
    blurHeader: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    userImage: {
        resizeMode: 'cover',
        width: 32,
        height: 32,
        backgroundColor: `rgba(${colors.whiteRGB}, ${colors.whiteRGB}, ${colors.whiteRGB}, 0.1)`,
        borderRadius: 50,
        position: 'absolute',
    },
    innerMain: {
        width: '100%',
        height: 'auto',
        paddingTop: 20,
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
        borderColor: `rgba(${colors.whiteRGB}, ${colors.whiteRGB}, ${colors.whiteRGB}, 0.1)`,
    },
    logoWrapper: {
        width: '100%',
        justifyContent: 'center',
        flex: 1,
        height: 'fit-content',
        top: 0,
        position: 'absolute',
        marginTop: 25,
    },
    logo: {
        flex: 1,
        position: 'relative',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
    },
});

export default React.memo(HomeHeader);
