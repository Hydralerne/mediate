import React, { useCallback, memo, useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Share,
    Image,
    Platform
} from 'react-native';
import { useBottomSheet } from '../../../contexts/BottomSheet';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";

// Import from our middleware
import {
    getSectionIcon,
    getSectionEditor
} from '../../../components/sections/index';

// Import the SectionEditorSheet component
import SectionEditorSheet from './SectionEditorSheet';
import { LongPressGestureHandler } from 'react-native-gesture-handler';

const ContentSectionComponent = ({
    section,
    onToggleActive,
    onEdit,
    onDelete,
    onAddItem,
    drag,
    isActive,
    navigation
}) => {
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const dragStartedRef = useRef(false);
    const dragTimeoutRef = useRef(null);
    const resetTimeoutRef = useRef(null);

    // Clear timeouts when component unmounts
    useEffect(() => {
        return () => {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    const sectionIcon = section.icon || getSectionIcon(section.type);

    const handleOpenEditor = useCallback(() => {
        // Don't open editor if drag just ended
        if (dragStartedRef.current) {
            return;
        }

        // Get the editor component from middleware
        const EditorComponent = getSectionEditor(section.type);

        console.log('EditorComponent', section.type);

        if (EditorComponent) {
            if (section.type === 'products') {
                navigation.navigate('EditorSheet', {
                    section: section
                });
                return
            }
            openBottomSheet(
                <SectionEditorSheet
                    section={section}
                    EditorComponent={EditorComponent}
                    onSave={(data) => {
                        onEdit({ content: data });
                        closeBottomSheet();
                    }}
                    onDelete={() => {
                        onDelete();
                        closeBottomSheet();
                    }}
                    onShare={async () => {
                        try {
                            await Share.share({
                                message: `Check out my ${section.title} section at: https://oblien.com/${section.id}`,
                                title: section.title,
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }}
                    onClose={closeBottomSheet}
                />,
                ['80%']
            );
        }
    }, [section, onEdit, onDelete, openBottomSheet, closeBottomSheet]);

    const handleToggleActive = useCallback((e) => {
        e.stopPropagation();
        onToggleActive();
    }, [onToggleActive]);

    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e) => {
        e.stopPropagation();
        drag()
        console.log('dragging', isDragging);
        setIsDragging(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }, [drag]);

    return (
        <ScaleDecorator
            activeScale={1.05}
        >
            <View style={[styles.container, styles.sectionContent, isDragging && styles.draggingContainer]}>

                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        {sectionIcon ? (
                            <Image source={sectionIcon} style={styles.sectionIcon} />
                        ) : (
                            <View style={styles.iconPlaceholder} />
                        )}
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
                            onPress={handleToggleActive}
                        >
                            <Text style={[styles.toggleText, section.active ? styles.activeToggleText : styles.inactiveToggleText]}>
                                {section.active ? 'Active' : 'Hidden'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={handleOpenEditor}
                        >
                            <Image
                                source={require('../../../assets/icons/home/pen-83-1666783638.png')}
                                style={styles.actionIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onLongPress={handleDrag}
                            delayLongPress={100}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPressOut={() => {
                                setTimeout(() => {
                                    setIsDragging(false);
                                }, 200);
                            }}
                        >
                            <Image
                                source={require('../../../assets/icons/home/drag-17-1658431404.png')}
                                style={styles.actionIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScaleDecorator>
    );
};

// Update styles to include dragging container style
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    sectionContent: {
        padding: 14,
    },
    inactiveContainer: {
        opacity: 0.7,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sectionIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
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
    iconButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    actionIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    itemCountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    itemCount: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.6)',
    },
    tapToEdit: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.4)',
        fontStyle: 'italic',
    },
    draggingContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
});

// Use memo with a custom comparison function
export default memo(ContentSectionComponent);