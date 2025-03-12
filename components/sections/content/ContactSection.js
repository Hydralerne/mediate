/**
 * Contact section implementation
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import TouchableButton from '../../../components/global/ButtonTap';
import colors from '../../../utils/colors';

// Default content structure
export const defaultContent = {
  email: '',
  phone: '',
  address: '',
  showEmailField: true,
  showNameField: true,
  showMessageField: true,
  showPhoneField: false,
  customMessage: 'Get in touch with me! Fill out the form below and I\'ll get back to you as soon as possible.'
};

// Dashboard editor component
export const EditorSheet = ({ data, onSave }) => {
  const [formData, setFormData] = useState({
    ...defaultContent,
    ...data
  });

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <View style={styles.editorContainer}>
      <Text style={styles.editorTitle}>Contact Form Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Contact Information</Text>
        
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="(123) 456-7890"
          value={formData.phone}
          onChangeText={(value) => updateField('phone', value)}
          keyboardType="phone-pad"
        />
        
        <Text style={styles.inputLabel}>Address (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your address"
          multiline
          value={formData.address}
          onChangeText={(value) => updateField('address', value)}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Fields</Text>
        
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show Name Field</Text>
          <Switch
            value={formData.showNameField}
            onValueChange={(value) => updateField('showNameField', value)}
          />
        </View>
        
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show Email Field</Text>
          <Switch
            value={formData.showEmailField}
            onValueChange={(value) => updateField('showEmailField', value)}
          />
        </View>
        
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show Phone Field</Text>
          <Switch
            value={formData.showPhoneField}
            onValueChange={(value) => updateField('showPhoneField', value)}
          />
        </View>
        
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show Message Field</Text>
          <Switch
            value={formData.showMessageField}
            onValueChange={(value) => updateField('showMessageField', value)}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter a message to display above your contact form"
          multiline
          value={formData.customMessage}
          onChangeText={(value) => updateField('customMessage', value)}
        />
      </View>
      
      <TouchableButton
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  sheetDescription: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  editorContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#000',
  },
}); 