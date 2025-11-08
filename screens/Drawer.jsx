import React, { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

// Custom Drawer Content for Medical Research Agent
const CustomDrawerContent = (props) => {
  const [activeChat, setActiveChat] = useState(null);
  const insets = useSafeAreaInsets();

  // Use the useDrawerStatus hook to check if drawer is open
  const isDrawerOpen = useDrawerStatus() === 'open';

  // Update StatusBar only when drawer open/close state changes
  useEffect(() => {
    StatusBar.setBarStyle(isDrawerOpen ? 'light-content' : 'dark-content');
  }, [isDrawerOpen]);

  const handleNewChat = () => {
    setActiveChat(null);
    props.navigation.closeDrawer();
    // TODO: Start new chat
    console.log('Starting new chat...');
  };

  const handleChatPress = (chatId) => {
    setActiveChat(chatId);
    // TODO: Load the selected chat
    console.log('Loading chat:', chatId);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logging out...');
  };

  // Mock chat data - simple list
  const chats = [
    { id: 1, title: 'Cardiovascular Disease Research', date: 'Today' },
    { id: 2, title: 'Diabetes Treatment Options', date: 'Yesterday' },
    { id: 3, title: 'Cancer Immunotherapy Studies', date: 'Nov 4' },
    { id: 4, title: 'Mental Health Research', date: 'Nov 3' },
    { id: 5, title: 'Vaccine Development Process', date: 'Nov 2' },
    { id: 6, title: 'Neurological Disorders', date: 'Nov 1' },
    { id: 7, title: 'Infectious Disease Treatment', date: 'Oct 31' },
    { id: 8, title: 'Genetic Research Methods', date: 'Oct 30' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Logo and New Chat */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Hekai Research</Text>
        </View>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Text style={styles.newChatIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Chat History */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={[
              styles.chatItem,
              activeChat === chat.id && styles.activeChatItem
            ]}
            onPress={() => handleChatPress(chat.id)}
          >
            <Text
              style={[
                styles.chatTitle,
                activeChat === chat.id && styles.activeChatTitle
              ]}
              numberOfLines={1}
            >
              {chat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    width: 32,
    height: 32,
    tintColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
    marginLeft: 12,
  },
  newChatButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  activeChatItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  chatTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeChatTitle: {
    color: '#fff',
  },
  bottomSection: {
    paddingBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 10,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default memo(CustomDrawerContent);