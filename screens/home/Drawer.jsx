import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Logo from '../../components/global/Logo';

// Custom Drawer Content
const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        style={styles.scrollView}
      >
        <View style={styles.userInfo}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>A</Text>
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex@example.com</Text>
            </View>
          </View>
          <View style={styles.UserDrawer} />
        </View>
  
        <ScrollView style={styles.drawerBody}>
          <TouchableOpacity
            style={[styles.drawerItem, styles.activeDrawerItem]}
            onPress={() => props.navigation.navigate('MainHome')}
          >
            <Image source={require('../../assets/icons/menu-bottom/home-83-1658433576.png')} style={styles.drawerItemIcon} />
            <Text style={[styles.drawerItemText, styles.activeDrawerItemText]}>Home</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate('Inbox')}
          >
            <Image source={require('../../assets/icons/menu-bottom/email-76-1659689482.png')} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Inbox</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.drawerItem}>
            <Image source={require('../../assets/icons/home/up graph-68-1666004410.png')} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Analytics</Text>
          </TouchableOpacity>
  
          <View style={styles.drawerDivider} />
  
          <TouchableOpacity style={styles.drawerItem}>
            <Image source={require('../../assets/icons/home/setting-40-1662364403.png')} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.drawerItem}>
            <Image source={require('../../assets/icons/home/server tree-89-1658435258.png')} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Domains Management</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.drawerItem}>
            <Image source={require('../../assets/icons/home/gem-116-1658434754.png')} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Subscription Plans</Text>
          </TouchableOpacity>
  
          <View style={styles.drawerDivider} />
  
          <TouchableOpacity style={styles.drawerItem}>
            <Image source={require('../../assets/icons/home/headphone-25-1663753435.png')} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Help & Support</Text>
          </TouchableOpacity>
        </ScrollView>
  
        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.logoutButton}>
            <Image source={require('../../assets/icons/home/Logout_mhmfL6IS7cl5oOy7mVS9ef30zvuPM1QYJiuX.png')} style={[styles.drawerItemIcon,{tintColor: '#FF4D4F'}]} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
  
          <View style={styles.drawerVersion}>
            <Logo width={20} height={15} color="#fff" />
            <Text style={styles.versionText}>Oblien v1.0.0</Text>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  };
  
  
  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: '#000',
    },
    UserDrawer: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      width: '100%',
      marginTop: 20,
    },
    drawerContent: {
      flex: 1,
    },
    drawerContainer: {
      flex: 1,
      position: 'relative',
    },
    drawerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userInfo: {
      paddingHorizontal: 10,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#3B82F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    userInitial: {
      fontSize: 20,
      fontWeight: '600',
      color: '#fff',
    },
    userTextContainer: {
      flexDirection: 'column',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    userEmail: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIconPlaceholder: {
      width: 14,
      height: 14,
      backgroundColor: '#fff',
    },
    drawerBody: {
      flex: 1,
      padding: 10,
      paddingTop: 20,
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 5,
      borderRadius: 10,
    },
    activeDrawerItem: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    drawerItemIcon: {
      width: 24,
      height: 24,
      tintColor: '#fff',
      marginRight: 15,
    },
    drawerItemIconPlaceholder: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginRight: 15,
    },
    activeIconPlaceholder: {
      backgroundColor: '#3B82F6',
    },
    drawerItemText: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    activeDrawerItemText: {
      color: '#fff',
      fontWeight: '500',
    },
    drawerDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginVertical: 15,
    },
    drawerFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoutIconPlaceholder: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#FF4D4F',
      marginRight: 10,
    },
    logoutText: {
      fontSize: 16,
      color: '#FF4D4F',
      fontWeight: '500',
    },
    drawerVersion: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    versionText: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.5)',
    },
  });
  

  export default CustomDrawerContent;