import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Image, 
    TouchableOpacity, 
    FlatList,
    Dimensions
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../utils/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_MARGIN = 5;
const ITEM_WIDTH = (SCREEN_WIDTH - 40 - (COLUMN_COUNT - 1) * ITEM_MARGIN * 2) / COLUMN_COUNT;

const TldSelectorSheet = ({ onSelect, selectedTld, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('popular');
    
    // TLD categories
    const categories = [
        { id: 'popular', name: 'Popular' },
        { id: 'country', name: 'Country' },
        { id: 'business', name: 'Business' },
        { id: 'tech', name: 'Tech' },
        { id: 'creative', name: 'Creative' },
        { id: 'other', name: 'Other' }
    ];
    
    // Sample TLD data - in a real app, this would be a much larger list
    const allTlds = [
        // Popular
        { tld: 'com', price: 12, category: 'popular' },
        { tld: 'net', price: 12, category: 'popular' },
        { tld: 'org', price: 12, category: 'popular' },
        { tld: 'io', price: 40, category: 'popular' },
        { tld: 'co', price: 25, category: 'popular' },
        { tld: 'me', price: 10, category: 'popular' },
        
        // Country
        { tld: 'us', price: 10, category: 'country' },
        { tld: 'uk', price: 15, category: 'country' },
        { tld: 'ca', price: 15, category: 'country' },
        { tld: 'au', price: 15, category: 'country' },
        { tld: 'de', price: 15, category: 'country' },
        { tld: 'fr', price: 15, category: 'country' },
        { tld: 'jp', price: 40, category: 'country' },
        
        // Business
        { tld: 'biz', price: 12, category: 'business' },
        { tld: 'company', price: 15, category: 'business' },
        { tld: 'inc', price: 40, category: 'business' },
        { tld: 'llc', price: 30, category: 'business' },
        { tld: 'shop', price: 25, category: 'business' },
        { tld: 'store', price: 25, category: 'business' },
        
        // Tech
        { tld: 'app', price: 15, category: 'tech' },
        { tld: 'dev', price: 15, category: 'tech' },
        { tld: 'tech', price: 40, category: 'tech' },
        { tld: 'ai', price: 80, category: 'tech' },
        { tld: 'cloud', price: 20, category: 'tech' },
        { tld: 'code', price: 35, category: 'tech' },
        
        // Creative
        { tld: 'design', price: 40, category: 'creative' },
        { tld: 'art', price: 15, category: 'creative' },
        { tld: 'photo', price: 25, category: 'creative' },
        { tld: 'studio', price: 25, category: 'creative' },
        { tld: 'blog', price: 20, category: 'creative' },
        
        // Other (just a few examples)
        { tld: 'xyz', price: 10, category: 'other' },
        { tld: 'life', price: 25, category: 'other' },
        { tld: 'world', price: 25, category: 'other' },
        { tld: 'live', price: 20, category: 'other' },
        { tld: 'online', price: 15, category: 'other' },
        // ... many more would be added in a real app
    ];
    
    // Filter TLDs based on search and category
    const filteredTlds = allTlds.filter(item => {
        const matchesSearch = searchQuery === '' || 
            item.tld.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || 
            item.category === activeCategory;
        
        return matchesSearch && matchesCategory;
    });

    const handleSelectTld = useCallback((tld) => {
        if (onSelect && typeof onSelect === 'function') {
            onSelect(tld);
        }
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    }, [onSelect, onClose]);

    const handleCategoryPress = useCallback((categoryId) => {
        setActiveCategory(categoryId);
    }, []);

    // TLD item component for the grid
    const TldItem = useCallback(({ item }) => (
        <TouchableOpacity 
            style={[
                styles.tldItem,
                selectedTld === item.tld && styles.selectedTldItem
            ]}
            onPress={() => handleSelectTld(item.tld)}
            activeOpacity={0.7}
        >
            <Text style={styles.tldItemText}>.{item.tld}</Text>
            <Text style={styles.tldItemPrice}>${item.price}/year</Text>
            
            {selectedTld === item.tld && (
                <View style={styles.selectedIndicator}>
                    <Image 
                        source={require('../../assets/icons/home/check circle-3-1660219236.png')} 
                        style={styles.checkIcon} 
                    />
                </View>
            )}
        </TouchableOpacity>
    ), [selectedTld, handleSelectTld]);

    const keyExtractor = useCallback((item) => item.tld, []);
    
    const renderCategoryButton = useCallback(({ item }) => (
        <TouchableOpacity 
            key={item.id}
            style={[
                styles.categoryButton, 
                activeCategory === item.id && styles.activeCategoryButton
            ]}
            onPress={() => handleCategoryPress(item.id)}
            activeOpacity={0.7}
        >
            <Text style={[
                styles.categoryText,
                activeCategory === item.id && styles.activeCategoryText
            ]}>{item.name}</Text>
        </TouchableOpacity>
    ), [activeCategory, handleCategoryPress]);
    
    return (
        <ScrollView 
            style={styles.mainScrollView}
            contentContainerStyle={styles.mainScrollViewContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Select Domain Extension</Text>
                <TouchableOpacity 
                    onPress={() => {
                        if (onClose && typeof onClose === 'function') {
                            onClose();
                        }
                    }} 
                    style={styles.closeButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                    <Image 
                        source={require('../../assets/icons/home/chevron down-4-1696832126.png')} 
                        style={styles.closeIcon} 
                    />
                </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
                <Image 
                    source={require('../../assets/icons/menu-bottom/search-123-1658435124.png')} 
                    style={styles.searchIcon} 
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search from 1000+ domain extensions..."
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery !== '' && (
                    <TouchableOpacity 
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <Image 
                            source={require('../../assets/icons/home/close remove-802-1662363936.png')} 
                            style={styles.clearIcon} 
                        />
                    </TouchableOpacity>
                )}
            </View>
            
            {/* Category selector */}
            <View style={styles.categoriesWrapper}>
                <FlatList
                    data={[{ id: 'all', name: 'All' }, ...categories]}
                    renderItem={renderCategoryButton}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                />
            </View>
            
            {/* Main content */}
            <View style={styles.contentContainer}>
                {filteredTlds.length > 0 ? (
                    <FlatList
                        data={filteredTlds}
                        keyExtractor={keyExtractor}
                        renderItem={TldItem}
                        numColumns={COLUMN_COUNT}
                        contentContainerStyle={styles.tldListContainer}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={15}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        removeClippedSubviews={true}
                        scrollEnabled={false}
                        nestedScrollEnabled={true}
                    />
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Image 
                            source={require('../../assets/icons/menu-bottom/search-123-1658435124.png')} 
                            style={styles.noResultsIcon} 
                        />
                        <Text style={styles.noResultsText}>No matching TLDs found</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainScrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainScrollViewContent: {
        paddingBottom: 30,
        paddingHorizontal: 5
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightBorder,
        position: 'relative',
        marginHorizontal: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
    },
    closeIcon: {
        width: 24,
        height: 24,
        tintColor: '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightBorder,
        borderRadius: 12,
        margin: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(0,0,0,0.4)',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#000',
    },
    clearButton: {
        padding: 5,
    },
    clearIcon: {
        width: 16,
        height: 16,
        tintColor: 'rgba(0,0,0,0.4)',
    },
    categoriesWrapper: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightBorder,
    },
    categoriesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignItems: 'center',
    },
    categoryButton: {
        backgroundColor: colors.lightBorder,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeCategoryButton: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.7)',
    },
    activeCategoryText: {
        color: '#000',
    },
    contentContainer: {
        paddingTop: 10,
    },
    tldListContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    tldItem: {
        width: ITEM_WIDTH,
        margin: ITEM_MARGIN,
        padding: 12,
        backgroundColor: colors.lightBorder,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        position: 'relative',
    },
    selectedTldItem: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    tldItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
        textAlign: 'center',
    },
    tldItemPrice: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
        textAlign: 'center',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    checkIcon: {
        width: 20,
        height: 20,
    },
    noResultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    noResultsIcon: {
        width: 40,
        height: 40,
        tintColor: 'rgba(0,0,0,0.3)',
        marginBottom: 15,
    },
    noResultsText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.5)',
    },
});

export default TldSelectorSheet; 