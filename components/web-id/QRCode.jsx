import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import CustomPieces from '../../components/qr-codes/CustomPieces';
// import CirclePieces from '../../components/qr-codes/CirclePieces';
// import GluedRoundedPieces from '../../components/qr-codes/GluedRoundedPieces';
// import LiquidPieces from '../../components/qr-codes/LiquidPieces';
// import CutCornersPieces from '../../components/qr-codes/CutCornersPieces';
// import RainStyle from '../../components/qr-codes/RainStyle';
// import LinearGradient from '../../components/qr-codes/LinearGradient';
// import CustomEyes from '../../components/qr-codes/CustomEyes';
// import WithLogo from '../../components/qr-codes/WithLogo';
// import WithBackgroundImage from '../../components/qr-codes/WithBackgroundImage';
// import CustomPiecesAndEyes from '../../components/qr-codes/CustomPiecesAndEyes';
import { BlurView } from 'expo-blur';
import { Defs, Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import QRCodeStyled, { SVGGradient } from 'react-native-qrcode-styled';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';

const renderBackground = (pieceSize, matrix) => {
    const size = matrix.length * pieceSize + 50;

    return (
        <>
            <Defs>
                <SVGGradient
                    id="bgGradient"
                    origin={[0, 0]}
                    size={size}
                    type="linear"
                    options={{
                        colors: ['#fff', '#fff'],
                        start: [-0.3, -0.3],
                        end: [0.7, 0.7],
                    }}
                />
            </Defs>
            <Rect x={-25} y={-25} width={size} height={size} fill="url(#bgGradient)" />
        </>
    );
};

const QRCode = ({ url, data }) => {
    const t = useTranslation()
    const [saving, setIsSaveing] = useState(false)
    const [downloaded, setIsDownloaded] = useState(false)
    const qrBase = useRef(null)
    const setQrData = (data) => {
        qrBase.current = data
    }

    const handlePressDownload = async () => {
        try {
            if (saving) return
            setIsSaveing(true)

            if (!qrBase.current) {
                setIsSaveing(false)
                Alert.alert(t('webId.alerts.again.title'), t('webId.alerts.again.message'))
                return
            }

            const base64Code = qrBase.current
            const filename = FileSystem.documentDirectory + 'qr_code.png';

            await FileSystem.writeAsStringAsync(filename, base64Code, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await MediaLibrary.saveToLibraryAsync(filename);
            Alert.alert('QR downloaded!');
            setIsSaveing(false)
            setIsDownloaded(true)
            setTimeout(() => {
                setIsSaveing(false)
            }, 5000)
        } catch (error) {
            console.error('QR downloading failed: ', error);
            setIsSaveing(false)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <BlurView tint="light" intensity={50} style={styles.blur} />
                <CustomPieces
                    data={url}
                    style={styles.qr}
                    renderBackground={renderBackground}
                    size={6}
                    callback={setQrData}
                />
                <View style={styles.userContainer}>
                    <Image style={styles.userImage} source={{ uri: data.image }} />
                </View>
            </View>
            <View style={content.container}>
                <View style={content.username}>
                    <View style={content.usernameContainer}>
                        <View style={[content.gradientLine, { marginRight: 18 }]} />
                        <Text style={content.usernameText}>{t('webId.whatsComming')}</Text>
                        <View style={[content.gradientLine, { marginLeft: 18 }]} />
                    </View>
                </View>
                <View style={content.section}>
                    <Image style={content.sectionMark} source={require('../../assets/icons/home/checkmark-72-1658234612.png')} />
                    <Text style={content.description}>{t('webId.sections.first')}</Text>
                </View>
                <View style={content.section}>
                    <Image style={content.sectionMark} source={require('../../assets/icons/home/checkmark-72-1658234612.png')} />
                    <Text style={content.description}>{t('webId.sections.secound')}</Text>
                </View>
                <View style={content.section}>
                    <Image style={content.sectionMark} source={require('../../assets/icons/home/checkmark-72-1658234612.png')} />
                    <Text style={content.description}>{t('webId.sections.third')}</Text>
                </View>
                <View style={content.section}>
                    <Image style={content.sectionMark} source={require('../../assets/icons/home/checkmark-72-1658234612.png')} />
                    <Text style={content.description}>{t('webId.sections.fourd')}</Text>
                </View>
            </View>
            <TouchableOpacity disabled={saving || downloaded} onPress={handlePressDownload} activeOpacity={0.9} style={styles.downloadButton}>
                {saving ?
                    <View style={styles.loadingTest}>
                        <ActivityIndicator size={'small'} />
                    </View>
                    :
                    (
                        <Image style={styles.downloadIcon} source={downloaded ? require('../../assets/icons/home/check circle-68-1658234612.png') : require('../../assets/icons/home/down line-100-1696832404.png')} />
                    )
                }
                <Text style={styles.downloadText}>{t('webId.download')}</Text>
            </TouchableOpacity>
        </View>
    )
};

const content = createStyles({
    container: {
        // position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    description: {
        color: '#fff',
        marginLeft: 8,
        paddingRight: 25,
        lineHeight: 20
    },
    sectionMark: {
        width: 24,
        height: 24,
        tintColor: 'white'
    },
    username: {
        overflow: 'hidden',
        marginBottom: 10
    },
    usernameContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        overflow: 'hidden'
    },
    gradientLine: {
        height: 0.5,
        width: '50%',
        opacity: 0.5,
        backgroundColor: '#fff'
    },
    usernameWings: {
        height: 1,
        width: '50%',
        opacity: 0.5,
    },
    usernameText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 100
    },
})

const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        right: 0,
        backgroundColor: 'rgba(255,255,255 / 0.1)',
    },
    loadingTest: {
        position: 'absolute',
        left: 0,
        marginLeft: 20,
    },
    downloadButton: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 25,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 45
    },
    downloadText: {

    },
    downloadIcon: {
        width: 28,
        height: 28,
        left: 0,
        position: 'absolute',
        marginLeft: 10
    },
    qr: {
        left: 0,
    },
    blur: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    innerContainer: {
        overflow: 'hidden',
        borderRadius: 20,
        width: '100%',
        top: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 20
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        flex: 1
    },
})

export default QRCode;
