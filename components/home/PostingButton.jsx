
import React from 'react'

import { StyleSheet, View, Image } from 'react-native'
import createStyles from '../../utils/globalStyle'
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';

const PostButton = ({ onClick }) => {
    return (
        <TouchableButton onPress={onClick} style={styles.container}>
            <Image source={require('../../assets/icons/home/plus 4-12-1662493809.png')} style={styles.iconMain} />
        </TouchableButton>
    )
}

const styles = createStyles({
    iconMain: {
        tintColor: 'white',
        width: 30,
        height: 30,
    },
    container: {
        width: 54,
        height: 54,
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.main,
        borderRadius: 50,
        marginBottom: 85,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,

    }
})

export default PostButton