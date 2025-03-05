import { getToken } from '../token';
import { request } from '../requests';
import { Alert } from 'react-native'

export const handleDelete = async (endpoint, props) => {
    try {
        const response = await request(`https://api.onvo.me/v2/${endpoint}`, props, 'DELETE', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response.statue === 'done') {
            Alert.alert(
                "Done",
                "Your message has been deleted successfuly",
                [
                    { text: "OK", onPress: () => { } }
                ]
            );
        } else if (response.error || response.status == 'alert') {
            Alert.alert(
                response.type || 'Error',
                response.message || response.error,
                [
                    { text: "OK" }
                ],
            );
        }
    } catch (error) {
        console.error('Delete message error:', error);
        alert('Error', 'Failed to delete message');
    }
};

export const handleUndo = async (id) => {
    try {
        const response = await request(`https://api.onvo.me/v2/posts/undo`, { id }, 'DELETE', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response.statue === 'done') {
            Alert.alert(
                "Done",
                "Your message has been deleted successfuly",
                [
                    { text: "OK", onPress: () => { } }
                ]
            );
        } else if (response.error || response.status == 'alert') {
            Alert.alert(
                response.type || 'Error',
                response.message || response.error,
                [
                    { text: "OK" }
                ],
            );
        }
    } catch (error) {
        console.error('Delete message error:', error);
        alert('Error', 'Failed to delete message');
    }
};


export const handleArchive = async (id, isUndo) => {
    try {
        const response = await request('https://api.onvo.me/v2/message', { archive: true, id: id, action: isUndo ? 'restore' : undefined }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response.error || response.status == 'alert') {
            Alert.alert(
                response.type || 'Error',
                response.message || response.error,
                [
                    { text: "OK" }
                ],
            );
        }
    } catch (error) {
        console.error('Archive message error:', error);
        alert('Error', 'Failed to archive message');
    }
};


export const handleBlock = async ({ id, msgid, muted }) => {
    try {
        const response = await request('https://api.onvo.me/v2/mute', { msgid, dir: 'msg', action: muted ? 'unmute' : 'mute' }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (response.error || response.status == 'alert') {
            Alert.alert(
                response.type || 'Error',
                response.message || response.error,
                [
                    { text: "OK" }
                ],
            );
            return
        }
        Alert.alert('User blocked', 'This user has been blocked successfuly, to manage your blocked users go to settings')
    } catch (error) {
        console.error('Archive message error:', error);
        alert('Error', 'Failed to block user');
    }
};