import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, InteractionManager } from 'react-native';
import { BlurView } from 'expo-blur';
import { UserContext } from '../../contexts/UserContext';
import colors from '../../utils/colors';
import { sharedRefs } from '../../hooks/Flatlists';
import PlayerBottom from '../player/PlayerBottom'
import createStyles from '../../utils/globalStyle';
import TouchableButton from './ButtonTap';
const isAndroid = Platform.OS === 'android';

const icons = {
    HomeTab: {
        light: require('../../assets/icons/menu-bottom/home-21-1663076191.png'),
        heavy: require('../../assets/icons/menu-bottom/home-83-1658433576.png'),
    },
    DiscoveryTab: {
        light: require('../../assets/icons/menu-bottom/explore 2-20-1666783827.png'),
        heavy: require('../../assets/icons/menu-bottom/explore 2-145-1658435971.png'),
    },
    NotificationsTab: {
        light: require('../../assets/icons/menu-bottom/ringtone-57-1660219237.png'),
        heavy: require('../../assets/icons/menu-bottom/ringtone-122-1658234612.png'),
    },
    SearchTab: {
        light: require('../../assets/icons/menu-bottom/search-1-49-1666688362.png'),
        heavy: require('../../assets/icons/menu-bottom/search-123-1658435124.png'),
    },
    MessagesTab: {
        light: require('../../assets/icons/menu-bottom/email-36-1660810114.png'),
        heavy: require('../../assets/icons/menu-bottom/email-76-1659689482.png'),
    },
};

// Memoized TabItem component to prevent unnecessary re-renders
const TabItem = React.memo(({ route, isFocused, options, handlePress, Icon, HeavyIcon, CountsContainer }) => {
    return (
        <TouchableButton
            onPress={() => handlePress(route, isFocused)}
            style={styles.tabItem}
        >
            <Image
                source={Icon}
                style={[styles.menuIcon, { opacity: isFocused ? 1 : 0 }]}
            />
            <Image
                source={HeavyIcon}
                style={[styles.menuIcon, { opacity: isFocused ? 0 : 1, position: 'absolute' }]}
            />
            <CountsContainer />
        </TouchableButton>
    );
});

export const CustomTabBar = React.memo(({ state, descriptors, navigation }) => {
    const { userData } = useContext(UserContext);
    const [isMsgsCount, setIsMsgsCount] = useState(true);
    const [isNotisCount, setIsNotisCount] = useState(true);
    const [isFocused, setIsFocused] = useState('HomeTab')
    const counts = userData?.data?.counts;

    const handlePress = async (route) => {
        setIsFocused(route.name)

        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (isFocused !== route.name && !event.defaultPrevented) {
            navigation.navigate(route.name);
            if (route.name !== 'HomeTab') {
                return
            }
        }

        if (route.name === 'MessagesTab') {
            setIsMsgsCount(false);
        }
        if (route.name === 'NotificationsTab') {
            setIsNotisCount(false);
        }

        if (isFocused === 'HomeTab') {
            InteractionManager.runAfterInteractions(() => {
                sharedRefs.homeFlatListRef?.current?.scrollToOffset({
                    offset: 0,
                    animated: true,
                });
            });
        }

    }


    return (
        <View style={styles.tabBarContainer}>
            {!isAndroid && (
                <BlurView
                    intensity={35}
                    tint={colors.blurTint}
                    experimentalBlurMethod
                    style={styles.menuBlur}
                />
            )}
            <PlayerBottom />
            <View style={styles.innerTabBarContainer}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const { light: Icon, heavy: HeavyIcon } = icons[route.name] || icons.HomeTab;
                    let CountsContainer = () => null;

                    if (route.name === 'NotificationsTab' && counts?.notifications > 0 && isNotisCount) {
                        CountsContainer = () => (
                            <View style={styles.countsContiner}>
                                <Text style={styles.countsText}>{counts?.notifications}</Text>
                            </View>
                        );
                    }

                    if (route.name === 'MessagesTab' && counts?.messages > 0 && isMsgsCount) {
                        CountsContainer = () => (
                            <View style={styles.countsContiner}>
                                <Text style={styles.countsText}>{counts?.messages}</Text>
                            </View>
                        );
                    }

                    return (
                        <TabItem
                            key={index}
                            route={route}
                            isFocused={route.name == isFocused}
                            options={options}
                            handlePress={handlePress}
                            Icon={Icon}
                            HeavyIcon={HeavyIcon}
                            CountsContainer={CountsContainer}
                        />
                    );
                })}
            </View>
        </View>
    );
});

const styles = createStyles({
    countsContiner: {
        position: 'absolute',
        backgroundColor: colors.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        paddingHorizontal: 4,
        paddingVertical: 2,
        transform: [{ translateX: 10 }, { translateY: -8 }],
    },
    countsText: {
        color: '#fff',
        fontSize: 11,
        marginTop: -1,
        fontFamily: 'main'
    },
    menuBlur: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flex: 1,
    },
    tabBarContainer: {
        position: 'absolute',
        width: '100%',
        backgroundColor: isAndroid ? colors.background : `rgba(${colors.blackRGB}, ${colors.blackRGB}, ${colors.blackRGB}, 0.75)`,
        minHeight: isAndroid ? 50 : 60,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
    },
    innerTabBarContainer: {
        borderTopWidth: 0.5,
        borderColor: isAndroid ? `rgba(${colors.whiteRGB}, ${colors.whiteRGB}, ${colors.whiteRGB}, 0.2)` : `rgba(${colors.whiteRGB}, ${colors.whiteRGB}, ${colors.whiteRGB}, 0.05)`,
        paddingBottom: isAndroid ? 15 : 40,
        paddingTop: isAndroid ? 15 : 10,
        overflow: 'hidden',
        width: '100%',
        flexDirection: 'row',
        right: 0,
        left: 0,
        margin: 'auto',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    menuIcon: {
        width: 26,
        height: 26,
        tintColor: colors.mainColor,
    },
});