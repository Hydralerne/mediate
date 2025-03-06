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
const StatCard = ({ title, value, icon, color, isLarge = false }) => {
  return (
    <View style={[
      styles.statCard, 
      isLarge ? styles.largeStatCard : styles.smallStatCard
    ]}>
      <View style={styles.statCardContent}>
        <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
          {/* Replace with your icon */}
          {/* <Image source={require('../../assets/icons/dashboard/[icon-name].png')} style={[styles.statIcon, { tintColor: color }]} /> */}
          <Text style={[styles.iconPlaceholder, { color }]}>{icon}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );
};

// Action Button Component
const ActionButton = ({ title, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={[styles.actionIconContainer, { backgroundColor: `${color}15` }]}>
        {/* Replace with your icon */}
        {/* <Image source={require('../../assets/icons/dashboard/[icon-name].png')} style={[styles.actionIcon, { tintColor: color }]} /> */}
        <Text style={[styles.iconPlaceholder, { color }]}>{icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Recent Activity Item Component
const ActivityItem = ({ title, subtitle, time, icon, color }) => {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: `${color}15` }]}>
        {/* Replace with your icon */}
        {/* <Image source={require('../../assets/icons/dashboard/[icon-name].png')} style={[styles.activityIcon, { tintColor: color }]} /> */}
        <Text style={[styles.iconPlaceholder, { color }]}>{icon}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
};

