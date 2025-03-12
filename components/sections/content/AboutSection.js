/**
 * About Me section implementation
 */
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import TouchableButton from '../../global/ButtonTap';
import colors from '../../../utils/colors';

// Default content structure
export const defaultContent = {
  bio: '',
  profileImage: null,
  tagline: '',
  skills: []
};

// Unified editor component for both onboarding and dashboard
export const EditorSheet = ({ data = {}, onSave, isOnboarding = false }) => {
  const [content, setContent] = useState({
    ...defaultContent,
    ...data
  });
  const [skillInput, setSkillInput] = useState('');
  
  const updateField = (field, value) => {
    setContent({
      ...content,
      [field]: value
    });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    
    const newSkills = [...(content.skills || []), skillInput.trim()];
    updateField('skills', newSkills);
    setSkillInput('');
  };

  const removeSkill = (index) => {
    const newSkills = [...(content.skills || [])];
    newSkills.splice(index, 1);
    updateField('skills', newSkills);
  };

  const handleSave = () => {
    onSave(content);
  };

  // Simplified view for onboarding
  if (isOnboarding) {
    return (
      <View style={styles.sheetContainer}>
        <Text style={styles.sheetTitle}>About Me</Text>
        
        <Text style={styles.inputLabel}>Your Tagline</Text>
        <TextInput
          style={styles.textInput}
          placeholder="A short phrase that describes you"
          value={content.tagline}
          onChangeText={(value) => updateField('tagline', value)}
          maxLength={50}
        />
        
        <Text style={styles.inputLabel}>Your Bio</Text>
        <TextInput
          style={[styles.textInput, styles.bioInput]}
          placeholder="Write a short bio about yourself..."
          multiline
          value={content.bio}
          onChangeText={(value) => updateField('bio', value)}
        />
        
        <TouchableButton
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableButton>
      </View>
    );
  }

  // Full editor for dashboard
  return (
    <ScrollView style={styles.container}>
      <View style={styles.editorContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Your Tagline</Text>
            <TextInput
              style={styles.input}
              placeholder="A short phrase that describes you"
              value={content.tagline}
              onChangeText={(value) => updateField('tagline', value)}
              maxLength={50}
            />
            <Text style={styles.fieldHint}>
              This appears below your name. Keep it short and impactful.
            </Text>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Your Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell visitors about yourself, your background, and what you do"
              multiline
              value={content.bio}
              onChangeText={(value) => updateField('bio', value)}
            />
            <Text style={styles.fieldHint}>
              This is the main content of your About section. Be authentic and engaging.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Image</Text>
          
          <View style={styles.imagePickerContainer}>
            {content.profileImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: content.profileImage }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => updateField('profileImage', null)}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imagePicker}
                onPress={() => {
                  // In a real implementation, this would open an image picker
                  // For now, we'll just set a placeholder URL
                  updateField('profileImage', 'https://via.placeholder.com/150');
                }}
              >
                <View style={styles.imagePickerInner}>
                  <Image 
                    // source={require('../../../assets/icons/home/plus-17-1658431404.png')} 
                    style={styles.imagePickerIcon}
                  />
                  <Text style={styles.imagePickerText}>Add Profile Image</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.fieldHint}>
            A professional photo helps visitors connect with you.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Skills</Text>
          
          <View style={styles.skillInputContainer}>
            <TextInput
              style={styles.skillInput}
              placeholder="Add a skill (e.g. 'Web Design')"
              value={skillInput}
              onChangeText={setSkillInput}
            />
            <TouchableOpacity 
              style={styles.addSkillButton}
              onPress={addSkill}
            >
              <Text style={styles.addSkillText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.fieldHint}>
            Highlight your key skills to showcase your expertise.
          </Text>
          
          <View style={styles.skillsContainer}>
            {content.skills && content.skills.length > 0 ? (
              content.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                  <TouchableOpacity
                    style={styles.removeSkillButton}
                    onPress={() => removeSkill(index)}
                  >
                    <Text style={styles.removeSkillText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noSkillsText}>
                No skills added yet. Add your key skills above.
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          
          <View style={styles.previewContainer}>
            <View style={styles.aboutPreview}>
              {content.profileImage ? (
                <Image 
                  source={{ uri: content.profileImage }} 
                  style={styles.previewProfileImage} 
                />
              ) : (
                <View style={styles.previewProfilePlaceholder}>
                  <Text style={styles.previewProfilePlaceholderText}>Add Image</Text>
                </View>
              )}
              
              {content.tagline ? (
                <Text style={styles.previewTagline}>{content.tagline}</Text>
              ) : null}
              
              {content.bio ? (
                <Text style={styles.previewBio}>{content.bio}</Text>
              ) : (
                <Text style={styles.previewEmptyBio}>Add your bio to see it here</Text>
              )}
              
              {content.skills && content.skills.length > 0 ? (
                <View style={styles.previewSkillsContainer}>
                  <Text style={styles.previewSkillsTitle}>Skills</Text>
                  <View style={styles.previewSkillsList}>
                    {content.skills.map((skill, index) => (
                      <View key={index} style={styles.previewSkillBadge}>
                        <Text style={styles.previewSkillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        
        <TouchableButton
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editorContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  fieldHint: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 4,
  },
  imagePickerContainer: {
    marginVertical: 8,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  imagePickerInner: {
    alignItems: 'center',
  },
  imagePickerIcon: {
    width: 24,
    height: 24,
    tintColor: 'rgba(0,0,0,0.4)',
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  skillInputContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  skillInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addSkillButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addSkillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  skillText: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
  },
  removeSkillButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSkillText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    lineHeight: 16,
  },
  noSkillsText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  previewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  aboutPreview: {
    alignItems: 'center',
  },
  previewProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  previewProfilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewProfilePlaceholderText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  previewTagline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewBio: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewEmptyBio: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewSkillsContainer: {
    width: '100%',
    marginTop: 12,
  },
  previewSkillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  previewSkillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewSkillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    margin: 3,
  },
  previewSkillText: {
    fontSize: 12,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  sheetContainer: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
}); 