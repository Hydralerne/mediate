
export const getImage = (base, e) => {
    if (!base) return null;

    // If e parameter is passed and it's a string (like 'medium', 'blur', etc.)
    // then use that as the variant in the URL
    if (e && base && base.startsWith('https://cdn.oblien.com/')) {
        const urlParts = base.split('/');
        const filename = urlParts[urlParts.length - 1];

        // Find the last directory before the filename
        const lastDirIndex = urlParts.length - 2;

        // Create a new array with the parts, insert the variant before the filename
        const newUrlParts = [
            ...urlParts.slice(0, lastDirIndex + 1),
            e, // Use the value of e as the variant
            filename
        ];

        return newUrlParts.join('/');
    }

    return base;
};

// Handle all images updates from the ImageHandler
export const handleImagesUpdate = (response, setFormData) => {
    // Handle different response types
    if (Array.isArray(response)) {
        // If we receive an array of URLs (from onImageRemoved)
        setFormData(prev => ({
            ...prev,
            image_urls: response,
            imageUrl: response.length > 0 ? response[0] : '' // Update the legacy single imageUrl
        }));
    } else if (response && response.files) {
        // Handle bulk file upload response with multiple files
        // Replace local file URLs with uploaded remote URLs
        const image_urls = response.files.map(file => file.url);

        setFormData(prev => {
            // Filter out local file:// URLs and replace with remote URLs
            const filteredUrls = prev.image_urls.filter(url => !url.startsWith('file:///'));
            return {
                ...prev,
                imageUrl: image_urls[0] || filteredUrls[0] || '', // First image as main image
                image_urls: [...filteredUrls, ...image_urls] // Keep remote URLs + add new remote URLs
            };
        });
    } else if (response && response.url) {
        // If we receive a single upload response object with URL
        const imageUrl = response.url;

        setFormData(prev => {
            // Remove the corresponding local file:// URL (assuming it's the last one added)
            const filteredUrls = prev.image_urls.filter(url => !url.startsWith('file:///'));
            return {
                ...prev,
                imageUrl: imageUrl || filteredUrls[0] || '', // Use the remote URL as main image
                image_urls: [...filteredUrls, imageUrl] // Keep other remote URLs + add new remote URL
            };
        });
    }
};
