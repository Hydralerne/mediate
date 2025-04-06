import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// NavigationPreview component to visualize different navigation styles
const NavigationPreview = ({ navStyle, backgroundColor, textColor, showIcons = true }) => {
  
  // Common menu items to demonstrate scrolling with many items
  const menuItems = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'About', icon: 'information-circle-outline' },
    { name: 'Services', icon: 'briefcase-outline' },
    { name: 'Products', icon: 'cube-outline' },
    { name: 'Portfolio', icon: 'images-outline' },
    { name: 'Blog', icon: 'newspaper-outline' },
    { name: 'Contact', icon: 'mail-outline' },
    { name: 'FAQ', icon: 'help-circle-outline' }
  ];
  
  // Renders wireframe content lines instead of "Content Area" text
  const renderWireframeContent = () => (
    <View style={styles.wireframeContainer}>
      <View style={styles.wireframeLine} />
      <View style={[styles.wireframeLine, { width: '65%' }]} />
      <View style={[styles.wireframeLine, { width: '85%' }]} />
      <View style={[styles.wireframeLine, { width: '55%' }]} />
    </View>
  );
  
  // Render the bottom bar navigation style
  const renderBottomBar = () => (
    <View style={[styles.navContainer, { backgroundColor }]}>
      <View style={styles.siteContent}>
        {renderWireframeContent()}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bottomNavScroll}
        style={styles.bottomNavBar}
      >
        {menuItems.map((item, index) => (
          <View key={index} style={styles.bottomNavItem}>
            {showIcons && (
              <Ionicons name={item.icon} size={18} color={textColor} />
            )}
            <Text 
              style={[
                styles.bottomNavText, 
                { color: textColor },
                !showIcons && styles.bottomNavTextNoIcon
              ]}
            >
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
  // Render the top bar navigation style
  const renderTopBar = () => (
    <View style={[styles.navContainer, { backgroundColor }]}>
      <View style={styles.topNavBar}>
        <Text style={[styles.siteName, { color: textColor }]}>Site Title</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.topNavScroll}
        >
          {menuItems.slice(0, 6).map((item, index) => (
            <Text 
              key={index} 
              style={[
                styles.topNavText, 
                { color: textColor },
                index === 0 && styles.topNavTextActive
              ]}
            >
              {item.name}
            </Text>
          ))}
        </ScrollView>
      </View>
      <View style={styles.siteContent}>
        {renderWireframeContent()}
      </View>
    </View>
  );
  
  // Render the hamburger menu style
  const renderHamburger = () => (
    <View style={[styles.navContainer, { backgroundColor }]}>
      <View style={styles.hamburgerHeader}>
        <Text style={[styles.siteName, { color: textColor }]}>Site Title</Text>
        <Ionicons name="menu" size={20} color={textColor} />
      </View>
      <View style={styles.hamburgerContent}>
        <View style={[styles.hamburgerMenuOverlay, { backgroundColor: backgroundColor }]}>
          <View style={styles.hamburgerMenuItems}>
            {menuItems.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.hamburgerMenuItem}>
                <Ionicons name={item.icon} size={16} color={textColor} style={styles.hamburgerMenuIcon} />
                <Text style={[styles.hamburgerMenuText, { color: textColor }]}>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.siteContentWithMenu}>
          {renderWireframeContent()}
        </View>
      </View>
    </View>
  );
  
  // Render the appropriate navigation style based on the prop
  const renderNavigation = () => {
    switch (navStyle) {
      case 'bottomBar':
        return renderBottomBar();
      case 'topBar':
        return renderTopBar();
      case 'hamburger':
        return renderHamburger();
      default:
        return renderTopBar(); // Default to top bar
    }
  };
  
  return renderNavigation();
};

const styles = StyleSheet.create({
  navContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  // Top navigation styles
  topNavBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  topNavScroll: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  siteName: {
    fontWeight: '600',
    fontSize: 15,
    marginRight: 16,
  },
  topNavText: {
    marginLeft: 12,
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 2,
  },
  topNavTextActive: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  
  // Bottom navigation styles
  bottomNavBar: {
    maxHeight: 44,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bottomNavScroll: {
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  bottomNavItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44,
    minWidth: 60,
  },
  bottomNavText: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  bottomNavTextNoIcon: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 0,
  },
  
  // Hamburger menu styles
  hamburgerHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  hamburgerContent: {
    flex: 1,
    flexDirection: 'row',
  },
  hamburgerMenuOverlay: {
    width: 130,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  hamburgerMenuItems: {
    paddingHorizontal: 4,
  },
  hamburgerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  hamburgerMenuIcon: {
    marginRight: 8,
  },
  hamburgerMenuText: {
    fontSize: 12,
    fontWeight: '500',
  },
  siteContentWithMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Wireframe content
  wireframeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    width: '80%',
  },
  wireframeLine: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 10,
    borderRadius: 5,
  },
  
  // Shared styles
  siteContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(NavigationPreview); 