// Project Card Component
const ProjectCard = ({ title, progress, daysLeft, color }) => {
  return (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{title}</Text>
        <View style={[styles.projectBadge, { backgroundColor: `${color}15` }]}>
          <Text style={[styles.projectBadgeText, { color }]}>{daysLeft} days left</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
      <View style={styles.projectFooter}>
        <View style={styles.teamContainer}>
          {/* Replace with your team member avatars */}
          <View style={[styles.teamAvatar, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.teamInitial}>A</Text>
          </View>
          <View style={[styles.teamAvatar, { backgroundColor: '#10B981' }]}>
            <Text style={styles.teamInitial}>B</Text>
          </View>
          <View style={[styles.teamAvatar, { backgroundColor: '#F59E0B' }]}>
            <Text style={styles.teamInitial}>C</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          {/* Replace with your icon */}
          {/* <Image source={require('../../assets/icons/dashboard/arrow-right.png')} style={styles.viewButtonIcon} /> */}
          <Text style={styles.iconPlaceholder}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ModernDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Animation for header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp'
  });
  
  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });
  
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -15],
    extrapolate: 'clamp'
  });
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View 
          style={[
            styles.headerContent, 
            { 
              opacity: headerOpacity,
              transform: [{ translateY: titleTranslateY }, { scale: titleScale }]
            }
          ]}
        >
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Alex Johnson</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            {/* Replace with your icon */}
            {/* <Image source={require('../../assets/icons/dashboard/bell.png')} style={styles.notificationIcon} /> */}
            <Text style={styles.iconPlaceholder}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
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
              title="Visitors" 
              value="12.5k" 
              icon="👥" 
              color="#3B82F6" 
              isLarge={true}
            />
            <View style={styles.statsColumn}>
              <StatCard 
                title="Revenue" 
                value="$2,450" 
                icon="💰" 
                color="#10B981"
              />
              <StatCard 
                title="Tasks" 
                value="18" 
                icon="✓" 
                color="#F59E0B"
              />
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <ActionButton 
              title="New Post" 
              icon="📝" 
              color="#3B82F6" 
              onPress={() => console.log('New Post')}
            />
            <ActionButton 
              title="Upload" 
              icon="⬆️" 
              color="#10B981" 
              onPress={() => console.log('Upload')}
            />
            <ActionButton 
              title="Analytics" 
              icon="📊" 
              color="#F59E0B" 
              onPress={() => console.log('Analytics')}
            />
            <ActionButton 
              title="Settings" 
              icon="⚙️" 
              color="#8B5CF6" 
              onPress={() => console.log('Settings')}
            />
          </View>
        </View>
        
        {/* Projects Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Projects</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectsContainer}
          >
            <ProjectCard 
              title="Website Redesign" 
              progress={75} 
              daysLeft={5} 
              color="#3B82F6"
            />
            <ProjectCard 
              title="Mobile App Development" 
              progress={45} 
              daysLeft={12} 
              color="#10B981"
            />
            <ProjectCard 
              title="Marketing Campaign" 
              progress={30} 
              daysLeft={20} 
              color="#F59E0B"
            />
          </ScrollView>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesContainer}>
            <ActivityItem 
              title="New Comment" 
              subtitle="Sarah commented on your latest post" 
              time="10 minutes ago" 
              icon="💬" 
              color="#3B82F6"
            />
            <ActivityItem 
              title="New Order" 
              subtitle="You received a new order for $125" 
              time="2 hours ago" 
              icon="🛒" 
              color="#10B981"
            />
            <ActivityItem 
              title="Contact Form" 
              subtitle="John Smith submitted a contact form" 
              time="Yesterday" 
              icon="📧" 
              color="#F59E0B"
            />
          </View>
        </View>
        
        {/* Performance Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceTitle}>This Month</Text>
              <TouchableOpacity style={styles.periodSelector}>
                <Text style={styles.periodText}>Last 30 Days</Text>
                {/* Replace with your icon */}
                {/* <Image source={require('../../assets/icons/dashboard/chevron-down.png')} style={styles.chevronIcon} /> */}
                <Text style={styles.iconPlaceholder}>▼</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.performanceStats}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>12.5k</Text>
                <Text style={styles.performanceLabel}>Visitors</Text>
                <View style={styles.performanceTrend}>
                  {/* Replace with your icon */}
                  {/* <Image source={require('../../assets/icons/dashboard/arrow-up.png')} style={[styles.trendIcon, { tintColor: '#10B981' }]} /> */}
                  <Text style={[styles.iconPlaceholder, { color: '#10B981' }]}>↑</Text>
                  <Text style={[styles.trendText, { color: '#10B981' }]}>8.2%</Text>
                </View>
              </View>
              
              <View style={styles.performanceDivider} />
              
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>$4,320</Text>
                <Text style={styles.performanceLabel}>Revenue</Text>
                <View style={styles.performanceTrend}>
                  {/* Replace with your icon */}
                  {/* <Image source={require('../../assets/icons/dashboard/arrow-up.png')} style={[styles.trendIcon, { tintColor: '#10B981' }]} /> */}
                  <Text style={[styles.iconPlaceholder, { color: '#10B981' }]}>↑</Text>
                  <Text style={[styles.trendText, { color: '#10B981' }]}>12.5%</Text>
                </View>
              </View>
              
              <View style={styles.performanceDivider} />
              
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>32.4%</Text>
                <Text style={styles.performanceLabel}>Conversion</Text>
                <View style={styles.performanceTrend}>
                  {/* Replace with your icon */}
                  {/* <Image source={require('../../assets/icons/dashboard/arrow-down.png')} style={[styles.trendIcon, { tintColor: '#EF4444' }]} /> */}
                  <Text style={[styles.iconPlaceholder, { color: '#EF4444' }]}>↓</Text>
                  <Text style={[styles.trendText, { color: '#EF4444' }]}>3.8%</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewReportButton}>
              <Text style={styles.viewReportText}>View Full Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('home')}
        >
          {/* Replace with your icon */}
          {/* <Image 
            source={require('../../assets/icons/dashboard/home.png')} 
            style={[styles.navIcon, activeTab === 'home' && styles.activeNavIcon]} 
          /> */}
          <Text style={[
            styles.iconPlaceholder, 
            activeTab === 'home' ? styles.activeNavText : styles.navText
          ]}>🏠</Text>
          <Text style={[
            styles.navText, 
            activeTab === 'home' && styles.activeNavText
          ]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('projects')}
        >
          {/* Replace with your icon */}
          {/* <Image 
            source={require('../../assets/icons/dashboard/folder.png')} 
            style={[styles.navIcon, activeTab === 'projects' && styles.activeNavIcon]} 
          /> */}
          <Text style={[
            styles.iconPlaceholder, 
            activeTab === 'projects' ? styles.activeNavText : styles.navText
          ]}>📁</Text>
          <Text style={[
            styles.navText, 
            activeTab === 'projects' && styles.activeNavText
          ]}>Projects</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemCenter}>
          <View style={styles.navItemCenterButton}>
            {/* Replace with your icon */}
            {/* <Image 
              source={require('../../assets/icons/dashboard/plus.png')} 
              style={styles.navItemCenterIcon} 
            /> */}
            <Text style={styles.navItemCenterText}>+</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('messages')}
        >
          {/* Replace with your icon */}
          {/* <Image 
            source={require('../../assets/icons/dashboard/message.png')} 
            style={[styles.navIcon, activeTab === 'messages' && styles.activeNavIcon]} 
          /> */}
          <Text style={[
            styles.iconPlaceholder, 
            activeTab === 'messages' ? styles.activeNavText : styles.navText
          ]}>💬</Text>
          <Text style={[
            styles.navText, 
            activeTab === 'messages' && styles.activeNavText
          ]}>Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('profile')}
        >
          {/* Replace with your icon */}
          {/* <Image 
            source={require('../../assets/icons/dashboard/user.png')} 
            style={[styles.navIcon, activeTab === 'profile' && styles.activeNavIcon]} 
          /> */}
          <Text style={[
            styles.iconPlaceholder, 
            activeTab === 'profile' ? styles.activeNavText : styles.navText
          ]}>👤</Text>
          <Text style={[
            styles.navText, 
            activeTab === 'profile' && styles.activeNavText
          ]}>Profile</Text>
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
    fontWeight: '700',
    color: '#000',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
    borderRadius: 20,
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
  statIcon: {
    width: 20,
    height: 20,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  actionTitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  projectsContainer: {
    paddingRight: 20,
  },
  projectCard: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  projectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  projectBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
  },
  teamAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  teamInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  viewButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonIcon: {
    width: 16,
    height: 16,
    tintColor: '#000',
  },
  activitiesContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
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
    borderBottomColor: '#f1f5f9',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityIcon: {
    width: 20,
    height: 20,
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
  activitySubtitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  performanceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
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
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  periodText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    marginRight: 5,
  },
  chevronIcon: {
    width: 12,
    height: 12,
    tintColor: 'rgba(0, 0, 0, 0.5)',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  performanceLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 5,
  },
  performanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    width: 12,
    height: 12,
    marginRight: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  performanceDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f1f5f9',
  },
  viewReportButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewReportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
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
  navIcon: {
    width: 24,
    height: 24,
    tintColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 4,
  },
  activeNavIcon: {
    tintColor: '#3B82F6',
  },
  navText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  activeNavText: {
    fontWeight: '700',
    color: '#3B82F6',
  },
  navItemCenter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemCenterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemCenterText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  iconPlaceholder: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ModernDashboard; 