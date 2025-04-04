import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getToken } from '../../utils/token';

/**
 * A reusable component for handling image selection, preview, and upload
 * 
 * @param {Object} props - Component props
 * @param {string} [props.imageUri] - Initial image URI (legacy support)
 * @param {string[]} [props.imageUris] - Initial image URIs for multiple images
 * @param {function} props.onImageSelected - Callback when image is selected (receives image URI)
 * @param {function} [props.onImageRemoved] - Callback when image is removed
 * @param {function} [props.onImageAdded] - Callback when image is added in multiple mode
 * @param {function} [props.onUploadComplete] - Callback when upload completes (if uploadUrl is provided)
 * @param {string} [props.uploadUrl] - URL to upload the image to (if provided, upload will be performed)
 * @param {Object} [props.uploadHeaders] - Headers for the upload request
 * @param {string} [props.uploadFieldName="file"] - Field name for the image in the upload form
 * @param {Object} [props.style] - Additional styles for the container
 * @param {boolean} [props.square=false] - Whether to enforce square aspect ratio when picking
 * @param {number} [props.quality=0.8] - Image quality (0 to 1)
 * @param {number} [props.maxSize=1024] - Max image size in KB (will compress if larger)
 * @param {string} [props.placeholderText="Select Image"] - Text to show when no image is selected
 * @param {boolean} [props.multiple=false] - Whether to allow multiple image selection
 * @param {number} [props.maxImages=6] - Maximum number of images when multiple=true
 */
