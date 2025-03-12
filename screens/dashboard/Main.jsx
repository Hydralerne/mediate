import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Alert,
    TouchableOpacity,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
// Import components
import Header from './components/Header';
import QuickStats from './components/QuickStats';
import ContentSection from './components/ContentSection';
import TabSelector from './components/TabSelector';
import ContentHeader from './components/ContentHeader';
import HeaderTab from './components/HeaderTab';
import SocialTab from './components/SocialTab';
import BottomActions from './components/BottomActions';
import { useBottomSheet } from '../../contexts/BottomSheet';
import AddSectionSheet from './components/AddSectionSheet';

// Import from our middleware
import {
    createSection,
    createSectionItem,
} from '../../components/sections/index';

const { height, width } = Dimensions.get('window');

// Create a memoized section component to prevent re-renders

// Create an EmptyState component that matches the project's UI theme
const EmptyState = memo(({ onAddSection }) => (
    <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateIconContainer}>
                <Image 
                    source={require('../../assets/icons/home/categories-0-1662364403.png')} 
                    style={styles.emptyStateIcon}
                />
            </View>
            <Text style={styles.emptyStateTitle}>No Sections Added</Text>
            <Text style={styles.emptyStateDescription}>
                Your website needs content sections to display information to visitors.
            </Text>
            <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={onAddSection}
            >
                <Text style={styles.emptyStateButtonText}>Add Section</Text>
                <Image 
                    source={require('../../assets/icons/home/plus 4-12-1662493809.png')} 
                    style={styles.emptyStateButtonIcon}
                />
            </TouchableOpacity>
        </View>
    </View>
));

