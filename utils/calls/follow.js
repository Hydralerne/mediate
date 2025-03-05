import { request } from "../requests"
import { getToken } from "../token"

export const sendFollow = async ({ id, isDisabled, isFollowed, setIsDisabled, setIsFollowed }) => {
    if (isDisabled) {
        return
    }

    setIsDisabled(true)
    try {
        const response = await request('https://api.onvo.me/v2/follow', { id: id }, isFollowed ? 'DELETE' : 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
    setIsDisabled(false)
    if (isFollowed) {
        setIsFollowed(false)
    } else {
        setIsFollowed(true)
    }
}
