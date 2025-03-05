export const request = async (url, payload = {}, method = 'GET', headers) => {
    try {
        if (method.toUpperCase() === 'GET' && Object.keys(payload).length > 0) {
            const filteredPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, value]) => value !== undefined)
            );
        
            if (Object.keys(filteredPayload).length > 0) {
                const queryParams = new URLSearchParams(filteredPayload).toString();
                url = `${url}?${queryParams}`;
            }
        }
        const options = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        };

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && Object.keys(payload).length > 0) {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.error('Error in request:', e);
        return {}
    }
};
