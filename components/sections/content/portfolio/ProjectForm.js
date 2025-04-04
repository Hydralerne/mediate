import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import ImageHandler from '../../../global/ImageHandler';

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
                    <ImageHandler
                        imageUri={imageUrl}
                        onImageSelected={(uri) => setImageUrl(uri)}
                        onImageRemoved={() => setImageUrl('')}
                        square={true}
                        quality={0.8}
                        upload={true}
                        maxSize={1024}
                        placeholderText="Choose project image"
                        style={styles.imageHandler}
                    />
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
    imageHandler: {
        marginTop: 5,
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