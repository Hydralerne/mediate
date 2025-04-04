# Global Components

This directory contains reusable global components that can be used throughout the application.

## ImageHandler

The `ImageHandler` component provides a complete solution for image selection, preview, uploading, and compression.

### Features

- **Image Selection**: Pick images from the device's gallery
- **Image Preview**: Display selected images with delete and change options
- **Image Uploading**: Upload images to a server with progress tracking
- **Image Compression**: Automatically compress large images
- **Error Handling**: Comprehensive error handling with user feedback
- **Haptic Feedback**: Provides haptic feedback for user actions
- **Customizable UI**: Styling can be customized via props
- **Reliable Progress Tracking**: Shows meaningful progress even when network events are sparse

### Example Usage

```jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageHandler from '../global/ImageHandler';

const MyComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  
  const handleImageSelected = (uri) => {
    console.log('Image selected:', uri);
    setImageUri(uri);
    // You can use this URI to update your form state or send to a server
  };
  
  const handleImageRemoved = () => {
    console.log('Image removed');
    setImageUri(null);
  };
  
  const handleUploadComplete = (response) => {
    console.log('Upload completed with response:', response);
    // Update your state with the returned image URL from the server
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Image</Text>
      <ImageHandler 
        imageUri={imageUri}
        onImageSelected={handleImageSelected}
        onImageRemoved={handleImageRemoved}
        onUploadComplete={handleUploadComplete}
        upload={true} // Set to true to automatically upload after selection
        uploadUrl="https://your-api.com/upload"
        uploadHeaders={{ 'Authorization': 'Bearer token' }}
        square={true}
        quality={0.8}
        maxSize={1024} // 1MB
        placeholderText="Upload Profile Picture"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
});

export default MyComponent;
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageUri` | string | null | Initial image URI to display |
| `onImageSelected` | function | required | Callback when an image is selected |
| `onImageRemoved` | function | null | Callback when image is removed |
| `onUploadComplete` | function | null | Callback when upload completes |
| `uploadUrl` | string | 'https://cdn.oblien.com/upload' | URL to upload the image to |
| `upload` | boolean | false | Whether to automatically upload after selection |
| `uploadHeaders` | object | {} | Headers for the upload request |
| `uploadFieldName` | string | 'file' | Field name for the image in the form data |
| `style` | object | null | Additional styles for the container |
| `square` | boolean | false | Whether to use a square aspect ratio |
| `quality` | number | 0.8 | Image quality (0 to 1) |
| `maxSize` | number | 1024 | Max image size in KB (will compress if larger) |
| `placeholderText` | string | 'Select Image' | Text to show in the placeholder | 