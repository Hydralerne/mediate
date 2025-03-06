import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { memo, useState, useContext } from 'react';
import TouchableButton from '../../components/global/ButtonTap';
import colors from '../../utils/colors';
import { OnboardingContext } from '../../contexts/OnboardingContext';

// Template option component
const TemplateOption = ({ template, selected, onSelect }) => (
    <TouchableOpacity 
        style={[styles.templateOption, selected && styles.selectedTemplate]} 
        onPress={() => onSelect(template.id)}
    >
        <Image source={template.preview} style={[styles.templatePreview,selected && {borderTopLeftRadius: 13, borderTopRightRadius: 13}]} />
        <View style={styles.templateInfo}>
            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.templateDescription}>{template.description}</Text>
        </View>
        {selected && (
            <View style={styles.selectedIndicator}>
                <Image 
                    source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                    style={styles.checkIcon}
                />
            </View>
        )}
    </TouchableOpacity>
);

// Template category section
const TemplateSection = ({ title, templates, selectedTemplate, onSelectTemplate }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.templatesGrid}>
            {templates.map(template => (
                <TemplateOption 
                    key={template.id}
                    template={template}
                    selected={selectedTemplate === template.id}
                    onSelect={onSelectTemplate}
                />
            ))}
        </View>
    </View>
);

const TemplateSelection = (() => {
    // Sample template data - replace with your actual templates
    const professionalTemplates = [
        { id: 'prof1', name: 'Minimal', description: 'Clean and professional', preview: require('../../assets/images/templates/minimal.jpg') },
        { id: 'prof2', name: 'Corporate', description: 'Business focused', preview: require('../../assets/images/templates/corporate.jpg') },
    ];
    
    const creativeTemplates = [
        { id: 'creative1', name: 'Artist', description: 'Showcase your work', preview: require('../../assets/images/templates/artist.png') },
        { id: 'creative2', name: 'Designer', description: 'Visual portfolio', preview: require('../../assets/images/templates/designer.png') },
    ];
    
    const personalTemplates = [
        { id: 'personal1', name: 'Social', description: 'Connect with others', preview: require('../../assets/images/templates/social.png') },
        { id: 'personal2', name: 'Blogger', description: 'Share your thoughts', preview: require('../../assets/images/templates/blogger.png') },
    ];

    const [selectedTemplate, setSelectedTemplate] = useState('prof1');
    const { setTemplateSelection } = useContext(OnboardingContext);

    const handleSelectTemplate = (templateId) => {
        setSelectedTemplate(templateId);
        setTemplateSelection(templateId);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Choose Your Template</Text>
                        <Text style={styles.subtitle}>
                            Select the design that best represents your style and purpose, you can customize it later.
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <TemplateSection 
                            title="Professional" 
                            templates={professionalTemplates}
                            selectedTemplate={selectedTemplate}
                            onSelectTemplate={handleSelectTemplate}
                        />
                        
                        <TemplateSection 
                            title="Creative" 
                            templates={creativeTemplates}
                            selectedTemplate={selectedTemplate}
                            onSelectTemplate={handleSelectTemplate}
                        />
                        
                        <TemplateSection 
                            title="Personal" 
                            templates={personalTemplates}
                            selectedTemplate={selectedTemplate}
                            onSelectTemplate={handleSelectTemplate}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#000',
        fontSize: 28,
        fontWeight: '300',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(0,0,0,1)',
        fontSize: 14,
        fontWeight: '300',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
    },
    sectionContainer: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000',
        marginBottom: 12,
        paddingLeft: 2,
    },
    templatesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    templateOption: {
        width: 168,
        marginBottom: 16,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
        overflow: 'hidden',
        // backgroundColor: '#f0f0f0',
        borderColor: 'transparent',
        height: 220,
    },
    selectedTemplate: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    templatePreview: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    templateInfo: {
        padding: 12,
    },
    templateName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    templateDescription: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.7)',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
    },
    checkIcon: {
        width: 20,
        height: 20,
    },
});

export default TemplateSelection; 