
import { request } from '../utils/requests';
import { getToken } from '../utils/token';
import { Keyboard, Alert } from 'react-native'
export const renderReplyRef = { current: () => { } }

export const sendReply = async ({ setDisabled, setReplyText, replyText, id, post, userData, is_anon, handleClose }) => {
    try {
        setDisabled(true)
        const response = await request('https://api.onvo.me/v2/message/post', { text: replyText, is_anon, id: id, post: post }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        const isDone = response.status == 'success'
        Alert.alert(
            response.type || (isDone ? 'Done' : 'Error'),
            response.message || (isDone ? 'Your reply has been sent successfuly' : 'Error sending your reply, sorry for that'),
            [
                { text: "OK" }
            ],
        )
        setDisabled(false)
        Keyboard.dismiss()
        if (response.error) return
        if (response.status == 'success' && response.id) {
            renderReplyRef.current({
                id: response.id,
                date: response.date,
                thread_id: response.thread_id,
                time_ago: 'now',
                sender: {
                    id: userData?.data?.id,
                    image: userData?.data?.image,
                    fullname: userData?.data?.fullname,
                    username: userData?.data?.username
                },
                text: replyText,
                type: 'reply',
                public: true,
                is_anon: false,
                parent_post_id: id,
                timestamp: Date.now() / 1000
            })
        }
        if (!response.error) setReplyText('')
        if (handleClose) {
            handleClose()
        }
    } catch (e) {
        setDisabled(false)
        console.log(e)
    }
}
