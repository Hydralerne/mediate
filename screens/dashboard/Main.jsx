import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser'; // Import WebBrowser from expo
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useRoute } from '@react-navigation/native';

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
    SECTION_TYPES,
    SECTION_METADATA,
    getSectionIcon,
    createSection,
    createSectionItem,
    getDashboardEditor
} from '../../middleware/content';

const { width } = Dimensions.get('window');

// Memoize components outside the main component
const MemoizedContentHeader = React.memo(ContentHeader);
const MemoizedHeaderTab = React.memo(HeaderTab);

// Create a memoized section component to prevent re-renders
const SectionItem = React.memo(({
    section,
    onToggleActive,
    onEdit,
    onDelete,
    onAddItem,
    drag,
    isActive
}) => (
    <ContentSection
        section={section}
        onToggleActive={onToggleActive}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddItem={onAddItem}
        drag={drag}
        isActive={isActive}
    />
), (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
        prevProps.section.id === nextProps.section.id &&
        prevProps.section.active === nextProps.section.active &&
        prevProps.isActive === nextProps.isActive &&
        JSON.stringify(prevProps.section.items) === JSON.stringify(nextProps.section.items)
    );
});

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
    const [sections, setSections] = useState(() => {
        if (initialSections && Array.isArray(initialSections)) {
            return initialSections.map(section => ({
                ...section,
                icon: getSectionIcon(section.type)
            }));
        }

        // Create default sections
        return Object.values(SECTION_TYPES)
            .filter(type => SECTION_METADATA[type].defaultActive)
            .map(type => createSection(type))
            .filter(Boolean);
    });

    const [stats] = useState({
        visitors: 245,
        interactions: 56,
        messages: 12
    });

    const [activeTab, setActiveTab] = useState('content'); // 'content', 'header', 'social'
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

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
                onClose={closeBottomSheet}
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

                    closeBottomSheet();
                }}
            />,
            ['80%']
        );
    }, [openBottomSheet, closeBottomSheet]);

    const handlePreviewWebsite = useCallback(async () => {
        try {
            // Construct the preview URL using the websiteDomain
            const previewUrl = `https://${websiteDomain}`;

            navigation.navigate('WebsitePreview', { websiteDomain });
            return
            // Log the URL being opened (for debugging)
            console.log(`Opening preview: ${previewUrl}`);

            // Open the URL in SafariView
            const result = await WebBrowser.openBrowserAsync(previewUrl);

            // Optional: Handle the result
            console.log('Preview result:', result);
        } catch (error) {
            // Handle any errors that occur
            console.error('Error opening preview:', error);
            Alert.alert(
                'Preview Error',
                'Unable to open website preview. Please try again later.',
                [{ text: 'OK' }]
            );
        }
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
            <SectionItem
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
        <MemoizedContentHeader
            title="Website Sections"
            subtitle="Drag sections to reorder how they appear on your website"
        />
    ), []);

    const HeaderTabComponent = useMemo(() => <MemoizedHeaderTab />, []);

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

    // Simple drag end handler without any refs or animations
    const onDragEnd = useCallback(({ data }) => {
        // Just update the state directly
        setSections(data);
    }, []);

    // Memoize the content data to prevent re-renders
    const contentData = useMemo(() => {
        return activeTab === 'content' ? sections : [];
    }, [activeTab, sections]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <DraggableFlatList
                ref={flatListRef}
                data={contentData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onDragEnd={onDragEnd}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: 150 }
                ]}
                activationDistance={5}
                dragItemOverflow={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={21}
                removeClippedSubviews={false}
                initialNumToRender={10}
            />

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
        backgroundColor: '#fff',
    },
    statsContainer: {
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: 100,
    }
});

export default React.memo(Main);