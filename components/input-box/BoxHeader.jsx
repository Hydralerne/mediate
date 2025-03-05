

import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import colors from '../../utils/colors';
import { BlurView } from 'expo-blur';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import TouchableButton from '../global/ButtonTap';
const isAndroid = Platform.OS === 'android'

const Header = ({ onClose, data, onSend, disabled, isPost }) => {
    const t = useTranslation()
    return (
        <View style={styles.modalHeader}>
            {isAndroid ? '' : <BlurView
                intensity={35}
                tint={colors.blurTint}
                style={styles.blurHeader}
            >
            </BlurView>}
            <View style={styles.insetHeader}>
                <TouchableButton onPress={onClose} style={styles.closeButton}>
                    <Image style={styles.closeImage} source={require('../../assets/icons/home/close remove-802-1662363936.png')} />
                </TouchableButton>
                <TouchableButton style={{ flex: 1 }}>
                    <View style={styles.headerViewContainer}>
                        {
                            !isPost ?
                                <>
                                    <Image
                                        source={{ uri: data?.image }}
                                        style={styles.headerViewImage}
                                    />
                                    <Text style={styles.headerViewName}>{data?.fullname}</Text>
                                </>
                                :
                                <Text style={styles.titleText}>{t('profile.box.posting')}</Text>
                        }
                    </View>
                </TouchableButton>
                <TouchableButton
                    style={[styles.replyButton, disabled && styles.replyButtonDisabled]}
                    onPress={onSend}
                    disabled={disabled && !isPost}
                >
                    <Text style={[styles.replyButtonText, disabled && styles.replyButtonTextDisabled]}>
                        {isPost ? t('profile.box.post') : t('profile.box.send')}
                    </Text>
                </TouchableButton>
            </View>
        </View>
    )
}


const styles = createStyles({
    titleText: {
        color: colors.mainColor,
        fontWeight: 'bold',
        fontFamily: 'basis-bold',
        fontSize: 18,
        fontFamily: 'main'
    },
    modalHeader: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        position: 'absolute',
        zIndex: 99,
        width: '100%',
        top: 0,
        height: 105,
        backgroundColor: isAndroid ? colors.background : `rgba(${colors.blackRGB}, ${colors.blackRGB}, ${colors.blackRGB} / 0.8)`
    },

    blurHeader: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },

    insetHeader: {
        flex: 1,
        paddingHorizontal: 15,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },

    closeButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30
    },

    closeImage: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24
    },
    headerViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        left: 0,
        right: 0,
        margin: 'auto',
        height: 50,
        flexDirection: 'row',
        marginTop: 50,
    },
    headerViewImage: {
        width: 25,
        height: 25,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    headerViewName: {
        color: colors.mainColor,
        marginLeft: 10,
        fontWeight: 'bold',
        fontFamily: 'main'
    },

    replyButton: {
        backgroundColor: colors.main,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },

    replyButtonDisabled: {
        backgroundColor: colors.main,
        opacity: 0.5,
    },

    replyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'main'
    },

    replyButtonTextDisabled: {
        opacity: 0.5,
    },
});

export default Header