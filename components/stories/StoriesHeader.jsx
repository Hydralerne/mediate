
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Logo from '../../assets/icons/logo/logo.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';

const StoriesHeader = ({ data, IndicatorStyle, CloseStories, openProfile }) => {
    const insets = useSafeAreaInsets();

    return (
        <Animated.View style={[header.container, { paddingTop: insets.top + 15 }]}>
            <View style={header.linearBack}>
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.75)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={header.gradient}
                />
            </View>
            <Animated.View style={header.indecators}>
                <Animated.View style={[header.indecator, { marginRight: 0 }]}>
                    <Animated.View style={[header.innerIndecator, IndicatorStyle]} />
                </Animated.View>
            </Animated.View>
            <TouchableButton onPress={() => openProfile(data.user.id, data.user)}>
                <View style={header.mainContainer}>
                    <Logo style={header.logo} width="60px" height="100px" />
                    <Image source={{ uri: data?.user?.image }} style={header.userImage} />
                    <View style={header.userInfo}>
                        <View style={header.userNameContainer}>
                            <Text style={header.userFullname}>{data?.user?.fullname}</Text>
                            {data?.date && data?.date?.length > 0 &&
                                <>
                                    <View style={header.dot}></View>
                                    <Text style={header.time}>{data?.date}</Text>
                                </>
                            }
                        </View>
                        <Text style={header.userName}>@{data?.user?.username}</Text>
                    </View>
                    <TouchableButton onPress={CloseStories} style={header.closeButton}>
                        <Image source={require('../../assets/icons/home/close remove-802-1662363936.png')} style={header.closeIcon} />
                    </TouchableButton>
                </View>
            </TouchableButton>
        </Animated.View>
    )
}

const header = createStyles({
    gradient: {
        width: '100%',
        height: '100%',
    },
    linearBack: {
        position: 'absolute',
        width: '100%',
        height: 150,
        // backgroundColor: '#555',
        zIndex: 0
    },
    userInfo: {
        marginTop: -2
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    closeIcon: {
        tintColor: 'white',
        width: 28,
        height: 28
    },
    logo: {
        position: 'absolute',
    },
    container: {
        flex: 1,
        zIndex: 999,
        position: 'absolute',
        width: '100%',
    },
    userImage: {
        width: 42,
        height: 42,
        borderRadius: 50,
        marginRight: 10,
        // borderWidth: 2,
        // borderColor: 'rgba(255,255,255 / 0.25)',
        // marginLeft: 35
    },
    mainContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 15,
        alignItems: 'center'
    },
    time: {
        color: colors.mainColor,
        opacity: 0.5,
        marginTop: 2
    },
    userNameContainer: {
        flexDirection: 'row',
        marginBottom: 2,
        fontFamily: 'main'
    },
    userName: {
        color: colors.mainColor,
        fontWeight: 400,
        fontSize: 14,
        // opacity: 0.5
    },
    userFullname: {
        color: colors.mainColor,
        fontWeight: 'bold',
        lineHeight: 20,
        fontSize: 16,
        fontFamily: 'main'
    },
    dot: {
        width: 2.5,
        height: 2.5,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255 / 0.25)',
        marginTop: 10,
        marginRight: 5,
        marginLeft: 5,
    },
    indecators: {
        width: '100%',
        flexDirection: 'row',
        height: 2,
        paddingHorizontal: 15,
    },
    innerIndecator: {
        height: '100%',
        borderRadius: 50,
        backgroundColor: colors.mainColor,
        width: 0,
    },
    indecator: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255, 0.2)',
        width: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 4
    },
});

export default React.memo(StoriesHeader)