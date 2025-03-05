import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';

const CutItem = ({ data }) => {

    const navigation = useNavigation();

    const openPostDetails = () => {
        navigation.navigate('PostDetails', { id: data?.id, data: {...data,type: 'post'} });
    }

    return (
        <View style={[styles.postContainer]}>
            <View style={styles.imageCont}>
                <Image style={styles.leftImageSet} source={{ uri: data?.sender?.image || data?.user?.image }} />
            </View>
            <TouchableWithoutFeedback onPress={openPostDetails}>
                <View style={styles.clickMain}>
                    <Text style={styles.seeMore}>View Thread</Text>
                    <Image source={require('../../assets/icons/posts/eye-13-1676023406.png')} style={styles.iconView} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}


const styles = createStyles({
    postContainer: {
        flexDirection: 'row',
        // backgroundColor: '#fff'
    },
    iconView: {
        width: 22,
        height: 22,
        marginTop: -3,
        tintColor: colors.mainSecound,
        marginLeft: 5
    },
    clickMain: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
        paddingRight: 25,
        marginTop: 2,
    },
    seeMore: {
        // fontWeight: 'bold',
        marginLeft: 'auto',
        color: colors.mainSecound,
        marginLeft: 20,
        fontSize: 14
    },
    imageCont: {
        marginLeft: 24,
        width: 25,
        height: 25,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.mainSecound,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftImageSet: {
        width: 20,
        height: 20,
        borderRadius: 50,
        resizeMode: 'cover',
    }
});

export default React.memo(CutItem);
