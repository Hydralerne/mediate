import { getToken } from '../token';
import { request } from '../requests';
import { Alert } from 'react-native'

export const handleSendMsg = async ({ text: replyText, isAnon, isPost, media, data, handleClose, setDisabled }) => {
    setDisabled(true)
    if ((!replyText || replyText.trim().length > 1000) && !media?.data) {
        Alert.alert(
            "Invalid Input",
            "Please enter a valid reply (1-1000 characters).",
            [
                { text: "OK" }
            ]
        );
        setDisabled(false)
        return;
    }

    try {
        const token = await getToken();

        const payload = {
            version: 2,
            text: replyText.trim(),
            is_anon: isAnon
        }

        if (!isPost) {
            payload.user = data.id
        } else {
            payload.is_posting = true
        }
        
        if(media?.type == 'draw'){
            payload.media = {
                type: media?.type,
                data: media?.data,
            }
        }else if (media?.data) {
            payload.media = {
                type: media?.type,
                id: media?.data?.id,
                media_type: media?.data?.type
            }
            if (media?.type == 'music') {
                payload.media.content = media?.data
            }
        }

        const response = await request(`https://api.onvo.me/v2/message/${isPost ? 'post' : 'send'}`, payload, 'POST', {
            Authorization: `Bearer ${token}`
        });

        if (response.status == 'success') {
            Alert.alert(
                "Done",
                "Your message has been sent successfuly",
                [
                    { text: "OK", onPress: () => handleClose() }
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
        setDisabled(false)
    } catch (error) {
        setDisabled(false)
        console.error('Error sending reply:', error);
        alert('Error', 'Failed to send reply. Please try again.');
    }
};
