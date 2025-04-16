import { fetch as fetchExpo } from 'expo/fetch';
import { getToken } from '../../../utils/token';

class ChatApi {
    constructor() {
        this.apiKey = 'sk-proj-1234567890';
    }

    async sendMessage(message, callback = (e) => { console.log(e) }, sessionId = '') {
        const token = await getToken();
        const resp = await fetchExpo(`https://api.oblien.com/ai/stream/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });
        const reader = resp.body.getReader(); 
        const decoder = new TextDecoder() 

        while (true) {
            const { value, done } = await reader.read()
            if (done) break 
            const chunk = decoder.decode(value)
            callback(chunk)
        }
        return true; 
    }
}

export default new ChatApi();
