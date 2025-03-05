import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { socialIcons } from '../profile/SocialIcons';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';

const ProfileLinks = ({ callback, links }) => {
    return (
        <View style={styles.outsetContainer}>
            <Text style={styles.headText}>Choose link to add</Text>
            <View style={styles.container}>
                {Object.entries(socialIcons).map(([code, data]) => {
                    const disabled = links.filter(link => link.type == code).length > 0
                    return (
                        <TouchableButton key={code} disabled={disabled} style={[styles.button, disabled && { opacity: 0.5 }]} onPress={() => callback(code)}>
                            <Image source={data.image} style={[styles.icon, code == 'an' && { width: 25, height: 25 }]} />
                            <Text style={styles.iconText}>{data.title}</Text>
                        </TouchableButton>
                    )
                })}
            </View>
        </View>
    );
};

const styles = createStyles({
    headText: {
        color:colors.mainColor,
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 15,
        paddingTop: 10
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
        tintColor: colors.mainColor,
    },
    iconText: {
        color: colors.mainColor,
        fontSize: 10,
        marginTop: 2,
        textAlign: 'center',
    },
});

export default memo(ProfileLinks);
