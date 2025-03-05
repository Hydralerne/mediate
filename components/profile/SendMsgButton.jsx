
import React, { memo, useState } from 'react'

import { StyleSheet, View, Image } from 'react-native'
import ProfileController from '../../hooks/ProfileColorControler'
import colors from '../../utils/colors'
import createStyles from '../../utils/globalStyle'
import TouchableButton from '../global/ButtonTap'

const PostButton = ({ sendMessage }) => {
    const [color, setColor] = useState(colors.main)
    ProfileController.setColor = setColor
    return (
        <TouchableButton onPress={sendMessage} style={[styles.container, { backgroundColor: color }]}>
            <Image source={require('../../assets/icons/profile/email send-29-1659689482.png')} style={styles.iconMain} />
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

export default memo(PostButton)