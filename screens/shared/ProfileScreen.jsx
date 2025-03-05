import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import Profile from '../../components/profile/ProfileBody'
import { UserContext } from '../../contexts/UserContext';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
const ProfileScreen = ({ route, navigation }) => {
    const { id, username, data } = route.params;
    const { userData } = useContext(UserContext)
    const [profileData, setUserData] = useState({ user: data })
    const [isMounted, setIsMounted] = useState(false)
    const getUserData = async () => {
        const data = await request('https://api.onvo.me/v2/users', { id: (id || username), posts: false }, 'GET', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (!data.user) {
            Alert.alert('User not found', 'Looks like the username or id is wrong, this user is not exist in ONVO')
            navigation.goBack()
            return
        }
        setUserData(data)
    }

    useEffect(() => {
        getUserData()
        setTimeout(() => {
            setIsMounted(true)
        }, 50)
    }, [])

    if (!isMounted) {
        return (
            <>
            </>
        )
    }

    return (
        <Profile data={profileData} isSelf={(userData?.data?.id) == (data?.id || id)} cache={data} id={id} />
    );
};

export default ProfileScreen;
