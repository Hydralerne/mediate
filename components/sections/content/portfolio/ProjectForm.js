import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ProjectForm = ({
    project,
    onSave,
    onCancel
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState({});
    const [imageSource, setImageSource] = useState('url'); // 'url' or 'device'

    const titleInputRef = useRef(null);

    // Use the TextInput component based on where the form is rendered
    const TextInputComponent = Platform.OS === 'ios' ? BottomSheetTextInput : BottomSheetTextInput;

    useEffect(() => {
        if (project) {
            setTitle(project.title || '');
            setDescription(project.description || '');
            setImageUrl(project.imageUrl || '');
            setProjectUrl(project.projectUrl || '');
            setTags(project.tags || []);
        }

        // Focus the title input when the form opens
        if (titleInputRef.current) {
            setTimeout(() => titleInputRef.current.focus(), 100);
        }
    }, [project]);

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const addTag = () => {
        if (newTag.trim()) {
            if (tags.includes(newTag.trim())) {
                Alert.alert('Duplicate Tag', 'This tag already exists');
                return;
            }

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (index) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const pickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to your photo library to select project images.');
                return;
            }

            // Launch image picker with square aspect ratio
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Square aspect ratio
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                // Use the selected image URI
                setImageUrl(result.assets[0].uri);
                setImageSource('device');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    const handleSave = () => {
        if (!validateForm()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // Focus on title input if there's an error
            if (errors.title && titleInputRef.current) {
                titleInputRef.current.focus();
            }
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const id = project?.id || `portfolio-${Date.now()}`;

        onSave({
            id: id,
            key: id, // Add the key property matching the id
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            projectUrl: projectUrl.trim(),
            tags,
            type: 'project'
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInputComponent
                        ref={titleInputRef}
                        style={[styles.input, errors.title && styles.inputError]}
                        placeholder="Enter project title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInputComponent
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter project description"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Project URL</Text>
                    <TextInputComponent
                        style={styles.input}
                        placeholder="Enter project URL"
                        value={projectUrl}
                        onChangeText={setProjectUrl}
                        autoCapitalize="none"
                    />
                </View>

                {/* Improved Image Section */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Project Image</Text>

                    <View style={styles.imageSection}>
                        {imageUrl ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageActions}>
                                    <TouchableOpacity
                                        style={styles.imageActionButton}
                                        onPress={() => setImageUrl('')}
                                    >
                                        <Ionicons name="close-circle" size={22} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={styles.changeImageButton}
                                    onPress={pickImage}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="camera-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.imageInputContainer}>
                                <View style={styles.inputWithIcon}>
                                    <Ionicons name="link-outline" size={18} color="rgba(0,0,0,0.4)" style={styles.inputIcon} />
                                    <TextInputComponent
                                        style={styles.urlInput}
                                        placeholder="Paste image URL"
                                        value={imageUrl}
                                        onChangeText={setImageUrl}
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>or</Text>
                                    <View style={styles.dividerLine} />
                                </View>
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={pickImage}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="image-outline" size={18} color="#fff" />
                                    <Text style={styles.uploadText}>Choose from gallery</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tags</Text>
                    <View style={styles.tagInputContainer}>
                        <TextInputComponent
                            style={styles.tagInput}
                            placeholder="Add a tag"
                            value={newTag}
                            onChangeText={setNewTag}
                            onSubmitEditing={addTag}
                        />
                        <TouchableOpacity
                            style={styles.addTagButton}
                            onPress={addTag}
                        >
                            <Text style={styles.addTagButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tagsContainer}>
                        {tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                                <TouchableOpacity
                                    style={styles.removeTagButton}
                                    onPress={() => removeTag(index)}
                                >
                                    <Text style={styles.removeTagButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Improved button row */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.7}
                >
                    <Text style={styles.saveButtonText}>Save Project</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        padding: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: 'rgba(0,0,0,0.6)',
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#000',
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#FF4D4F',
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
        marginTop: 4,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    imageSection: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    imageInputContainer: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    urlInput: {
        flex: 1,
        padding: 10,
        fontSize: 15,
        color: '#000',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    dividerText: {
        marginHorizontal: 10,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
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
        height: 180,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
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
    tagInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagInput: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#000',
        marginRight: 8,
    },
    addTagButton: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addTagButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#000',
        marginRight: 8,
    },
    removeTagButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeTagButtonText: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        marginBottom: Platform.OS === 'ios' ? 30 : 0,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
    },
    saveButton: {
        flex: 2,
        padding: 12,
        backgroundColor: '#000',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600',
    },
});

export default ProjectForm; 