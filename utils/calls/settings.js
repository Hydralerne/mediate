import { request } from '../requests'
import { getToken } from '../token'
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

export const switchOption = async (section, key, value) => {
    const response = await request('https://api.onvo.me/v2/settings/update', { section, key, value }, 'POST', {
        Authorization: `Bearer ${await getToken()}`
    })
    return response
}

export const toggleCheckbox = (section, key, setSectionsState) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSectionsState(prevState => {
        const newValue = !prevState[key];
        switchOption(section, key, newValue);
        return { ...prevState, [key]: newValue };
    });
};

export const uploadProfileImage = async (uri, callback) => {
    return new Promise(async (resolve) => {
        try {
            if (!uri) {
                throw new Error('Invalid photo URI');
            }

            const fileInfo = await FileSystem.getInfoAsync(uri);

            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            const file = {
                uri: fileInfo.uri,
                name: 'image.jpg',
                type: 'image/jpeg',
            };

            const formData = new FormData();

            formData.append('data', file);
            formData.append('upload', 'sub');

            const token = await getToken();
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    callback({ progress });
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    callback({ progress: 100 });
                    resolve(response)
                } else {
                    console.log(`HTTP error! status: ${xhr.status}`)
                }
            });

            xhr.addEventListener('error', () => {
                console.log('Network error');
            });

            xhr.open('POST', 'https://cdn.onvo.me/api/');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);

        } catch (error) {
            console.log(error)
        }
    })
};