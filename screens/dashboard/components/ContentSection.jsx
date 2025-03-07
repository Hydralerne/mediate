import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Animated,
    Modal,
    FlatList,
    Share
} from 'react-native';

const ContentSection = ({ 
    section, 
    onToggleActive, 
    onEdit, 
    onDelete, 
    onAddItem,
    drag,
    isActive 
}) => {
    const [expanded, setExpanded] = useState(true); // Start expanded by default
    const [menuVisible, setMenuVisible] = useState(false);
    
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemType}>{item.type}</Text>
            </View>
            <TouchableOpacity style={styles.itemEditButton}>
                <Text style={styles.itemEditText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
    
    return (
        <Animated.View 
            style={[
                styles.container, 
                !section.active && styles.inactiveContainer,
                isActive && styles.draggingContainer
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconPlaceholder} />
                    <View style={styles.titleTextContainer}>
                        <Text style={[styles.title, !section.active && styles.inactiveTitle]}>
                            {section.title}
                        </Text>
                        {section.description && (
                            <Text style={styles.description}>{section.description}</Text>
                        )}
                    </View>
                </View>
                
                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.toggleButton, section.active ? styles.activeToggle : styles.inactiveToggle]}
                        onPress={onToggleActive}
                    >
                        <Text style={[styles.toggleText, section.active ? styles.activeToggleText : styles.inactiveToggleText]}>
                            {section.active ? 'Active' : 'Inactive'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuButton}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Text style={styles.menuButtonText}>•••</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.dragButton}
                        onPressIn={drag}
                    >
                        <View style={styles.dragButtonInner}>
                            <View style={styles.dragLine} />
                            <View style={styles.dragLine} />
                            <View style={styles.dragLine} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.expandedContent}>
                <View style={styles.expandHeaderContainer}>
                    <View style={styles.divider} />
                    <TouchableOpacity 
                        style={styles.expandButton}
                        onPress={() => setExpanded(!expanded)}
                    >
                        <Text style={styles.expandButtonText}>
                            {expanded ? 'Hide Content' : 'Show Content'}
                        </Text>
                        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                </View>
                
                {expanded && (
                    <View style={styles.contentContainer}>
                        {section.items && section.items.length > 0 ? (
                            <FlatList 
                                data={section.items}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                            />
                        ) : (
                            <Text style={styles.emptyText}>No items yet. Add your first item!</Text>
                        )}
                        
                        <TouchableOpacity 
                            style={styles.addItemButton}
                            onPress={() => {
                                // Generate a unique ID for the new item
                                const newItemId = `${section.id}-${Date.now()}`;
                                onAddItem({
                                    id: newItemId,
                                    title: 'New Item',
                                    type: section.id === 'portfolio' ? 'project' : 
                                          section.id === 'blog' ? 'post' : 'item'
                                });
                            }}
                        >
                            <Text style={styles.addItemText}>+ Add New Item</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            
            {/* Options Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={async () => {
                                try {
                                    await Share.share({
                                        message: `Check out my ${section.title} section at: https://oblien.com/${section.id}`,
                                        title: section.title,
                                    });
                                } catch (error) {
                                    console.error(error);
                                }
                                setMenuVisible(false);
                            }}
                        >
                            <Text style={styles.menuItemText}>Copy Section Link</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => {
                                // Implement rename logic
                                setMenuVisible(false);
                            }}
                        >
                            <Text style={styles.menuItemText}>Edit Section Name</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.menuItem, styles.deleteMenuItem]}
                            onPress={() => {
                                setMenuVisible(false);
                                onDelete();
                            }}
                        >
                            <Text style={[styles.menuItemText, styles.deleteText]}>Delete Section</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    inactiveContainer: {
        opacity: 0.7,
        backgroundColor: '#f8f9fa',
    },
    draggingContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 999,
        borderWidth: 2,
        borderColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconPlaceholder: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        marginRight: 12,
    },
    titleTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    inactiveTitle: {
        color: 'rgba(0,0,0,0.4)',
    },
    description: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 8,
    },
    activeToggle: {
        backgroundColor: 'rgba(29, 209, 161, 0.1)',
    },
    inactiveToggle: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '500',
    },
    activeToggleText: {
        color: '#1DD1A1',
    },
    inactiveToggleText: {
        color: 'rgba(0, 0, 0, 0.4)',
    },
    menuButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    menuButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    dragButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragButtonInner: {
        height: 14,
        justifyContent: 'space-between',
    },
    dragLine: {
        width: 14,
        height: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 1,
        marginVertical: 1,
    },
    expandedContent: {
        paddingHorizontal: 16,
    },
    expandHeaderContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        width: '100%',
        position: 'absolute',
        top: 10,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        zIndex: 1,
    },
    expandButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.6)',
        marginRight: 4,
    },
    expandIcon: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.6)',
    },
    contentContainer: {
        paddingBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 8,
        padding: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    itemType: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
        marginTop: 2,
    },
    itemEditButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
    },
    itemEditText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
    },
    itemSeparator: {
        height: 8,
    },
    emptyText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.4)',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 16,
    },
    addItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    addItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    menuItemText: {
        fontSize: 16,
        color: '#000',
    },
    deleteMenuItem: {
        borderBottomWidth: 0,
    },
    deleteText: {
        color: '#FF4D4F',
    },
});

export default ContentSection;