import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import QRCode from '../../components/web-id/QRCode';
import PageLoader from '../../loaders/PageLoager';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import colors from '../../utils/colors';
import { BlurView } from 'expo-blur';
import TouchableButton from '../../components/global/ButtonTap'

const ID = ({ route, navigation }) => {
    const { userData } = useContext(UserContext)
    const t = useTranslation()
    const [render, setRender] = useState(false)

    const url = `https://onvo.me/${userData.data.username}`

    useEffect(() => {
        setTimeout(() => setRender(true), 10)
    }, [])

    if (!render) {
        return (
            <PageLoader />
        )
    }

    const sections = [
        {
            icon: require('../../assets/icons/id/frame-308-1658237391.png'),
            title: 'Avatar frame',
            lable: 'Change your perview avatar frame'
        },
        {
            icon: require('../../assets/icons/id/broom-220-1658238246.png'),
            title: 'Profile themes',
            lable: 'Change your profile theme'
        },
        {
            icon: require('../../assets/icons/id/ui8-139-1693375584.png'),
            title: 'Customize profile',
            lable: 'Manage your profile secions'
        },
        {
            icon: require('../../assets/icons/id/check badge-66-1658234612.png'),
            title: 'Get verified',
            lable: 'Request Verification for your account'
        },
    ]

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <View style={styles.overlay} />
                <Image source={require('../../assets/images/alo.jpg')} style={styles.image} />
            </View>
            <View style={styles.body}>
          
                <View style={styles.imageUserConatiner}>
                    <Image source={{ uri: userData.data.image?.replace('/profile/', '/profile_large/') }} style={styles.userImage} />
                </View>
                <Text style={styles.header}>Take control over your account</Text>
                <View style={styles.sections}>
                    {sections.map((section, index) => (
                        <View key={index} style={styles.section}>
                            <BlurView tint='dark' style={styles.sectionBlur} intensity={35} />
                            <View style={styles.innerSection}>
                                <Image source={section.icon} style={styles.secionIcon} />
                                <View style={styles.gridIcon}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <Text style={styles.seectionLable}>{section.lable}</Text>
                                </View>
                                <Image source={require('../../assets/icons/settings/chevron right-18-1696832403.png')} style={styles.sectionRight} />
                            </View>
                        </View>
                    ))
                    }
                </View>
                <TouchableButton style={styles.subscribe}>
                    <Image style={styles.subscribeIcon} source={require('../../assets/icons/id/king-137-1658434754.png')} />
                    <Text style={styles.textPlus}>Get full access for 33.99 EGP</Text>
                </TouchableButton>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    backButton: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255 / 0.1)',
        position: 'absolute',
        left: 0,
        marginTop: 100,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subscribeIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 0,
        marginLeft: 20
    },
    header: {
        color: '#fff',
        fontSize: 28,
        fontFamily: 'main',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 32
    },
    subscribe: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 50,
        width: '100%',
        height: 55,
        marginBottom: 40
    },
    sectionRight: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        opacity: 0.5,
        position: 'absolute',
        right: 0,
        marginRight: 20
    },
    gridIcon: {
        marginLeft: 10
    },
    sectionTitle: {
        fontFamily: 'main',
        color: '#fff',
        marginBottom: 4
    },
    seectionLable: {
        fontFamily: 'main',
        color: '#fff',
        opacity: 0.5
    },
    sectionBlur: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255 / 0.15)'
    },
    secionIcon: {
        width: 28,
        height: 28,
        tintColor: '#fff'
    },
    innerSection: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15
    },
    section: {
        height: 80,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    sections: {
        width: '100%',
        height: '100%',
        flex: 1,
        marginTop: 25
    },
    imageUserConatiner: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.mainColor,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        marginTop: 80,
    },
    body: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 20,

    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 40
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        position: 'absolute',
        zIndex: 0
    },
    overlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: 2,
        backgroundColor: 'rgba(0,0,0 / 0.60)',
        position: 'absolute'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        flex: 0
    },
})

export default ID;
