import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ActivityItem = ({ title, time, color }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <View style={styles.timelineContainer}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View style={styles.timeline} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <View style={styles.moreIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  timeline: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  moreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  moreIcon: {
    width: 12,
    height: 2,
    backgroundColor: '#000',
    opacity: 0.6,
    borderRadius: 1,
  },
});

export default ActivityItem; 