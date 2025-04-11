import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Keyboard, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import MainLogView from '../../components/login/MainLogView'
import LogoWord from '../../assets/icons/logo/logo_word.svg';
import createStyles from '../../utils/globalStyle';

const { width } = Dimensions.get('window');

const MainScreen = ({navigation}) => {

    const currentScreen = useRef(0)

    useEffect(() => {
        const handleBackPress = () => {
            if (currentScreen.current > 0) {
                resetToFirstScreen();
                return true;
            }
            return false;
        };

        const backHandlerListener = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress
        );

        return () => backHandlerListener.remove();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <VideoBack />
                <View style={styles.overlay} />
                <View style={styles.body}>
                    <View style={styles.header}>
                        <LogoWord style={styles.logo} width="80px" height="40px" />
                    </View>
                    <View style={[styles.middleContainer, { width }]}>
                        <View style={[styles.mainNavigator]}>
                            <MainLogView navigation={navigation} width={width} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};

const VideoBack = () => {
    // const player = useVideoPlayer(require('../../assets/videos/final.mp4'), player => {
    //     player.loop = true;
    //     player.play();
    //     player.muted = true
    // });

    return (
        <></>
        // <VideoView nativeControls={false} style={styles.video} player={player} allowsFullscreen />
    )
}

const styles = createStyles({
    mainNavigator: {
        height: '100%',
        flexDirection: 'row',
    },
    blurView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: 'rgba(100,100,100 / 0.1)',
        borderTopRightRadius: 75
    },
    middleContainer: {
        zIndex: 99,
        position: 'absolute',
        bottom: 0,
    },
    header: {
        zIndex: 99,
        flexDirection: 'row',
        left: 0,
        position: 'absolute',
        top: 0,
        marginTop: 80,
        // marginLeft: 10,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },
    logoSmall: {
        display: 'none',
        position: 'absolute',
        top: 0,
        marginTop: -38,
        marginLeft: -25
    },
    logo: {
        flex: 1,
        position: 'relative',
        marginTop: 15
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '290%',
        height: '100%',
        marginTop: '0%',
        objectFit: 'cover',
        zIndex: 0
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
        backgroundColor: '#000',
        opacity: 0.7
    },
    body: {
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: 9
    },

    blurView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: 'rgba(100,100,100 / 0.1)',
        borderTopRightRadius: 75
    },

})

export default MainScreen;
