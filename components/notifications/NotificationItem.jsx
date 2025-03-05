import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../utils/colors';
import PostItem from '../posts/PostItem'
import UserItem from '../users/SearchList'
import { useNavigation } from '@react-navigation/native';
import createStyles from '../../utils/globalStyle';

const NotificationIcon = ({ type }) => {
    return <Image style={styles.iconStyle} source={require('../../assets/icons/notifications/add user-131-1658436041.png')} />

}

const FollowItem = ({ data, navigation }) => {
    navigation.navigateInCurrentTab = navigation.navigate
    return (
        <>
            <UserItem
                type={'follow'}
                data={data?.user}
                navigation={navigation}
            />
            <View style={styles.followedYou}>
                <Image style={[styles.iconStyleFollow]} source={require('../../assets/icons/notifications/add user-131-1658436041.png')} />
            </View>
        </>
    )
}

const styles = createStyles({
    followedYou: {
        position: 'absolute',
        marginLeft: 25,
        marginTop: 45,
        backgroundColor: colors.background,
        borderRadius: 50,
        padding: 5
    },
    iconStyleFollow: {
        width: 15, height: 15,
        tintColor: 'white'
    },
    time: {
        color: colors.mainColor,
        position: 'absolute',
        right: 0,
        top: 0,
        marginTop: 10,
        marginRight: 15,
        opacity: 0.25
    },
    iconStyle: {
        tintColor: colors.main,
        width: 28,
        height: 28
    },
    followContent: {
        marginTop: 10
    },
    iconWrapper: {
        width: 28,
        height: 28,
        marginRight: 10,
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    followText: {
        color: colors.mainColor
    },
    followesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    userInfo: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255 / 0.1)'
    },
    postNoti: {
        paddingTop: 10
    },
    contentContainer: {
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        overflow: 'hidden',
        backgroundColor: colors.background
    }
});

const NotificationItem = ({ data, navigation }) => {
    const Render = () => {
        if (data.type == 'reply' && data.message?.id) {
            return <PostItem navigation={navigation} threadOwner={data.message.userid} style={styles.postNoti} data={data.message} />;
        } else if (data.type == 'follow') {
            return <FollowItem navigation={navigation} data={data} />
        } else {
            return (
                <>
                </>
            )
        }
    }

    return (
        <View collapsable={false} style={styles.contentContainer}>
            {Render()}
        </View>
    );
};


export default NotificationItem;
