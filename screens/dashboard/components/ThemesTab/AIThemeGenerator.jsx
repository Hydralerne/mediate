import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AIThemeGenerator = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <Text style={styles.cardTitle}>AI Theme Creator</Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonBadgeText}>Coming Soon</Text>
        </View>
      </View>
      
      <Text style={styles.cardDescription}>
        Create professional website themes through natural voice conversations with our AI assistant.
      </Text>
      
      <View style={styles.aiDemo}>
        <View style={styles.aiConversationContainer}>
          <View style={styles.userMessage}>
            <Text style={styles.messageText}>
              "Create a modern portfolio theme with blue accents"
            </Text>
          </View>
          <View style={styles.aiResponse}>
            <Ionicons name="sparkles" size={16} color="#007AFF" style={styles.sparkleIcon} />
            <Text style={styles.responseText}>
              "I've designed a clean portfolio with a navy/cyan color scheme and minimalist layout"
            </Text>
          </View>
        </View>
        
        <View style={styles.voiceModeContainer}>
          <View style={styles.voiceIconContainer}>
            <Ionicons name="mic-outline" size={28} color="#007AFF" />
          </View>
          <Text style={styles.voiceModeText}>Voice Mode</Text>
          <Text style={styles.voiceModeDescription}>Just speak to design your website</Text>
        </View>
      </View>
      
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="grid-outline" size={18} color="#007AFF" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureName}>Custom Layouts</Text>
            <Text style={styles.featureDescription}>Generate professionally designed page layouts</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="color-palette-outline" size={18} color="#007AFF" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureName}>Brand-Matched Themes</Text>
            <Text style={styles.featureDescription}>Colors and styling that align with your brand identity</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="text-outline" size={18} color="#007AFF" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureName}>Typography Systems</Text>
            <Text style={styles.featureDescription}>Consistent font pairings for headings and body text</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.comingSoonButton} activeOpacity={0.8}>
        <Ionicons name="notifications-outline" size={18} color="#fff" style={styles.notifyIcon} />
        <Text style={styles.comingSoonButtonText}>Notify me when available</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  comingSoonBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  comingSoonBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  aiDemo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  aiConversationContainer: {
    padding: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 13,
    color: '#333',
  },
  aiResponse: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f4ff',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sparkleIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  responseText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  voiceModeContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#f5f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 16,
  },
  voiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  voiceModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  voiceModeDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  featureList: {
    marginBottom: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  comingSoonButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyIcon: {
    marginRight: 8,
  },
  comingSoonButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AIThemeGenerator; 