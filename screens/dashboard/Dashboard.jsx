import React, { useState, useEffect, useRef } from 'react';
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
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../utils/colors';

const { width } = Dimensions.get('window');

// Analytics Card Component
const AnalyticsCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <View style={styles.analyticsCard}>
      <View style={styles.analyticsCardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Image source={icon} style={[styles.cardIcon, { tintColor: color }]} />
        </View>
        <View style={[styles.changeIndicator, { 
          backgroundColor: isPositive ? '#E6F7EE' : '#FDEEEE'
        }]}>
          <Image 
            // source={isPositive 
            //   ? require('../../assets/icons/home/arrow-up-0-1693375323.png')
            //   : require('../../assets/icons/home/arrow-down-0-1693375323.png')} 
            style={[styles.arrowIcon, { 
              tintColor: isPositive ? '#34C759' : '#FF3B30' 
            }]} 
          />
          <Text style={[styles.changeText, { 
            color: isPositive ? '#34C759' : '#FF3B30' 
          }]}>
            {Math.abs(change)}%
          </Text>
        </View>
      </View>
      <Text style={styles.analyticsValue}>{value}</Text>
      <Text style={styles.analyticsTitle}>{title}</Text>
    </View>
  );
};

// Activity Item Component
const ActivityItem = ({ title, time, icon, color }) => {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: `${color}20` }]}>
        <Image source={icon} style={[styles.activityIcon, { tintColor: color }]} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.activityAction}>
        <Image 
        //   source={require('../../assets/icons/home/chevron-right-0-1693375323.png')} 
          style={styles.chevronIcon} 
        />
      </TouchableOpacity>
    </View>
  );
};

