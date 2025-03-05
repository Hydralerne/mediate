import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { getHome } from '@hydralerne/youtube-api'
import { useNavigation } from '@react-navigation/native';
import mediaController from '../../hooks/InboxMediaController'
import { ScrollView } from 'react-native-gesture-handler';
import { MusicHeaderLoader } from '../../loaders/MusicSearchLoader'
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const MusicExploreItem = ({ data, onAction }) => {
    return (
        <View style={musicStyle.header}>
            <View style={musicStyle.textWrapper}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={[musicStyle.titles, { marginBottom: 2, fontSize: 14, opacity: 0.5 }]}>{data.artist}</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={[musicStyle.titles, { fontSize: 16 }]}>{data.title}</Text>
                <TouchableButton style={smallMusic.buttonAdd} onPress={() => onAction(data)}>
                    <Image style={smallMusic.addIcon} source={require('../../assets/icons/profile/plus 2-10-1662493809.png')} />
                </TouchableButton>
            </View>
            <Image style={musicStyle.backMain} source={{ uri: data.posterLarge || data.poster }} />
        </View>
    )
}

const SmallMusicItem = ({ data, onAction }) => {
    return (
        <View style={smallMusic.container}>
            <Image style={smallMusic.poster} source={{ uri: data.poster || data.posterLarge }} />
            <View style={smallMusic.gridZobr}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={smallMusic.titleStyle}>{data.title}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[smallMusic.titleStyle, { opacity: 0.5, marginTop: 4 }]}>{data.artist}</Text>
            </View>
            <TouchableButton style={smallMusic.buttonAdd} onPress={() => onAction(data)}>
                <Image style={smallMusic.addIcon} source={require('../../assets/icons/profile/plus 2-10-1662493809.png')} />
            </TouchableButton>
        </View>
    )
}

const smallMusic = createStyles({
    gridZobr: {
        marginRight: 100
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
        width: 24,
        height: 24,
    },
    poster: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    titleStyle: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'main'
    },
    container: {
        height: 60,
        flexDirection: 'row',
        width: 270,
        alignItems: 'center',

    }
})

const musicStyle = StyleSheet.create({
    titles: {
        color: '#fff'
    },
    textWrapper: {
        zIndex: 9,
        marginBottom: 15,
        paddingRight: 50,
        textAlign: 'left',
    },
    backMain: {
        width: 240,
        height: 180,
        borderRadius: 22,
        resizeMode: 'cover',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    header: {
        width: 240,
        marginRight: 15,
        flex: 1,
        overflow: 'hidden',
    }
})


const MusicExplore = ({ style }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const result = await getHome();
                setIsLoading(false)
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const navigation = useNavigation()

    const handleAddOnaction = (data) => {
        mediaController.set({ data, type: 'music' })
        navigation.goBack()
    }

    const groupDataIntoRows = (data, itemsPerRow) => {
        const rows = [];
        for (let i = 0; i < data.length; i += itemsPerRow) {
            rows.push(data.slice(i, i + itemsPerRow));
        }
        return rows;
    };

    const rows = groupDataIntoRows(data?.picks || [], 4);

    const renderRow = ({ item: row }) => (
        <View style={{ marginRight: 20 }}>
            {row.map((item) => (
                <SmallMusicItem data={item} id={item.id} onAction={handleAddOnaction} />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, style]}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.containerScroller}>
                {(!data?.singles || data?.singles?.length < 1) ? <MusicHeaderLoader /> : data?.singles.map((item, index) => {
                    return <MusicExploreItem data={item} id={item.id} onAction={handleAddOnaction} />
                })}
            </ScrollView>
            {rows?.length > 0 && <Text style={styles.perviewTitle}>Leatest Releases</Text>}
            <FlatList
                data={rows}
                renderItem={renderRow}
                keyExtractor={(row, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginLeft: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    perviewTitle: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 15,
        marginTop: 40,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        paddingLeft: 20,
    },
    containerScroller: {
        marginTop: 20,
        paddingLeft: 20,
        height: 180
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    item: {
        width: 70, // Fixed width for items
        height: 'auto', // Adjust height automatically
        marginBottom: 15, // Vertical gap between rows
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    columnGap: {
        columnGap: 15, // Horizontal gap between columns
    },
    text: {
        fontSize: 14,
    },
});

export default MusicExplore;
