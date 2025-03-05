import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { youtubeMusicSearch } from '@hydralerne/youtube-api'
import MusicItem from './MusicSearchItem'
import { useNavigation } from '@react-navigation/native';
import mediaController from '../../hooks/InboxMediaController'
import { MusicSearchLoader } from '../../loaders/MusicSearchLoader'
import createStyles from '../../utils/globalStyle';

const MusicSearch = ({ text }) => {
    
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            console.log(text)
            try {
                setIsLoading(true)
                const result = await youtubeMusicSearch(text);
                setIsLoading(false)
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [text]);
    const navigation = useNavigation()

    const handleAddOnaction = (data) => {
        mediaController.set({ data, type: 'music' })
        navigation.goBack()
    }

    const renderMusic = React.useCallback(
        ({ item }) => <MusicItem data={item} id={item.id} onAction={handleAddOnaction} />,
        []
    );

    return (
        <View style={styles.container}>
            {isLoading ? <MusicSearchLoader /> :
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => item.id?.toString() || `key-${index}`}
                    renderItem={renderMusic}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentInset={{ top: 20 }}
                    contentOffset={{ y: -20 }}
                />
            }
        </View>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
        height: '100%',
    }
});

export default MusicSearch;
