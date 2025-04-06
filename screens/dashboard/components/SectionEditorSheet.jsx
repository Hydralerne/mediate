import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    Image
} from 'react-native';

const SectionEditorSheet = ({ 
    section, 
    EditorComponent, 
    onSave, 
    onDelete, 
    onShare, 
    onClose 
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Image 
                        source={require('../../../assets/icons/home/close remove-802-1662363936.png')} 
                        style={styles.closeIcon} 
                    />
                </TouchableOpacity>
                
                <Text style={styles.title}>{section.title}</Text>
                
                <View style={styles.headerActions}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={onShare}
                    >
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={() => {
                            // This will trigger the save action in the EditorComponent
                            if (onSave) {
                                onSave(section);
                            }
                        }}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={onDelete}
                    >
                        <Image 
                            source={require('../../../assets/icons/home/trash-17-1658431404.png')} 
                            style={styles.deleteIcon} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.editorContainer}>
                {EditorComponent && (
                    <EditorComponent
                        data={section}
                        onSave={onSave}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '300',
        color: '#000',
        marginLeft: 8,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        marginRight: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#000',
    },
    saveButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#000',
        borderRadius: 12,
        marginRight: 8,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#fff',
    },
    deleteButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#FF4D4F',
    },
    editorContainer: {
        flex: 1,
    },
});

export default SectionEditorSheet; 