const Main = ({ navigation }) => {
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { websiteId, websiteName, websiteDomain, initialSections } = route.params || {
        websiteId: '1',
        websiteName: 'My Website',
        websiteDomain: 'mywebsite.oblien.com',
        initialSections: null
    };

    const flatListRef = useRef(null);

    // Initialize sections from route params or create default sections
    const [sections, setSections] = useState([]);

    const [stats] = useState({
        visitors: 245,
        interactions: 56,
        messages: 12
    });

    const [activeTab, setActiveTab] = useState('content');
    const { openBottomSheet, closeAllSheets } = useBottomSheet();

    const [socialLinks, setSocialLinks] = useState([]);

    // Create stable handler functions with useCallback
    const toggleSectionActive = useCallback((sectionId) => {
        setSections(prevSections =>
            prevSections.map(section =>
                section.id === sectionId
                    ? { ...section, active: !section.active }
                    : section
            )
        );
    }, []);

    const handleEditSection = useCallback((sectionId, newData) => {
        setSections(prevSections =>
            prevSections.map(section =>
                section.id === sectionId
                    ? { ...section, ...newData }
                    : section
            )
        );
    }, []);

    const handleDeleteSection = useCallback((sectionId) => {
        setSections(prevSections =>
            prevSections.filter(section => section.id !== sectionId)
        );
    }, []);

    const handleAddItem = useCallback((sectionId) => {
        setSections(prevSections => {
            const section = prevSections.find(s => s.id === sectionId);
            if (!section) return prevSections;

            const newItem = createSectionItem(section.type);
            if (!newItem) return prevSections;

            return prevSections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        items: [...(s.items || []), newItem]
                    }
                    : s
            );
        });
    }, []);

    const handleAddSection = useCallback(() => {
        
        openBottomSheet(
            <AddSectionSheet
                onClose={closeAllSheets}
                onAdd={(sectionData) => {
                    // Create a new section using our middleware
                    const newSection = createSection(sectionData.type);

                    if (newSection) {
                        // Override title if provided
                        if (sectionData.title) {
                            newSection.title = sectionData.title;
                        }

                        setSections(prevSections => [...prevSections, newSection]);
                    }

                    closeAllSheets();
                }}
            />,
            ['90%']
        );
    }, [openBottomSheet, closeAllSheets]);

    const handlePreviewWebsite = useCallback(async () => {
        navigation.navigate('WebsitePreview', { websiteDomain });
    }, [websiteDomain]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        // Scroll to top when tab changes
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, []);

    // Memoize the handlers for social links
    const handleAddSocialLink = useCallback((newSocial) => {
        setSocialLinks(prevLinks => {
            const exists = prevLinks.some(link => link.type === newSocial.type);
            if (exists) {
                return prevLinks.map(link =>
                    link.type === newSocial.type ? newSocial : link
                );
            } else {
                return [...prevLinks, newSocial];
            }
        });
    }, []);

    const handleRemoveSocialLink = useCallback((socialType) => {
        setSocialLinks(prevLinks => prevLinks.filter(link => link.type !== socialType));
    }, []);

    // Create a memoized map of section handlers to avoid recreating them for each item
    const sectionHandlers = useMemo(() => {
        const handlers = {};

        sections.forEach(section => {
            handlers[section.id] = {
                toggleActive: () => toggleSectionActive(section.id),
                edit: (data) => handleEditSection(section.id, data),
                delete: () => handleDeleteSection(section.id),
                addItem: () => handleAddItem(section.id)
            };
        });

        return handlers;
    }, [sections, toggleSectionActive, handleEditSection, handleDeleteSection, handleAddItem]);

    // Highly optimized renderItem function
    const renderItem = useCallback(({ item, drag, isActive }) => {
        const handlers = sectionHandlers[item.id];

        return (
            <ContentSection
                navigation={navigation}
                section={item}
                onToggleActive={handlers.toggleActive}
                onEdit={handlers.edit}
                onDelete={handlers.delete}
                onAddItem={handlers.addItem}
                drag={drag}
                isActive={isActive}
            />
        );
    }, [sectionHandlers]);

    // Memoize tab components
    const ContentTabComponent = useMemo(() => (
        <ContentHeader
            title="Website Sections"
            subtitle="Drag sections to reorder how they appear on your website"
        />
    ), []);

    const HeaderTabComponent = useMemo(() => <HeaderTab />, []);

    const SocialTabComponent = useMemo(() => (
        <SocialTab
            socialLinks={socialLinks}
            onAddSocialLink={handleAddSocialLink}
            onRemoveSocialLink={handleRemoveSocialLink}
        />
    ), [socialLinks, handleAddSocialLink, handleRemoveSocialLink]);

    // Memoize the ListHeaderComponent
    const ListHeaderComponent = useMemo(() => (
        <>
            <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
                <View style={styles.headerTopView} />
                <Header
                    websiteName={websiteName}
                    websiteDomain={websiteDomain}
                    onShare={() => { }}
                    onSettings={() => { }}
                />

                <View style={styles.statsContainer}>
                    <QuickStats
                        visitors={stats.visitors}
                        interactions={stats.interactions}
                        messages={stats.messages}
                    />
                </View>

                <TabSelector
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
            </View>

            {activeTab === 'content' && ContentTabComponent}
            {activeTab === 'header' && HeaderTabComponent}
            {activeTab === 'social' && SocialTabComponent}
        </>
    ), [
        insets.top,
        websiteName,
        websiteDomain,
        stats,
        activeTab,
        handleTabChange,
        ContentTabComponent,
        HeaderTabComponent,
        SocialTabComponent
    ]);

    // In Main.jsx, update the onDragEnd handler
    const onDragEnd = useCallback(({ data, from, to }) => {
        // First provide haptic feedback immediately
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        
        // Use requestAnimationFrame to ensure the drag animation completes before state update
        requestAnimationFrame(() => {
            setSections(data);
        });
        
        // Notify all ContentSection components that dragging has ended
        // This is a global event that can be listened to by all components
        if (global.EventEmitter) {
            global.EventEmitter.emit('DRAG_ENDED');
        }
    }, []);

    // Memoize the content data to prevent re-renders
    const contentData = useMemo(() => {
        return activeTab === 'content' ? sections : [];
    }, [activeTab, sections]);

    // Check if we need to show the empty state
    const showEmptyState = activeTab === 'content' && (!sections || sections.length === 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#fff" />

            {showEmptyState ? (
                <>
                    {/* Show header components even when empty */}
                    {ListHeaderComponent}
                    
                    {/* Show empty state */}
                    <EmptyState onAddSection={handleAddSection} />
                </>
            ) : (
                <DraggableFlatList
                    ref={flatListRef}
                    data={contentData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    onDragEnd={onDragEnd}
                    ListHeaderComponent={ListHeaderComponent}
                    contentContainerStyle={[
                        styles.listContent
                    ]}
                    activationDistance={5}
                    dragItemOverflow={true}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    windowSize={21}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                />
            )}

            <BottomActions
                onAddContent={handleAddSection}
                onPreview={handlePreviewWebsite}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerWrapper: {
        backgroundColor: '#000',
    },
    headerTopView: {
        height: height,
        width: '100%',
        marginTop: -height,
        position: 'absolute',
        backgroundColor: '#000',
    },
    statsContainer: {
        paddingTop: 18,
        paddingBottom: 8,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    listContent: {
        paddingBottom: 150,
    },
    // Empty state styles
    emptyStateContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    emptyStateCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    emptyStateIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyStateIcon: {
        width: 30,
        height: 30,
        tintColor: 'rgba(0,0,0,0.5)',
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateDescription: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    emptyStateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    emptyStateButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginRight: 8,
    },
    emptyStateButtonIcon: {
        width: 16,
        height: 16,
        tintColor: '#000',
    }
});

export default React.memo(Main);