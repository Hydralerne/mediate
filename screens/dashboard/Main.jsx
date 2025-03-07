import React, { useState, useRef } from 'react';
import { 
    View, 
    StyleSheet, 
    StatusBar,
    Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { BlurView } from 'expo-blur';
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
import AddSectionModal from './components/AddSectionModal';

// Import constants and data
import { SECTION_TYPES, INITIAL_SECTIONS } from './contents/sectionData';

const { width } = Dimensions.get('window');

const Main = () => {
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { websiteId, websiteName, websiteDomain } = route.params || { 
        websiteId: '1', 
        websiteName: 'My Website',
        websiteDomain: 'mywebsite.oblien.com'
    };
    
    const flatListRef = useRef(null);
    
    // State
    const [sections, setSections] = useState(INITIAL_SECTIONS);
    const [stats, setStats] = useState({
        visitors: 245,
        interactions: 56,
        messages: 12
    });
    const [isDragging, setIsDragging] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('content'); // 'content', 'header', 'social'
    
    // Handlers
    const toggleSectionActive = (sectionId) => {
        setSections(sections.map(section => 
            section.id === sectionId 
                ? {...section, active: !section.active} 
                : section
        ));
    };
    
    const handleAddSection = () => {
        setAddModalVisible(true);
    };
    
    const handleAddNewSection = (sectionData) => {
        const newSection = {
            id: `section-${Date.now()}`,
            ...sectionData,
            active: true,
            items: []
        };
        
        setSections([...sections, newSection]);
        setAddModalVisible(false);
    };
    
    const handleEditSection = (sectionId, newData) => {
        setSections(sections.map(section => 
            section.id === sectionId 
                ? {...section, ...newData} 
                : section
        ));
    };
    
    const handleDeleteSection = (sectionId) => {
        setSections(sections.filter(section => section.id !== sectionId));
    };
    
    const handleAddItem = (sectionId, newItem) => {
        setSections(sections.map(section => 
            section.id === sectionId 
                ? {
                    ...section, 
                    items: [...section.items, newItem]
                  } 
                : section
        ));
    };
    
    const handlePreviewWebsite = () => {
        // Logic to preview website
    };
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Scroll to top when tab changes
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };
    
    const renderItem = ({ item, drag, isActive }) => (
        <ContentSection 
            section={item}
            onToggleActive={() => toggleSectionActive(item.id)}
            onEdit={(data) => handleEditSection(item.id, data)}
            onDelete={() => handleDeleteSection(item.id)}
            onAddItem={(newItem) => handleAddItem(item.id, newItem)}
            drag={drag}
            isActive={isActive}
        />
    );
    
    const ListHeaderComponent = () => (
        <>
            <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
                <Header 
                    websiteName={websiteName}
                    websiteDomain={websiteDomain}
                    onShare={() => {}} 
                    onSettings={() => {}} 
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
            
            <ContentHeader />
            
            {activeTab === 'header' && <HeaderTab />}
            {activeTab === 'social' && <SocialTab />}
        </>
    );
    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <DraggableFlatList
                ref={flatListRef}
                data={activeTab === 'content' ? sections : []}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onDragBegin={() => setIsDragging(true)}
                onDragEnd={({ data }) => {
                    setSections(data);
                    setIsDragging(false);
                }}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: 100 }
                ]}
            />
            
            <BottomActions 
                onAddContent={handleAddSection}
                onPreview={handlePreviewWebsite}
            />
            
            <AddSectionModal 
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAdd={handleAddNewSection}
                sectionTypes={SECTION_TYPES}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
    },
    statsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: 100,
    },
});

export default Main;