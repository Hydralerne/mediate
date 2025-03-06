import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
  StatusBar
} from 'react-native';
import colors from '../../utils/colors';

const { width } = Dimensions.get('window');

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color, isLarge = false }) => {
  return (
    <View style={[
      styles.statCard, 
      isLarge ? styles.largeStatCard : styles.smallStatCard
    ]}>
      <View style={styles.statCardContent}>
        <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
          {/* <Image source={require('../../assets/icons/dashboard/visitors.png')} style={[styles.statIcon, { tintColor: color }]} /> */}
          <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

// Content Section Card Component
const ContentSectionCard = ({ title, status, lastUpdated, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.sectionCard} onPress={onPress}>
      <View style={styles.sectionCardContent}>
        <View style={[styles.sectionIconContainer, { backgroundColor: `${color}15` }]}>
          {/* <Image source={require('../../assets/icons/dashboard/portfolio.png')} style={[styles.sectionIcon, { tintColor: color }]} /> */}
          <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
        </View>
        <View style={styles.sectionInfo}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionStatus}>{status}</Text>
          <Text style={styles.sectionLastUpdated}>Last updated: {lastUpdated}</Text>
        </View>
        <View style={styles.sectionAction}>
          {/* <Image source={require('../../assets/icons/dashboard/chevron-right.png')} style={styles.chevronIcon} /> */}
          <View style={styles.chevronPlaceholder} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Recent Activity Item Component
const ActivityItem = ({ title, description, time, icon, color }) => {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: `${color}15` }]}>
        {/* <Image source={require('../../assets/icons/dashboard/activity.png')} style={[styles.activityIcon, { tintColor: color }]} /> */}
        <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription}>{description}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ title, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <View style={[styles.quickActionIconContainer, { backgroundColor: `${color}15` }]}>
        {/* <Image source={require('../../assets/icons/dashboard/edit.png')} style={[styles.quickActionIcon, { tintColor: color }]} /> */}
        <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Animation for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.3, 1],
    extrapolate: 'clamp'
  });
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Alex Johnson</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            {/* <Image source={require('../../assets/icons/dashboard/notification.png')} style={styles.notificationIcon} /> */}
            <View style={styles.notificationIconPlaceholder} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
          Dashboard
        </Animated.Text>
      </Animated.View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard 
              title="Profile Views" 
              value="12.5k" 
              subtitle="+8.2% from last week"
              color="#3B82F6" 
              isLarge={true}
            />
            <View style={styles.statsColumn}>
              <StatCard 
                title="Engagement" 
                value="68%" 
                color="#10B981"
              />
              <StatCard 
                title="Link Clicks" 
                value="843" 
                color="#F59E0B"
              />
            </View>
          </View>
        </View>
        
        {/* Content Sections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Content</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Manage All</Text>
            </TouchableOpacity>
          </View>
          
          <ContentSectionCard 
            title="About Me" 
            status="Active" 
            lastUpdated="2 days ago" 
            color="#3B82F6" 
            onPress={() => console.log('Edit About Me')}
          />
          
          <ContentSectionCard 
            title="Portfolio Showcase" 
            status="Active • 12 projects" 
            lastUpdated="1 week ago" 
            color="#10B981" 
            onPress={() => console.log('Edit Portfolio')}
          />
          
          <ContentSectionCard 
            title="Services" 
            status="Inactive" 
            lastUpdated="Not configured" 
            color="#F59E0B" 
            onPress={() => console.log('Configure Services')}
          />
          
          <ContentSectionCard 
            title="Blog Posts" 
            status="Active • 5 posts" 
            lastUpdated="3 days ago" 
            color="#8B5CF6" 
            onPress={() => console.log('Edit Blog')}
          />
        </View>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton 
              title="Add Project" 
              color="#3B82F6" 
              onPress={() => console.log('Add Project')}
            />
            <QuickActionButton 
              title="New Post" 
              color="#10B981" 
              onPress={() => console.log('New Post')}
            />
            <QuickActionButton 
              title="Edit Profile" 
              color="#F59E0B" 
              onPress={() => console.log('Edit Profile')}
            />
            <QuickActionButton 
              title="Share" 
              color="#8B5CF6" 
              onPress={() => console.log('Share Profile')}
            />
          </View>
        </View>
        
        {/* Domain Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Domain Status</Text>
          <View style={styles.domainCard}>
            <View style={styles.domainHeader}>
              <View>
                <Text style={styles.domainTitle}>alexjohnson.com</Text>
                <View style={styles.domainStatusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.domainStatus}>Active</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.domainManageButton}>
                <Text style={styles.domainManageText}>Manage</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.domainInfoRow}>
              <View style={styles.domainInfoItem}>
                <Text style={styles.domainInfoLabel}>Renewal Date</Text>
                <Text style={styles.domainInfoValue}>May 12, 2024</Text>
              </View>
              <View style={styles.domainInfoItem}>
                <Text style={styles.domainInfoLabel}>Auto-Renewal</Text>
                <Text style={styles.domainInfoValue}>Enabled</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityContainer}>
            <ActivityItem 
              title="New Profile View" 
              description="Someone viewed your profile from San Francisco" 
              time="10 minutes ago" 
              color="#3B82F6"
            />
            <ActivityItem 
              title="Portfolio Click" 
              description="Your 'Web Design' project was viewed" 
              time="2 hours ago" 
              color="#10B981"
            />
            <ActivityItem 
              title="Contact Form" 
              description="John Smith submitted a contact form" 
              time="Yesterday" 
              color="#F59E0B"
            />
          </View>
        </View>
        
        {/* Subscription Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={styles.subscriptionPlan}>Pro Plan</Text>
                <Text style={styles.subscriptionPrice}>$19/month</Text>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionInfoText}>
                Your trial ends in <Text style={styles.highlightText}>10 days</Text>. 
                You won't be charged until <Text style={styles.highlightText}>May 24, 2023</Text>.
              </Text>
            </View>
            <View style={styles.subscriptionFeatures}>
              <View style={styles.subscriptionFeatureRow}>
                {/* <Image source={require('../../assets/icons/dashboard/check.png')} style={styles.checkIcon} /> */}
                <View style={styles.checkIconPlaceholder} />
                <Text style={styles.subscriptionFeatureText}>Advanced analytics</Text>
              </View>
              <View style={styles.subscriptionFeatureRow}>
                {/* <Image source={require('../../assets/icons/dashboard/check.png')} style={styles.checkIcon} /> */}
                <View style={styles.checkIconPlaceholder} />
                <Text style={styles.subscriptionFeatureText}>Unlimited content sections</Text>
              </View>
              <View style={styles.subscriptionFeatureRow}>
                {/* <Image source={require('../../assets/icons/dashboard/check.png')} style={styles.checkIcon} /> */}
                <View style={styles.checkIconPlaceholder} />
                <Text style={styles.subscriptionFeatureText}>Custom CSS</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('home')}
        >
          {/* <Image 
            source={require('../../assets/icons/dashboard/home.png')} 
            style={[styles.navIcon, activeTab === 'home' && styles.activeNavIcon]} 
          /> */}
          <View style={[styles.navIconPlaceholder, activeTab === 'home' && styles.activeNavIconPlaceholder]} />
          <Text style={[
            styles.navText, 
            activeTab === 'home' && styles.activeNavText
          ]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('analytics')}
        >
          {/* <Image 
            source={require('../../assets/icons/dashboard/analytics.png')} 
            style={[styles.navIcon, activeTab === 'analytics' && styles.activeNavIcon]} 
          /> */}
          <View style={[styles.navIconPlaceholder, activeTab === 'analytics' && styles.activeNavIconPlaceholder]} />
          <Text style={[
            styles.navText, 
            activeTab === 'analytics' && styles.activeNavText
          ]}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemCenter}>
          <View style={styles.navItemCenterButton}>
            {/* <Image 
              source={require('../../assets/icons/dashboard/plus.png')} 
              style={styles.navItemCenterIcon} 
            /> */}
            <View style={styles.navItemCenterIconPlaceholder} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('content')}
        >
          {/* <Image 
            source={require('../../assets/icons/dashboard/content.png')} 
            style={[styles.navIcon, activeTab === 'content' && styles.activeNavIcon]} 
          /> */}
          <View style={[styles.navIconPlaceholder, activeTab === 'content' && styles.activeNavIconPlaceholder]} />
          <Text style={[
            styles.navText, 
            activeTab === 'content' && styles.activeNavText
          ]}>Content</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('settings')}
        >
          {/* <Image 
            source={require('../../assets/icons/dashboard/settings.png')} 
            style={[styles.navIcon, activeTab === 'settings' && styles.activeNavIcon]} 
          /> */}
          <View style={[styles.navIconPlaceholder, activeTab === 'settings' && styles.activeNavIconPlaceholder]} />
          <Text style={[
            styles.navText, 
            activeTab === 'settings' && styles.activeNavText
          ]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerTitle: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBorder,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#000',
    opacity: 0.5,
    borderRadius: 4,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  statsSection: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 180,
  },
  statsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    justifyContent: 'center',
  },
  largeStatCard: {
    flex: 1,
  },
  smallStatCard: {
    height: 80,
  },
  statCardContent: {
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 4,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sectionStatus: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 4,
  },
  sectionLastUpdated: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  sectionAction: {
    padding: 5,
  },
  chevronPlaceholder: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  domainCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  domainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  domainStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  domainStatus: {
    fontSize: 14,
    color: '#10B981',
  },
  domainManageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.lightBorder,
    borderRadius: 12,
  },
  domainManageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  domainInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  domainInfoItem: {
    flex: 1,
  },
  domainInfoLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 4,
  },
  domainInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  activityDescription: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 5,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  subscriptionPrice: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  upgradeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  subscriptionInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  subscriptionInfoText: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.7)',
    lineHeight: 18,
  },
  highlightText: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  subscriptionFeatures: {
    marginTop: 5,
  },
  subscriptionFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  subscriptionFeatureText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    marginBottom: 4,
  },
  activeNavIconPlaceholder: {
    backgroundColor: '#000',
  },
  navText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  activeNavText: {
    color: '#000',
    fontWeight: '500',
  },
  navItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  navItemCenterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  navItemCenterIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    marginBottom: 4,
  },
}); 

export default CreatorDashboard;
