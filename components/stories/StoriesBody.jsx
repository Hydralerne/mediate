import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import PageLoader from '../../loaders/PageLoager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createStyles from '../../utils/globalStyle';
import { runOnJS } from 'react-native-reanimated';
import colors from '../../utils/colors';

const isAndroid = Platform.OS === 'android';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StoriesBody = ({ data, prepare, isActive, resolve = () => { } }) => {

    const [loaded, setLoaded] = useState(false)
    // State to store the calculated image height
    const [imageHeight, setImageHeight] = useState(null);
    // Fetch image dimensions when `prepare`, `isActive`, or `data.media` changes
    useEffect(() => {
        if (prepare || isActive) {
            const imageUrl = data.media;
            Image.getSize(
                imageUrl,
                (width, height) => {
                    try {
                        if(imageHeight) return
                        runOnJS(resolve)();
                    } catch (e) {
                        console.log('asdsadasd')
                    }
                    setImageHeight((SCREEN_WIDTH * height) / width);
                },
                (error) => {
                    console.error('Failed to get image size:', error);
                }
            );
        }
    }, [prepare, isActive, data.media]);

    // Memoize styles to avoid recreating them on every render
    const storyImageStyle = useMemo(() => [styles.storyImage, { height: imageHeight }], [imageHeight]);

    return (
        <View style={styles.container}>
            {imageHeight ? (
                <>
                    <Image
                        style={storyImageStyle}
                        source={{ uri: data.media }}
                    />
                    <View style={styles.storyBackContainer}>
                        {!isAndroid && (
                            <>
                                <BlurView tint="dark" intensity={150} style={styles.storyBackBlur} />
                                <View style={styles.overlay} />
                                <Image
                                    style={styles.storyCover}
                                    source={{ uri: data.media }}
                                    onLoad={() => {
                                        setLoaded(true);
                                    }}
                                />
                            </>
                        )}
                    </View>
                </>
            ) : (
                <PageLoader />
            )}
        </View>
    );
};

const styles = createStyles({
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        opacity: 0.85,
        zIndex: 9,
    },
    container: {
        flex: 1,
    },
    storyImage: {
        width: '100%',
        height: 700,
        top: 0,
        bottom: 0,
        margin: 'auto',
        resizeMode: 'contain',
        borderRadius: 10,
        overflow: 'hidden',
    },
    storyBackContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        position: 'absolute',
        zIndex: -1,
    },
    storyCover: {
        flex: 1,
        resizeMode: 'cover',
        zIndex: 2,
    },
    storyBackBlur: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 9,
    },
});

export default React.memo(StoriesBody);