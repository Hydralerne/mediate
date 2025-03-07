import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EmptyState = ({ onCreateNew }) => (
  <View style={styles.emptyStateContainer}>
    <View style={styles.emptyStateImagePlaceholder} />
    <Text style={styles.emptyStateTitle}>No websites yet</Text>
    <Text style={styles.emptyStateDescription}>
      Create your first mini-website to showcase your work and connect with your audience.
    </Text>
    <TouchableOpacity style={styles.emptyStateButton} onPress={onCreateNew}>
      <Text style={styles.emptyStateButtonText}>Create Website</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  emptyStateContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  emptyStateImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmptyState; 