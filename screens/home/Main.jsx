import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from './components/Header';
import QuickStatCard from './components/QuickStatCard';
import WebsiteCard from './components/WebsiteCard';
import ActivityItem from './components/ActivityItem';
import EmptyState from './components/EmptyState';
import BottomNavigation from './components/BottomNavigation';

const Main = () => {
  const navigation = useNavigation();
  const [websites, setWebsites] = useState([
    {
      id: '1',
      name: 'Design Portfolio',
      domain: 'design.oblien.com',
      visits: 1243,
      lastUpdated: '2 days ago',
      image: null,
      status: 'active'
    },
    {
      id: '2',
      name: 'Photography',
      domain: 'photo.oblien.com',
      visits: 856,
      lastUpdated: '1 week ago',
      image: null,
      status: 'active'
    },
    {
      id: '3',
      name: 'Personal Blog',
      domain: 'blog.oblien.com',
      visits: 432,
      lastUpdated: '3 days ago',
      image: null,
      status: 'draft'
    }
  ]);

  const [activeTab, setActiveTab] = useState('home');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fix for drawer navigation
  const openDrawer = () => {
    try {
      // Check if drawer navigation exists
      if (navigation && typeof navigation.openDrawer === 'function') {
        navigation.openDrawer();
      } else {
        // Temporary solution for development - show menu options in an alert
        Alert.alert(
          "Menu",
          "Drawer navigation not available. Select an option:",
          [
            { text: "Home", onPress: () => console.log("Home pressed") },
            { text: "My Websites", onPress: () => console.log("My Websites pressed") },
            { text: "Settings", onPress: () => console.log("Settings pressed") },
            { text: "Cancel", style: "cancel" }
          ]
        );
        console.log("Navigation drawer not available - showing alert instead");
      }
    } catch (error) {
      console.error("Error opening drawer:", error);
    }
  };

  const handleWebsitePress = (website) => {
    // Navigate to the website dashboard with the website data
    navigation.navigate('WebsiteDashboard', {
      websiteId: website.id,
      websiteName: website.name,
      websiteDomain: website.domain,
      websiteStatus: website.status
    });
  };

  const handleCreateNew = () => {
    // Navigate to create new website flow
    navigation.navigate('SetupSite');
    // navigation.navigate('OnboardingWelcome');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Header openDrawer={openDrawer} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
      >
        <View style={styles.topContent}>
          {/* Page Title */}
          <View style={styles.pageTitle}>
            <Text style={styles.pageTitleText}>Your Mini-Websites</Text>
            <Text style={styles.pageSubtitleText}>Manage all your online presence in one place</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickStatsContainer}
              decelerationRate="fast"
              snapToInterval={132} // Width of card + margin
            >
              <QuickStatCard
                title="Total Visits"
                value="2.5k"
                color="#000"
                icon={require('../../assets/icons/home/eye 2-17-1691989638.png')}
              />
              <QuickStatCard
                title="Messages"
                value="12"
                color="#000"
                icon={require('../../assets/icons/menu-bottom/email-76-1659689482.png')}
              />
              <QuickStatCard
                title="Websites"
                value={websites.length.toString()}
                color="#000"
                icon={require('../../assets/icons/home/website code-61-1658431404.png')}
              />
            </ScrollView>
          </View>
        </View>

        <View
          style={styles.content}
        >
          {/* Websites List */}
          <View style={styles.websitesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Websites</Text>
              <TouchableOpacity onPress={handleCreateNew}>
                <Text style={styles.sectionAction}>Create New</Text>
              </TouchableOpacity>
            </View>

            {websites.length > 0 ? (
              <View style={styles.websitesList}>
                {websites.map((website, index) => (
                  <WebsiteCard
                    key={website.id}
                    index={index}
                    item={website}
                    onPress={handleWebsitePress}
                  />
                ))}
              </View>
            ) : (
              <EmptyState onCreateNew={handleCreateNew} />
            )}
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityCard}>
              <ActivityItem
                title="New visitor on Design Portfolio"
                time="10 minutes ago"
                color="#000"
              />

              <ActivityItem
                title="New message from John Doe"
                time="2 hours ago"
                color="#000"
              />

              <ActivityItem
                title="Photography website updated"
                time="Yesterday"
                color="#000"
              />
            </View>
          </View>

          {/* Extra padding for bottom navigation */}
          <View style={styles.bottomPadding} />
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateNew={handleCreateNew}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 200,
    paddingTop: 120,
  },
  pageTitle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
  },
  pageSubtitleText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '300',
    marginTop: 5,
  },
  quickStats: {
    paddingBottom: 0,
    // paddingTop: 10,
    backgroundColor: '#fff',
    zIndex: 999
  },
  quickStatsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  websitesSection: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000',
  },
  sectionAction: {
    fontSize: 14,
    color: '#000',
    fontWeight: '300',
  },
  websitesList: {
    marginBottom: 20,
  },
  activitySection: {
    padding: 20,
    paddingTop: 10,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomPadding: {
    height: 100,
  },
});

export default Main;
