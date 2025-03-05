import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { View, Image, Text, ActivityIndicator, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { getData, filter, getVideoId } from '@hydralerne/youtube-api';
import createStyles from '../../utils/globalStyle';
import { Audio } from 'expo-av';
import { player } from '../../hooks/usePlayer';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';

const Player = memo(({ data }) => {
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const sliderValueRef = useRef(0);
    const soundRef = useRef(null)

    const requestSound = async ({ api, id, title, artist }) => {
        if (api !== 'youtube' || !id) {
            id = await getVideoId(`${title} ${artist}`);
        }
        const formats = await getData(id);
        let options = {};
        if (Platform.OS === 'ios') {
            options.codec = 'mp4a';
        }
        const audio = filter(formats, 'bestaudio', options);
        return { ...audio, id };
    };

    const cleanupSound = async () => {
        try {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
        } catch (e) {
            console.log(e)
        }
    };

    const loadSound = async (data, isPlay) => {
        try {
            if (loading) return;
            if (soundRef.current) {
                await cleanupSound();
            }
            setLoading(true);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: false,
            });
    
            const { url } = await requestSound(data);
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            setLoading(false);
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setDuration(status.durationMillis || 0);
                    // Update the slider value ref
                    sliderValueRef.current = status.positionMillis || 0;
                    setIsPlaying(status.isPlaying);
                }
            });

            if (isPlay) {
                await play();
            }
        } catch (error) {
            console.error('Error loading sound:', error);
        }
    };

    const play = async () => {
        if (loading || !soundRef.current) return;
        await soundRef.current.playAsync();
        setIsPlaying(true);
    };

    const pause = async () => {
        if (loading || !soundRef.current) return;
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
    };

    const togglePlay = async () => {
        if (player.isPlaying || isPlaying) {
            await pause();
            setIsPlaying(false);
            player.isPlaying = false;
        } else {
            await play();
            setIsPlaying(true);
            player.isPlaying = true;
        }
    };

    const onSeek = useCallback(async (value) => {
        if (soundRef.current) {
            await soundRef.current.setPositionAsync(value);
            sliderValueRef.current = value; // Update the slider value ref
        }
    }, []);


    const [sliderValue, setSliderValue] = useState(0); // Local state for the slider value

    useEffect(() => {
        loadSound(data, true);
    }, [data]);

    // Update the local slider value when the ref changes
    useEffect(() => {
        const interval = setInterval(() => {
            setSliderValue(sliderValueRef.current);
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const removePlayer = async () => {
        await cleanupSound();
        player.setPlayer(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.playerIndecator}>
                <Text style={[styles.time, { left: 0 }]}>{formatTime(sliderValue / 1000)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={sliderValue} // Controlled by the local state
                    minimumTrackTintColor={colors.mainColor}
                    maximumTrackTintColor={colors.lightBorderMixed}
                    thumbTintColor="transparent"
                    onSlidingComplete={onSeek}
                    tapToSeek={true}
                />
                <Text style={[styles.time, { right: 0 }]}>{formatTime(duration / 1000)}</Text>
            </View>
            <View style={styles.innerContainer}>
                <Image style={styles.poster} source={{ uri: data.poster }} />
                <View style={styles.titleBox}>
                    <Text numberOfLines={1} style={[styles.title, { marginBottom: 2 }]}>{data.title}</Text>
                    <Text numberOfLines={1} style={styles.artist}>{data.artist}</Text>
                </View>
                <View style={styles.buttons}>
                    <TouchableButton style={[styles.playBtn]}>
                        <Image source={require('../../assets/icons/posts/info menu-42-1661490994.png')} style={[styles.playIcon, { opacity: 0.5, width: 20, height: 20 }]} />
                    </TouchableButton>
                    <TouchableButton style={styles.playBtn} onPress={togglePlay}>
                        {loading ? <ActivityIndicator color={colors.mainColor} size={'small'} /> : (
                            <>
                                <Image source={require('../../assets/icons/home/pause-44-1663075945.png')} style={[styles.playIcon, { opacity: isPlaying ? 1 : 0 }, { position: 'absolute' }]} />
                                <Image source={require('../../assets/icons/home/play right-287-1662481518.png')} style={[styles.playIcon, { opacity: isPlaying ? 0 : 1 }]} />
                            </>
                        )}
                    </TouchableButton>
                    <TouchableButton style={styles.playBtn} onPress={removePlayer}>
                        <Image source={require('../../assets/icons/home/close remove-802-1662363936.png')} style={styles.playIcon} />
                    </TouchableButton>
                </View>
            </View>
        </View>
    );
});


const styles = createStyles({
    container: {
        minHeight: 50,
        width: '100%',
        paddingTop: 12,
        paddingBottom: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    playerIndecator: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        marginTop: Platform.OS == 'android' ? -4 : -18,
    },
    time: {
        color: colors.mainColor,
        fontSize: 12,
        position: 'absolute',
        opacity: 0.5,
        display: 'none',
        fontFamily: 'main'
    },
    slider: {
        height: 10,
        flex: 1,
    },
    poster: {
        width: 45,
        height: 45,
        borderRadius: 10,
    },
    titleBox: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        color: colors.mainColor,
        fontWeight: 'bold',
        marginBottom: 2,
        fontFamily: 'main'
    },
    artist: {
        color: colors.mainColor,
        opacity: 0.5,
        fontFamily: 'main'
    },
    buttons: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    playBtn: {
        width: 35,
        height: 35,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
    },
});

export default memo(Player);