// Task Item Component
const TaskItem = ({ title, dueDate, completed, priority }) => {
  const [isChecked, setIsChecked] = useState(completed);
  
  const getPriorityColor = () => {
    switch(priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };
  
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity 
        style={[styles.checkbox, isChecked && styles.checkboxChecked]}
        onPress={() => setIsChecked(!isChecked)}
      >
        {isChecked && (
          <Image 
            // source={require('../../assets/icons/home/check-0-1693375323.png')} 
            style={styles.checkIcon} 
          />
        )}
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskTitle, 
          isChecked && styles.taskTitleCompleted
        ]}>
          {title}
        </Text>
        <Text style={styles.taskDueDate}>Due: {dueDate}</Text>
      </View>
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
    </View>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Sample data for charts
  const visitorsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Visitors"]
  };
  
  const engagementData = {
    labels: ["Pages", "Blog", "Shop", "Contact"],
    datasets: [
      {
        data: [20, 45, 28, 80],
        color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Page Views"]
  };
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#fafafa"
    }
  };
  
  // Animation for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
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
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#000', '#333']}
          style={styles.headerGradient}
        >
          <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.userName}>Alex Johnson</Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <Image 
                //   source={require('../../assets/icons/home/user-0-1693375323.png')} 
                  style={styles.profileIcon} 
                />
              </TouchableOpacity>
            </View>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12.5k</Text>
                <Text style={styles.statLabel}>Visitors</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>$2,450</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>18</Text>
                <Text style={styles.statLabel}>Tasks</Text>
              </View>
            </View>
          </Animated.View>
          
          <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
            Dashboard
          </Animated.Text>
        </LinearGradient>
      </Animated.View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
              Analytics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
            onPress={() => setActiveTab('tasks')}
          >
            <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>
              Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Analytics Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.analyticsContainer}
          >
            <AnalyticsCard 
              title="Total Visitors" 
              value="12,543" 
              change={8.2} 
            //   icon={require('../../assets/icons/home/users-0-1693375323.png')}
              color="#3B82F6"
            />
            <AnalyticsCard 
              title="Page Views" 
              value="48,271" 
              change={12.5} 
            //   icon={require('../../assets/icons/home/eye-0-1693375323.png')}
              color="#8B5CF6"
            />
            <AnalyticsCard 
              title="Bounce Rate" 
              value="32.4%" 
              change={-3.8} 
            //   icon={require('../../assets/icons/home/chart-0-1693375323.png')}
              color="#EC4899"
            />
            <AnalyticsCard 
              title="Avg. Session" 
              value="4m 23s" 
              change={5.1} 
            //   icon={require('../../assets/icons/home/clock-0-1693375323.png')}
              color="#F59E0B"
            />
          </ScrollView>
        </View>
        
        {/* Charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visitor Trends</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={visitorsData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Page Engagement</Text>
          <View style={styles.chartCard}>
            <BarChart
              data={engagementData}
              width={width - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`
              }}
              style={styles.chart}
            />
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
              title="New comment on blog post" 
              time="10 minutes ago" 
            //   icon={require('../../assets/icons/home/comment-0-1693375323.png')}
              color="#3B82F6"
            />
            <ActivityItem 
              title="New order received" 
              time="2 hours ago" 
            //   icon={require('../../assets/icons/home/shopping-cart-0-1693375323.png')}
              color="#10B981"
            />
            <ActivityItem 
              title="Contact form submission" 
              time="Yesterday" 
            //   icon={require('../../assets/icons/home/mail-0-1693375323.png')}
              color="#F59E0B"
            />
          </View>
        </View>
        
        {/* Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tasksContainer}>
            <TaskItem 
              title="Update product descriptions" 
              dueDate="Today" 
              completed={false}
              priority="high"
            />
            <TaskItem 
              title="Respond to customer inquiries" 
              dueDate="Today" 
              completed={true}
              priority="medium"
            />
            <TaskItem 
              title="Review analytics report" 
              dueDate="Tomorrow" 
              completed={false}
              priority="low"
            />
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F620' }]}>
                <Image 
                //   source={require('../../assets/icons/home/plus-0-1693375323.png')} 
                  style={[styles.actionIcon, { tintColor: '#3B82F6' }]} 
                />
              </View>
              <Text style={styles.quickActionText}>New Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B98120' }]}>
                <Image 
                //   source={require('../../assets/icons/home/upload-0-1693375323.png')} 
                  style={[styles.actionIcon, { tintColor: '#10B981' }]} 
                />
              </View>
              <Text style={styles.quickActionText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Image 
                //   source={require('../../assets/icons/home/settings-0-1693375323.png')} 
                  style={[styles.actionIcon, { tintColor: '#F59E0B' }]} 
                />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#EC489920' }]}>
                <Image 
                //   source={require('../../assets/icons/home/help-0-1693375323.png')} 
                  style={[styles.actionIcon, { tintColor: '#EC4899' }]} 
                />
              </View>
              <Text style={styles.quickActionText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            // source={require('../../assets/icons/home/home-0-1693375323.png')} 
            style={[styles.navIcon, { tintColor: '#000' }]} 
          />
          <Text style={[styles.navText, { color: '#000' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            // source={require('../../assets/icons/home/chart-0-1693375323.png')} 
            style={styles.navIcon} 
          />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.addButtonContainer}>
            <View style={styles.addButton}>
              <Image 
                // source={require('../../assets/icons/home/plus-0-1693375323.png')} 
                style={styles.addIcon} 
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            // source={require('../../assets/icons/home/bell-0-1693375323.png')} 
            style={styles.navIcon} 
          />
          <Text style={styles.navText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            // source={require('../../assets/icons/home/user-0-1693375323.png')} 
            style={styles.navIcon} 
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 10,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  tabScroll: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  contentContainer: {
    paddingBottom: 90,
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
    color: '#3B82F6',
    fontWeight: '500',
  },
  analyticsContainer: {
    paddingRight: 20,
  },
  analyticsCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyticsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 18,
    height: 18,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  arrowIcon: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  analyticsTitle: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  chartCard: {
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
    elevation: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 15,
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
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontWeight: '500',
    color: '#000',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  activityAction: {
    padding: 5,
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: 'rgba(0, 0, 0, 0.3)',
  },
  tasksContainer: {
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
    elevation: 5,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 3,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  taskDueDate: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginLeft: 10,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  quickActionText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
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
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: 'rgba(0, 0, 0, 0.5)',
  },
  navText: {
    fontSize: 10,
    marginTop: 3,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  addButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: '#3B82F6',
  },
}); 

export default Dashboard;