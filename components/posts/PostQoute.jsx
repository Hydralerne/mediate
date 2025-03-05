import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';

import PostHeader from './PostHeader'
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
const isArabicText = (text) => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
}

const PostQoute = ({ data, navigation }) => {
    const [isVisible, setIsVisible] = useState(false)
    const openPostDetails = () => {
        if (data.deleted) return
        navigation.push('PostDetails', { id: data?.id, data, post: data.post });
    }
    return (
        <TouchableNativeFeedback onPressIn={() => setIsVisible(true)} onPressOut={() => setIsVisible(false)} onPress={openPostDetails}>
            <View style={[qoute.container, isVisible && { backgroundColor: colors.posts.overlay }]}>
                {data.deleted ?
                    <View style={qoute.qouteTextContainer}>
                        <Text style={[qoute.bodyText, { textAlign: 'center', marginTop: 15, opacity: 0.5 }]}>Message has been deleted</Text>
                    </View>
                    :
                    <>
                        <PostHeader isQoute={true} data={data} />
                        <View style={qoute.qouteTextContainer}>
                            <Text style={[qoute.bodyText, isArabicText(data.text) && { textAlign: 'right' }, (data.text == '' || !data.text) && { display: 'none' }]}>{data.text}</Text>
                        </View>
                    </>
                }
            </View>
        </TouchableNativeFeedback>

    )
}

const qoute = createStyles({
    qouteTextContainer: {
        paddingHorizontal: 15,
        flex: 1,
        marginBottom: 10
    },
    bodyText: {
        color: colors.mainColor,
        fontSize: 14.5,
        lineHeight: 20,
        paddingBottom: 5,
        fontFamily: 'main'
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.lightBorder,
        borderRadius: 15,
        zIndex: 9,
        paddingBottom: 5,
        marginBottom: 8,
        marginTop: 5
    }
})

export default React.memo(PostQoute)