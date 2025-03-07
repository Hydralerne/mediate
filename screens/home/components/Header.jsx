import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import Logo from '../../../components/global/Logo';
import { BlurView } from 'expo-blur';
import TintBlur from './TintBlur';
import { useNavigation } from '@react-navigation/native';

// Custom water drop component
const WaterDrop = () => (
  <View style={styles.waterDropOuter}>
    <View style={styles.topCutoutContainer}>
      <View style={styles.topCutoutCircle} />
    </View>
    <View style={styles.bottomCutoutContainer}>
      <View style={styles.bottomCutoutCircle} />
    </View>
  </View>
);

const Header = ({  }) => {
  const navigation = useNavigation();
  
  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerOverlay}>
        <TintBlur
          direction="top"
          locations={[0.25, 0]}
          intensity={25}
          tint="light"
        />
      </View>
      <View style={styles.menuButtonContainer}>
        <WaterDrop />
        <TouchableOpacity
          onPress={openDrawer}
          style={styles.menuButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../../assets/icons/home/Sidebar_Open_hGpIRTtDgNVNHZFiCBtOIzMLaxazlZbXIqsa.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Logo width={50} height={35} color="#000" />
      </View>

      <TouchableOpacity
        style={styles.notificationButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={require('../../../assets/icons/menu-bottom/ringtone-122-1658234612.png')}
          style={styles.notificationIcon}
          resizeMode="contain"
        />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    minHeight: 60,
    paddingTop: 60,
    paddingBottom: 45,
    position: 'absolute',
    width: '100%',
    zIndex: 99
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  waterDropOuter: {
    position: 'absolute',
    left: -100, // Extend to the left edge
    width: 140, // Total width including the button
    height: 45,
    backgroundColor: '#000',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2.5,
    zIndex: 2,
  },
  topCutoutContainer: {
    position: 'absolute',
    top: -20, // Move up to create a cutout effect
    left: 50, // Center the circle
    width: 70,
    height: 20,
    backgroundColor: 'tramsparent',
    overflow: 'hidden',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  topCutoutCircle: {
    width: 150,
    height: 100,
    borderRadius: 150,
    borderWidth: 30,
    marginBottom: 10,
    bottom: -40,
    position: 'absolute',
    borderColor: '#000',
    backgroundColor: 'rgba(0,0,0,0)', // Transparent inside
  },
  bottomCutoutContainer: {
    position: 'absolute',
    top: -45, // Move up to create a cutout effect
    left: 50, // Center the circle
    width: 70,
    height: 107,
    backgroundColor: 'tramsparent',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bottomCutoutCircle: {
    width: 150,
    height: 100,
    borderRadius: 150,
    borderWidth: 30,
    marginTop: 60,
    position: 'absolute',
    borderColor: '#000',
    backgroundColor: 'rgba(0,0,0,0)', // Transparent inside
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 9,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default Header;
