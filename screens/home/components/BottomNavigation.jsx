import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TintBlur from './TintBlur';

const { width } = Dimensions.get('window');

const BottomNavigation = ({ activeTab, setActiveTab, onCreateNew }) => {
  const insets = useSafeAreaInsets();

  // Animation references
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animate the create button when tab changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    Animated.timing(rotateAnim, {
      toValue: rotateAnim._value + 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  // Interpolate rotation for the create button
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[
      styles.container,
      { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10 }
    ]}>
      {/* Using our reusable TintBlur component */}
      <View style={styles.blurContainer}>
        <TintBlur 
          direction="bottom" 
          locations={[0, 0.25]} 
          intensity={25} 
          tint="light" 
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'home' && styles.activeTabItem]}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Image
              source={activeTab === 'home' ?
                 require('../../../assets/icons/menu-bottom/home-21-1663076191.png') : 
                require('../../../assets/icons/menu-bottom/home-83-1658433576.png')}
              style={[
                styles.tabIcon,
                { tintColor: activeTab === 'home' ? '#000' : 'rgba(0,0,0,0.3)' }
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'inbox' && styles.activeTabItem]}
            onPress={() => setActiveTab('inbox')}
            activeOpacity={0.7}
          >
            <Image
              source={
                activeTab === 'inbox' ?
                  require('../../../assets/icons/menu-bottom/email-36-1660810114.png') :
                  require('../../../assets/icons/menu-bottom/email-76-1659689482.png')
              }
              style={styles.tabIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabText, activeTab === 'inbox' && styles.activeTabText]}>Inbox</Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.createButtonContainer,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: spin }
              ]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateNew}
            activeOpacity={0.9}
          >
            <Image source={require('../../../assets/icons/home/plus 4-12-1662493809.png')} style={styles.createButtonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  createButtonIcon: {
    width: 30,
    tintColor: '#fff',
    height: 30,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  blurContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: -1,
  },
  content: {
    marginHorizontal: 20,
    height: 70,
    position: 'relative',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    paddingHorizontal: width * 0.1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 20,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: 'rgba(0,0,0,1)',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  createButtonContainer: {
    position: 'absolute',
    top: -25,
    left: '50%',
    marginLeft: -30,
    zIndex: 10,
  },
  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BottomNavigation; 