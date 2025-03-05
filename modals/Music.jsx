import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, Image, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MusicSearch from '../components/media-pages/MusicSearch';
import MusicExplore from '../components/media-pages/MusicExplore'
import Logo from '../assets/icons/logo/airwave.svg';
import TouchableButton from '../components/global/ButtonTap';

const MusicPage = ({ route, navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [debouncedText, setDebouncedText] = useState('');
    const [isMounted, setIsMounted] = useState(false)
    const timeoutRef = useRef(null);

    const handleSearchChange = (text) => {
        setSearchText(text);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedText(text);
        }, 200);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true)
        }, 50)
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!isMounted) {
        return (<View style={styles.container}></View>)
    }
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.backMain} source={require('../assets/images/discovery.png')}>
                <View style={styles.backMain}>
                    <LinearGradient
                        colors={['transparent', 'black']}
                        locations={[0, 1]}
                        style={styles.backGradient}
                    ></LinearGradient>
                    <View style={styles.blackInner}></View>
                    <View style={styles.blackInnerAll}></View>
                </View>
                <View style={[styles.headerContainer, Platform.OS == 'android' && { marginTop: 25 }]}>
                    <View style={styles.logoHeader}>
                        <Logo style={styles.logo} width="35px" height="35px" />
                        <Text style={styles.logoText}>Send Music</Text>
                    </View>
                    <TouchableButton activeOpacity={0.75} onPress={navigation.goBack} style={styles.closeButton}>
                        <Image style={styles.closeIcon} source={require('../assets/icons/home/close remove-802-1662363936.png')} />
                    </TouchableButton>
                </View>
                <View style={styles.mainContainer}>
                    <View style={[styles.innerMainConatiner, debouncedText.length > 0 && { minHeight: '100%' }]}>
                        <View style={styles.inputContainer}>
                            <Image source={require('../assets/icons/menu-bottom/search-123-1658435124.png')} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for song or track"
                                placeholderTextColor="#666"
                                onChangeText={handleSearchChange}
                                value={searchText}
                            />
                        </View>
                        {debouncedText.length > 0 && <MusicSearch text={debouncedText} />}
                    </View>
                    <MusicExplore style={debouncedText.length > 0 && { display: 'none' }} />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 100,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 999,
        paddingTop: 20
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        marginLeft: 'auto'
    },
    closeIcon: {
        tintColor: 'white',
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    logo: {
        width: 30,
        height: 30
    },
    logoText: {
        color: '#fff',
        fontFamily: 'basis-bold',
        fontSize: 26,
        marginLeft: 15
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchIcon: {
        tintColor: 'white',
        width: 24,
        height: 24,
        resizeMode: 'contain',
        position: 'absolute',
        marginLeft: 15,
        opacity: 0.5,
    },
    searchInput: {
        color: '#fff',
        textAlign: 'left',
        marginTop: -2,
        fontSize: 14,
        lineHeight: 18,
        zIndex: 99,
        flex: 1,
    },
    inputContainer: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'left',
        paddingLeft: 50,
        flexDirection: 'row',
    },
    innerMainConatiner: {
        paddingHorizontal: 20,
        height: 'auto',
        width: '100%',
    },
    mainContainer: {
        zIndex: 999,
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#222',
    },
    backGradient: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        zIndex: 9,
    },
    blackInner: {
        position: 'absolute',
        width: '100%',
        height: '52%',
        top: '50%',
        backgroundColor: '#000000',
        zIndex: 99,
    },
    blackInnerAll: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#000000',
        zIndex: 999,
        opacity: 0.25
    },
    backMain: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});

export default MusicPage;