import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const WebsiteCard = ({ item, onPress, index }) => {
  const { name, domain, visits, status, image } = item;

  // Get status color and label
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { color: '#1DD1A1', label: 'Active' };
      case 'draft':
        return { color: '#FFC312', label: 'Draft' };
      case 'inactive':
        return { color: '#FF6B81', label: 'Inactive' };
      default:
        return { color: '#A0A0A0', label: 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo(status || 'unknown');

  // Generate a random color for the image placeholder
  const getRandomColor = () => {
    const colors = [
      '#5352ED', // Bright blue
      '#FF6B81', // Pink
      '#1DD1A1', // Green
      '#FFC312', // Yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.95}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.imageContainer,
            !image && { backgroundColor: getRandomColor() }
          ]}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholderText}>{name?.charAt(0)}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.domain} numberOfLines={1}>{domain}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Image
                source={require('../../../assets/icons/home/eye 3-18-1691989638.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>{visits}</Text>
              <Text style={styles.statLabel}>visits</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusInfo.color }
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: statusInfo.color }
                ]}
              >
                {statusInfo.label}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={require('../../../assets/icons/home/info menu-42-1661490994.png')}
            style={styles.moreIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  domain: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
    tintColor: '#000',
    opacity: 0.7,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 10,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginRight: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    width: 18,
    height: 18,
    tintColor: '#000',
    opacity: 0.7,
  },
});

export default WebsiteCard; 