import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import TMDBLogo from '../../assets/icons/logo/tmdb';
import { useNavigation } from '@react-navigation/native';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const formatNumber = (number) => {
    if (number < 1000) {
        return number?.toString();
    } else if (number < 1000000) {
        return (number / 1000).toFixed(1) + 'K';
    } else if (number < 1000000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else { return (number / 1000000000).toFixed(1) + 'B'; }
}
const formatRuntime = (minutes) => {
    if (!minutes) return; var
        hours = Math.floor(minutes / 60); var remainingMinutes = minutes % 60; var formattedRuntime = ''; if (hours > 0) {
            formattedRuntime += hours + 'hr ';
        }
    if (remainingMinutes > 0) {
        formattedRuntime += remainingMinutes + 'min';
    }
    return formattedRuntime;
}

const MoviesLayout = ({ data }) => {
    const navigation = useNavigation()
    const openMovie = () => {
        navigation.navigate('MoviesModal', { action: 'title', type: data?.type, id: data?.id })
    }
    const imageHeight = ((80 * data?.logo?.height) / data?.logo?.width)
    return (
        <View style={movieStyle.movieContainer}>
            <View style={movieStyle.backOverlay} />
            <Image style={movieStyle.backgroundMovie} source={{ uri: `https://image.tmdb.org/t/p/w1280${data?.background}` }} />
            <View style={movieStyle.logoConatiner}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w342/${data?.logo?.image}` }}
                    style={[movieStyle.backgroundLogo, { height: imageHeight }]}
                />
            </View>
            <View style={movieStyle.body}>
                <View style={movieStyle.movieInnerContainer}>
                    <Image style={movieStyle.moviesPoster} source={{ uri: `https://image.tmdb.org/t/p/w342/${data?.poster}` }} />
                    <View style={movieStyle.movieTextContainer}>
                        <Text numberOfLines={2} style={[movieStyle.movieTitle, movieStyle.movieText]}>{data?.title || data?.name}</Text>
                        <View style={movieStyle.charmsContainer}>
                            <Text style={[movieStyle.charmone, movieStyle.movieText]}>{Math.floor(Math.abs(data?.rate * 10))}%</Text>
                            <View style={movieStyle.dotWrapper} />
                            <Text style={[{ opacity: 0.5 }, movieStyle.movieText]}>({formatNumber(data?.raters)})</Text>
                            <TMDBLogo style={movieStyle.tmdbLogo} width="24px" height="12px" />
                        </View>
                        <View style={movieStyle.timeWrapper}>
                            <Image source={data?.type == 'series' ? require('../../assets/icons/posts/video slides 2-262-1658436129.png') : require('../../assets/icons/posts/clock dash-79-1658435834.png')} style={movieStyle.timeIcon} />
                            <Text style={movieStyle.timeText}>{data?.type == 'series' ? `${data?.episodes_count} Episodes` : formatRuntime(data?.runtime)}</Text>
                        </View>
                    </View>
                </View>
                <View style={movieStyle.footer}>
                    <TouchableButton activeOpacity={0.75} onPress={openMovie} style={movieStyle.detailsButton}>
                        <Text style={movieStyle.moreButton}>View</Text>
                    </TouchableButton>
                    <Text numberOfLines={2} style={movieStyle.footerText}>{data?.overview}</Text>
                </View>
            </View>
        </View>
    )
}

const movieStyle = createStyles({
    detailsButton: {
        height: 35,
        width: 70,
        borderRadius: 50,
        marginTop: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightBorder,
        right: 0,
        marginLeft: 'auto',
        position: 'absolute',
        zIndex: 9
    },
    moreButton: {
        color: colors.mainColor,
        fontFamily: 'main'
    },
    gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    movieContainer: {
        width: '100%',
        minHeight: 175,
        flex: 1,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 5,
        marginTop: 5,
        zIndex: 99,
        borderWidth: 1,
        borderColor: colors.lightBorder
    },
    backOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: `rgba(${colors.blackRGB} ${colors.blackRGB} ${colors.blackRGB} / 0.85)`,
    },
    movieInnerContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    footer: {
        zIndex: 99,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: colors.lightBorder,
        marginTop: 15,
        flexDirection: 'row'
    },
    body: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    footerText: {
        color: colors.mainColor,
        marginTop: 10,
        lineHeight: 18,
        fontSize: 12,
        paddingRight: 80
    },
    backgroundLogo: {
        width: 80,
        position: 'absolute',
        right: 0,
        bottom: 0,
        resizeMode: 'contain',
        marginRight: 20,
        marginBottom: 15
    },
    logoConatiner: {
        position: 'absolute',
        right: 0,
        width: 80,
        height: 80,
        transform: [{ rotate: '-90deg' }],
        alignItems: 'flex-end'
    },
    timeIcon: {
        width: 22,
        height: 22,
        tintColor: colors.mainColor,
        resizeMode: 'contain',
        marginLeft: -2,
        marginRight: 5,
    },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        opacity: 0.5

    },
    timeText: {
        color: colors.mainColor,
        fontFamily: 'main'
    },
    tmdbLogo: {
        marginLeft: 6
    },
    dotWrapper: {
        width: 3,
        height: 3,
        borderRadius: 50,
        backgroundColor: colors.mainColor,
        marginHorizontal: 6,
        opacity: 0.35
    },
    backgroundMovie: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1
    },
    movieTitle: {
        marginTop: 10,
        paddingRight: 100,
        fontFamily: 'main',
    },
    movieText: {
        color: colors.mainColor,
        fontFamily: 'main'
    },
    movieTextContainer: {
        flex: 0,
        marginLeft: 15,
    },
    charmsContainer: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    movieStory: {
        fontSize: 12,
        marginTop: 8,
        marginBottom: 15
    },
    moviesPoster: {
        width: 60,
        height: 90,
        borderRadius: 10,
        resizeMode: 'cover',
        alignContent: 'center',
        backgroundColor: colors.lightBorder
        // marginTop: 15,
    },
})


export default React.memo(MoviesLayout)