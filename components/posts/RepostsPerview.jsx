import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';

const RepostUsers = ({ data, navigation }) => {
    const openReposts = () => {

    }
    return (
        <View style={repost.container}>
            <View style={repost.innerContainer}>
                {data.users.map(user => {
                    return (
                        <TouchableButton onPress={() => navigation.push('ProfilePage', { id: user.id, data: user })}>
                            <View style={repost.repostImage}>
                                <View style={repost.smallIconRepost}>
                                    <Image style={repost.smallImage} source={require('../../assets/icons/posts/replay square-6-310-1662481518.png')} />
                                </View>
                                <Image key={user.id} style={repost.userImage} source={{ uri: user.image }} />
                            </View>
                        </TouchableButton>
                    );
                })}
                {data.total_reposts > 2 &&
                    <TouchableButton onPress={openReposts}>
                        <View style={[repost.repostImage, repost.textContainer]}>
                            <Text style={repost.repostText}>+{data.total_reposts - data.users.length}</Text>
                        </View>
                    </TouchableButton>
                }
            </View>
        </View>
    );
}

const repost = createStyles({
    textContainer: {
        backgroundColor: colors.background,
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    repostText: {
        color: colors.mainColor,
        fontSize: 10,
        fontFamily: 'main'
    },
    smallIconRepost: {
        position: 'absolute',
        width: 10,
        height: 10,
        backgroundColor: colors.posts.repost,
        borderRadius: 50,
        zIndex: 9,
        marginLeft: -2,
        marginTop: -2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    smallImage: {
        width: 8,
        height: 8,
        backgroundColor: 'rgba(255,255,255 / 0.1)'
    },
    container: {
        position: 'absolute',
        height: '100%',
        marginLeft: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 35,
        zIndex: 9
    },
    repostImage: {
        marginBottom: 10,
    },
    userImage: {
        width: 20,
        height: 20,
        borderRadius: 20,
    }
});

export default React.memo(RepostUsers)