import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const QuickStatCard = ({ title, value, color, onPress, icon }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          {icon ? (
            <Image source={icon} style={[styles.icon]} />
          ) : (
            <View style={[styles.iconPlaceholder, { backgroundColor: '#fff' }]} />
          )}
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.value, { color }]} numberOfLines={1}>{value}</Text>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 135,
    height: 80,
    borderRadius: 16,
    marginRight: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconBackground: {
    width: 30,
    height: 30,
    borderRadius: 28,
    // backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#000',
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
  },
});

export default QuickStatCard; 