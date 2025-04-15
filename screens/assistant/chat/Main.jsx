import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../utils/colors';
import AIResponse from './AIResponse';

// Sample messages array for demonstration
const sampleMessages = [
    {
        id: '1',
        text: 'Hello! How can I help you today?',
        sender: 'ai',
    },
    {
        id: '2',
        text: 'I need help creating a website for my small business. Can you help me with that?',
        sender: 'user',
    },
    {
        id: '3',
        text: 'Of course! I can help you create a website for your small business. What kind of business do you have?',
        sender: 'ai',
    },
    {
        id: '4',
        text: 'I run a local bakery and want to showcase our products and let customers place orders online.',
        sender: 'user',
    },
    {
        id: '5',
        text: 'That sounds great! For a bakery website, we can include sections for your menu, pricing, location, contact information, and an online ordering system.\n\nHere\'s a sample structure:\n\n```html\n<header>\n  <nav>\n    <div class="logo">Bakery Name</div>\n    <ul>\n      <li>Home</li>\n      <li>Products</li>\n      <li>Order Online</li>\n      <li>Contact</li>\n    </ul>\n  </nav>\n</header>\n```\n\nAnd for your product showcase, you might want something like this:\n\n```javascript\nconst featuredProducts = [\n  {\n    name: "Sourdough Bread",\n    description: "Our signature sourdough with a crispy crust",\n    price: 6.99,\n    image: "sourdough.jpg"\n  },\n  {\n    name: "Chocolate Croissant",\n    description: "Buttery layers filled with rich chocolate",\n    price: 3.99,\n    image: "croissant.jpg"\n  }\n];\n\n// Then you can render these dynamically\nfunction renderProducts() {\n  return featuredProducts.map(product => (\n    <ProductCard key={product.name} product={product} />\n  ));\n}\n```',
        sender: 'ai',
    },
    {
        id: '6',
        text: 'Yes, that would be very helpful!',
        sender: 'user',
    }
];

// User message component - simple bubble with text
const UserMessage = ({ message }) => {
    return (
        <View style={styles.userMessageContainer}>
            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                    {message.text}
                </Text>
            </View>
        </View>
    );
};

const Main = ({ messages = sampleMessages, scrollViewRef }) => {
    const insets = useSafeAreaInsets();

    const renderMessage = ({ item }) => {
        if (item.sender === 'user') {
            return <UserMessage message={item} />;
        } else {
            return <AIResponse message={item} />;
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <FlatList
                ref={scrollViewRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => item.id || `msg-${index}`}
                contentContainerStyle={styles.chatContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No messages yet</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || '#000',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    chatContainer: {
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 60, // Extra space for input area
    },
    // User message styles
    userMessageContainer: {
        marginBottom: 16,
        maxWidth: '80%',
        alignSelf: 'flex-end',
    },
    messageBubble: {
        borderRadius: 18,
        padding: 14,
        backgroundColor: colors.secoundBackground || '#2C2C2E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#fff',
        letterSpacing: 0.2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: 300,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
    },
});

export default Main;