const ImageHandler = ({
    imageUri,
    imageUris = [],
    onImageSelected,
    onImageRemoved,
    onImageAdded,
    onUploadComplete,
    uploadUrl = 'https://cdn.oblien.com/upload',
    upload = false,
    uploadHeaders = {},
    uploadFieldName = 'file',
    style,
    square = false,
    quality = 0.8,
    maxSize = 1024, // KB
    placeholderText = "Select Image",
    multiple = false,
    maxImages = 6
}) => {
    // Initialize with either multiple images or single image
    const [images, setImages] = useState(() => {
        if (multiple) {
            return imageUris.length > 0 ? imageUris : [];
        } else {
            return imageUri ? [imageUri] : [];
        }
    });
    
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [progressTimer, setProgressTimer] = useState(null);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(null);

    // Update when props change
    useEffect(() => {
        if (multiple && imageUris.length > 0) {
            setImages(imageUris);
        } else if (!multiple && imageUri && images[0] !== imageUri) {
            setImages(imageUri ? [imageUri] : []);
        }
    }, [imageUri, imageUris]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (progressTimer) {
                clearInterval(progressTimer);
            }
        };
    }, [progressTimer]);

    // Process selected images (compress if needed, update state, trigger callbacks)
    const processSelectedImages = async (selectedUris) => {
        // Immediately update UI with selected images
        const currentIndex = images.length;
        const newImages = [...images, ...selectedUris];
        setImages(newImages);
        
        // Call callbacks right away
        if (multiple) {
            if (onImageSelected) {
                onImageSelected(newImages);
            }
            
            if (onImageAdded) {
                onImageAdded(selectedUris);
            }
        } else {
            if (onImageSelected) {
                onImageSelected(selectedUris[0]);
            }
        }
        
        // Upload the images
        if (upload) {
            try {
                if (multiple && selectedUris.length > 1 && uploadUrl.includes('/upload')) {
                    // Upload multiple images at once (only if server supports /multiple endpoint)
                    await uploadMultipleImages(selectedUris, currentIndex);
                } else {
                    // Upload images one by one
                    for (let i = 0; i < selectedUris.length; i++) {
                        const imageIndex = currentIndex + i;
                        await uploadImage(selectedUris[i], imageIndex);
                    }
                }
            } catch (error) {
                // On error, remove the failed images
                removeFailedUploads(selectedUris, currentIndex);
                console.error('Error during upload process:', error);
            }
        }
    };

    // Remove images that failed to upload
    const removeFailedUploads = (failedUris, startIndex) => {
        // Filter out the failed images from the current state
        const newImages = images.filter((img, index) => 
            index < startIndex || index >= startIndex + failedUris.length
        );
        
        setImages(newImages);
        
        // Notify parent component
        if (multiple) {
            if (onImageSelected) {
                onImageSelected(newImages);
            }
            
            if (onImageRemoved) {
                onImageRemoved(startIndex, newImages);
            }
        } else {
            setImages([]);
            if (onImageRemoved) {
                onImageRemoved();
            }
        }
    };

    // Request permissions and open image picker
    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photo library to select images.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: !multiple, // Only allow editing in single image mode
                allowsMultipleSelection: multiple,
                selectionLimit: multiple ? (maxImages - images.length) : 1,
                aspect: square ? [1, 1] : undefined,
                quality: quality,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                
                // Get URIs from selected assets
                const selectedUris = result.assets.map(asset => asset.uri);
                
                // Process the selected images
                processSelectedImages(selectedUris);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    // Upload multiple images at once
    const uploadMultipleImages = async (uris, startIndex) => {
        if (!uploadUrl) return;
        
        try {
            setIsUploading(true);
            setUploadProgress(0);
            setCurrentUploadIndex(startIndex);
            
            // Start a timer for progress feedback
            const timer = setInterval(() => {
                setUploadProgress(current => {
                    if (current < 0.8) {
                        return current + 0.01;
                    }
                    return current;
                });
            }, 150);
            setProgressTimer(timer);
            
            // Create form data with multiple files
            const formData = new FormData();
            
            // Add each image to form data
            for (let i = 0; i < uris.length; i++) {
                const uri = uris[i];
                formData.append('files', {
                    uri,
                    name: `image${i}.jpg`,
                    type: 'image/jpeg'
                });
            }
            
            // Get auth token
            const token = await getToken('token');
            
            // Make the request
            const response = await fetch(`${uploadUrl}/multiple`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    ...uploadHeaders
                },
                body: formData
            });
            
            // Clear the timer
            if (progressTimer) {
                clearInterval(progressTimer);
                setProgressTimer(null);
            }
            
            if (response.ok) {
                // Parse response
                const responseData = await response.json();
                
                setUploadProgress(1);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                
                if (onUploadComplete) {
                    onUploadComplete(responseData, startIndex);
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert('Upload Failed', errorData.error || 'Failed to upload images. Please try again.');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                
                // Remove the failed uploads from the UI
                removeFailedUploads(uris, startIndex);
            }
        } catch (error) {
            console.error('Error uploading multiple images:', error);
            Alert.alert('Upload Failed', 'Failed to upload images. Please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            
            // Remove the failed uploads from the UI
            removeFailedUploads(uris, startIndex);
            
            throw error;
        } finally {
            // Clear timer if it's still running
            if (progressTimer) {
                clearInterval(progressTimer);
                setProgressTimer(null);
            }
            setIsUploading(false);
            setCurrentUploadIndex(null);
        }
    };

    // Compress image if it's too large
    const compressImage = async (uri) => {
        try {
            const compressedUri = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Create a temporary file for the compressed image
            const newUri = FileSystem.documentDirectory + 'compressed_image_' + new Date().getTime() + '.jpg';
            await FileSystem.writeAsStringAsync(newUri, compressedUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            return newUri;
        } catch (error) {
            console.error('Error compressing image:', error);
            return uri; // Return original if compression fails
        }
    };

    // Upload image to server
    const uploadImage = async (uri, index = null) => {
        if (!uploadUrl) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);
            
            if (index !== null) {
                setCurrentUploadIndex(index);
            }

            // Start a timer to slowly increase progress in case network events are slow
            // This gives visual feedback that something is happening
            const timer = setInterval(() => {
                setUploadProgress(current => {
                    // Only auto-increment up to 80% to leave room for actual progress
                    if (current < 0.8) {
                        return current + 0.01;
                    }
                    return current;
                });
            }, 150);
            setProgressTimer(timer);

            const formData = new FormData();
            formData.append(uploadFieldName, {
                uri,
                name: 'image.jpg',
                type: 'image/jpeg'
            });

            const token = await getToken('token');
            // Use FileSystem for upload with progress tracking
            const uploadTask = FileSystem.createUploadTask(
                uploadUrl,
                uri,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                        ...uploadHeaders
                    },
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: uploadFieldName,
                    mimeType: 'image/jpeg',
                },
                (progress) => {
                    if (progress.totalBytesExpectedToWrite > 0) {
                        const calculatedProgress = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
                        setUploadProgress(calculatedProgress);
                    } else {
                        // Handle the case where totalBytesExpectedToWrite is 0 or undefined
                        // Set a fake progress to show activity
                        setUploadProgress(0.5); // Show 50% as a fallback
                    }
                }
            );

            const response = await uploadTask.uploadAsync();

            // Clear the timer when we get a response
            if (progressTimer) {
                clearInterval(progressTimer);
                setProgressTimer(null);
            }

            const responseData = JSON.parse(response.body);

            console.log('Response Data:', responseData);
            if (response.status >= 200 && response.status < 300) {
                // Ensure progress shows 100% when complete
                setUploadProgress(1);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                if (onUploadComplete) {
                    try {
                        onUploadComplete(responseData, index);
                    } catch (parseError) {
                        // If response isn't valid JSON, still call the callback with the raw response
                        onUploadComplete({ url: response.body }, index);
                    }
                }
            } else {
                Alert.alert('Upload Failed', responseData.error || 'Failed to upload image. Please try again.');
                
                // Remove the failed upload
                if (index !== null) {
                    // Remove just this one image
                    removeFailedUploads([uri], index);
                } else {
                    // In single mode, just clear the image
                    setImages([]);
                    if (onImageRemoved) {
                        onImageRemoved();
                    }
                }
                
                throw new Error('Upload failed with status: ' + response.status);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            
            // Remove the failed upload
            if (index !== null) {
                // Remove just this one image
                removeFailedUploads([uri], index);
            } else {
                // In single mode, just clear the image
                setImages([]);
                if (onImageRemoved) {
                    onImageRemoved();
                }
            }
            
            throw error;
        } finally {
            // Clear timer if it's still running
            if (progressTimer) {
                clearInterval(progressTimer);
                setProgressTimer(null);
            }
            setIsUploading(false);
            setCurrentUploadIndex(null);
        }
    };

    // Handle image removal
    const handleRemoveImage = (indexToRemove = 0) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        if (multiple) {
            // Remove the image at the specified index
            const newImages = images.filter((_, index) => index !== indexToRemove);
            setImages(newImages);
            
            // Call callback with updated array or null if empty
            if (onImageRemoved) {
                onImageRemoved(indexToRemove, newImages);
            }
        } else {
            // Single image mode - just clear the image
            setImages([]);
            if (onImageRemoved) {
                onImageRemoved();
            }
        }
    };

    // Render image preview with remove button
    const renderImagePreview = (uri, index) => (
        <View 
            key={`image-${index}`} 
            style={[
                styles.imagePreviewContainer,
                square && styles.squarePreviewContainer,
                multiple && styles.multipleImagePreview,
            ]}
        >
            <Image
                source={{ uri }}
                style={styles.imagePreview}
                resizeMode="cover"
            />

            {/* Image Actions */}
            <View style={styles.imageActions}>
                <TouchableOpacity
                    style={styles.imageActionButton}
                    onPress={() => handleRemoveImage(index)}
                    disabled={isUploading && currentUploadIndex === index}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="close-circle" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Change Image Button - only show in single mode */}
            {!multiple && (
                <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={pickImage}
                    disabled={isUploading}
                    activeOpacity={0.7}
                >
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                </TouchableOpacity>
            )}

            {/* Upload Progress Indicator */}
            {isUploading && (
                currentUploadIndex === index || 
                (multiple && currentUploadIndex !== null && index >= currentUploadIndex && index < currentUploadIndex + 1)
            ) && (
                <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.uploadingText}>
                        {isNaN(uploadProgress) ? '0' : Math.round(uploadProgress * 100)}%
                    </Text>
                </View>
            )}
            
            {/* "Uploading" Badge for waiting images */}
            {isUploading && currentUploadIndex !== null && index > currentUploadIndex && (
                <View style={styles.uploadingBadge}>
                    <Text style={styles.uploadingBadgeText}>Waiting...</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={[styles.container, style]}>
            {images.length > 0 ? (
                multiple ? (
                    // Multiple images mode
                    <View style={styles.multipleImagesContainer}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.multipleImagesScroll}
                        >
                            {/* Render all selected images */}
                            {images.map((uri, index) => renderImagePreview(uri, index))}
                            
                            {/* Add more images button if under the limit */}
                            {images.length < maxImages && (
                                <TouchableOpacity
                                    style={[
                                        styles.addMoreImagesButton,
                                        square && styles.squareAddMoreButton
                                    ]}
                                    onPress={pickImage}
                                    disabled={isUploading}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="add" size={30} color="#666" />
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    // Single image mode
                    renderImagePreview(images[0], 0)
                )
            ) : (
                // No images yet - show placeholder
                <View style={styles.imageInputContainer}>
                    <TouchableOpacity
                        style={[
                            styles.imagePlaceholder,
                        ]}
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name="image-outline" size={28} color="#666" />
                        </View>
                        <Text style={styles.placeholderText}>{placeholderText}</Text>
                        <Text style={styles.placeholderSubtext}>
                            {multiple ? 'Tap to add up to ' + maxImages + ' images' : 'Tap to browse your gallery'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    imageInputContainer: {
        borderRadius: 15,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        width: '100%',
        minHeight: 180,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    squarePlaceholder: {
        aspectRatio: 1,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    uploadButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 8,
    },
    imagePreviewContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    squarePreviewContainer: {
        aspectRatio: 1,
    },
    multipleImagePreview: {
        width: 120,
        height: 120,
        marginRight: 10,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imageActions: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
    },
    imageActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    // Multiple images container
    multipleImagesContainer: {
        width: '100%',
    },
    multipleImagesScroll: {
        paddingVertical: 5,
        paddingRight: 5,
    },
    addMoreImagesButton: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    squareAddMoreButton: {
        aspectRatio: 1,
    },
    uploadingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    uploadingBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ImageHandler; 