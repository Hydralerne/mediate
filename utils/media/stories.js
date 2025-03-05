import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export const handleAddStory = async (callback) => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
        });

        if (result.canceled || !result.assets || !result.assets[0]) {
            // error
        }
        const originalImage = result.assets[0];
        const { width, height, uri } = originalImage;
        const maxWidth = 1080;
        const maxHeight = 1920;

        let resizeOptions = null

        if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width > maxWidth) {
                resizeOptions = { width: maxWidth, height: maxWidth / aspectRatio };
            } else if (height > maxHeight) {
                resizeOptions = { width: maxHeight * aspectRatio, height: maxHeight };
            }
        }

        let manipulatedImage = originalImage;
        if (resizeOptions) {
            manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: resizeOptions }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );
        }
        const manipulatedImageInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);

        let finalImage = manipulatedImage;

        if (manipulatedImageInfo.size && manipulatedImageInfo.size > 300 * 1024) {
            finalImage = await ImageManipulator.manipulateAsync(
                manipulatedImage.uri,
                [],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );
        }

        // const compressedFileInfo = await FileSystem.getInfoAsync(finalImage.uri);

        // if (!compressedFileInfo.exists) {
        //     throw new Error('Compressed image file does not exist.');
        // }

        callback(finalImage.uri, originalImage.uri)

    } catch (error) {
        console.error('Error picking image:', error);
    }
};