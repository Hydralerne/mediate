import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import createStyles from '../../utils/globalStyle';


const MusicItem = ({ data, onAction }) => {
    useEffect(() => {
        console.log(data)
    }, [])


    return (
        <View style={styles.container}>
            <Image source={{ uri: data.poster }} style={styles.poster} />
            <View style={styles.artistTitle}>
                <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">{data.title}</Text>
                <Text style={styles.artistText} numberOfLines={1} ellipsizeMode="tail">{data.artist}</Text>
            </View>
            <TouchableOpacity style={styles.buttonAdd} onPress={() => onAction(data)}>
                <Image style={styles.addIcon} source={require('../../assets/icons/profile/plus 2-10-1662493809.png')} />
            </TouchableOpacity>
        </View>
    );
};

const styles = createStyles({
    poster: {
        resizeMode: 'cover',
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    buttonAdd: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0
    },
    addIcon: {
        tintColor: 'white',
        width: 28,
        height: 28,
    },
    artistTitle: {
        marginLeft: 15
    },
    artistText: {
        color: '#fff',
        opacity: 0.5,
        fontFamily: 'main'
    },
    titleText: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'main'
    },
    container: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 100,
        paddingVertical: 8
    }
});

export default MusicItem;
