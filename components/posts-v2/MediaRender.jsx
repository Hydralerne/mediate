import React, { useState, useEffect, memo } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { player } from '../../hooks/usePlayer';
import MoviesLayout from '../media-pages/MoviesLayout';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';

const MusicLayout = memo(({ data }) => {
    const [loaded, setLoaded] = useState(false)
    const handlePlay = () => {
        player.setPlayer(null)
        player.setPlayer(data)
        setLoaded(true)
    }
    return (
        <TouchableButton onPress={handlePlay}>
            <View style={styles.musicContainer}>
                <Image style={styles.musicPoster} source={{ uri: data?.bimg || data?.posterLarge || data?.poster }} />
                <View style={styles.ArtistsTitleContainer}>
                    <Text style={[styles.songText]} numberOfLines={2}>{data?.nm || data?.title}</Text>
                    <Text style={[styles.songText, styles.songArtist]} numberOfLines={1}>{data?.art || data?.artist}</Text>
                </View>
                <View style={styles.playButton}>
                    <Image style={[styles.playIcon,loaded && {opacity: 0.5}]} source={require('../../assets/icons/posts/loading play-43-1675238649.png')} />
                </View>
            </View>
        </TouchableButton>
    )
})

const DrawingLayout = ({ data }) => {
    const handlePress = () => {
        Alert.alert('Verified Art', 'This art is verified and draw by ONVO board')
    }
    return (
        <View style={styles.drawingContainer}>
            <Image style={styles.drawingImage} source={{ uri: data }} />
            <TouchableButton onPress={handlePress} style={styles.verifyArt}>
                <Image source={require('../../assets/icons/posts/pen ruler-69-1684134779.png')} style={styles.verifyArtIcon} />
            </TouchableButton>
        </View>
    )
}

const MediaRender = ({ type, content, layout }) => {
    switch (type) {
        case 'music':
            return (
                <MusicLayout data={content} />
            )
        case 'movie':
            return (
                <MoviesLayout data={content} />
            )
        case 'draw':
            return (
                <DrawingLayout data={content} />
            )
        default:
            return (
                <View></View>
            )
    }
}

export default React.memo(MediaRender)


const styles = createStyles({
    playIcon: {
        width: 24,
        height: 24,
        tintColor: colors.mainColor
    },
    playButton: {
        position: 'absolute',
        right: 0,
        width: 35,
        height: 35,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    verifyArtIcon: {
        tintColor: colors.mainColor,
        width: 15,
        height: 15,
        // marginRight: 2
    },
    verifyArtText: {
        fontSize: 10,
        color: colors.mainColor
    },
    verifyArt: {
        position: 'absolute',
        backgroundColor: `rgba(${colors.blackRGB},${colors.blackRGB},${colors.blackRGB} / 0.25)`,
        top: 0,
        right: 0,
        marginTop: 8,
        marginRight: 10,
        borderRadius: 15,
        height: 25,
        width: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    musicPoster: {
        width: 75,
        height: 75,
        backgroundColor: colors.lightBorder
    },
    ArtistsTitleContainer: {
        marginLeft: 15,
        flex: 1
    },
    songArtist: {
        opacity: 0.5,
        marginTop: 2
    },
    songText: {
        color: colors.mainColor,
        lineHeight: 20,
        fontSize: 13,
        marginRight: 75,
        fontFamily: 'main'
    },
    drawingContainer: {
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5,
        zIndex: 999
    },
    drawingImage: {
        width: '100%',
        aspectRatio: 2,
        flex: 1,
        resizeMode: 'contain',
    },
    musicContainer: {
        alignItems: 'center',
        marginBottom: 5,
        flexDirection: 'row',
        borderColor: colors.lightBorder,
        borderWidth: 1,
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 5,
        zIndex: 99,
    }
})