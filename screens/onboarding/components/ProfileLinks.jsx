import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { socialIcons } from './SocialIcons';
import TouchableButton from '../../../components/global/ButtonTap';
import colors from '../../../utils/colors';
import createStyles from '../../../utils/globalStyle';

const ProfileLinks = ({ callback, links }) => {
    return (
        <View style={styles.outsetContainer}>
            <View style={styles.container}>
                {Object.entries(socialIcons).map(([code, data]) => {
                    const disabled = links.filter(link => link.type == code).length > 0
                    return (
                        <TouchableButton key={code} style={[styles.button, disabled && { backgroundColor: 'rgba(0,0,0,0.05)' }]} onPress={() => callback(code, disabled)}>
                            <Image source={data.image} style={[styles.icon, code == 'an' && { width: 25, height: 25 }]} />
                            <Text style={styles.iconText}>{data.title}</Text>
                            {disabled && (<Image source={require('../../../assets/icons/home/check circle-3-1660219236.png')} style={styles.tickIcon} />)}
                        </TouchableButton>
                    )
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outsetContainer: {
        // marginHorizontal: 20,
    },
    tickIcon: {
        width: 26,
        height: 26,
        position: 'absolute',
        left: -4,
        top: -6,
        borderRadius: 100,
        backgroundColor: '#fff',
        tintColor: 'rgba(0,0,0,0.05)',
        padding: 2
   },
    headText: {
        color: colors.mainColor,
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 15,
        paddingTop: 10
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 120,
        zIndex: 99
    },
    button: {
        width: 75,
        height: 60,
        marginVertical: 8,
        // marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: colors.lightBorder
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    iconText: {
        color: '#000',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default memo(ProfileLinks);
