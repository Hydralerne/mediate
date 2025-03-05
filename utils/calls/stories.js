import { getToken } from '../token';
import { request } from '../requests';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const fetchStories = async (data, isLoadingMore, offset) => {
    const { setStories, setLoading, setSelf, setHasMore, hasMore } = data;
    try {
        if (!hasMore) return
        setLoading(true)
        const data = await request('https://api.onvo.me/v2/stories', { fs: 0, offset }, 'GET', {
            Authorization: `Bearer ${await getToken()}`
        })
        if (data.content.length == 0 || !data?.content) {
            setHasMore(false)
        }
        if (isLoadingMore) {
            setStories((prevStories) => [...prevStories, ...data.content]);
        } else {
            setStories(data.content);
            if (data.self) {
                setSelf(data.self)
            }
        }
        setLoading(false);
    } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
    }
};

export const setViewed = async (id) => {
    try {
        const response = await request('https://api.onvo.me/v2/stories/view', { id }, 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        console.log(response)
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

export const callLike = async (id, e) => {
    try {
        const response = await request('https://api.onvo.me/v2/stories/like', { id }, e ? 'DELETE' : 'POST', {
            Authorization: `Bearer ${await getToken()}`
        })
        console.log(response)
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};



export const deleteStory = async (callback) => {

    Alert.alert(
        'Are you sure?',
        'Your story will be permanently deleted',
        [

            {
                text: "Cancel",
                onPress: async () => { }
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const response = await request('https://api.onvo.me/v2/stories/delete', {}, 'DELETE', {
                        Authorization: `Bearer ${await getToken()}`
                    })
                    console.log(response)
                    callback(response)
                }
            }
        ],
        {
            cancelable: true
        }
    );
}

export const uploadImage = async ({ uri, callback, text }) => {
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

            formData.append('file', file);
            formData.append('story', 'sub');
            formData.append('text', text);

            const token = await getToken();
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                console.log('asdasds')
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

            xhr.open('POST', 'https://st.onvo.me/api/');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);

        } catch (error) {
            console.log(error)
        }
    })
};