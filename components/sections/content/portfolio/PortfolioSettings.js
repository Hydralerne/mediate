import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingSection = ({ title, children }) => (
  <View style={styles.settingSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const ToggleSetting = ({ label, description, value, onToggle }) => (
  <View style={styles.toggleSetting}>
    <View style={styles.toggleInfo}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {description && <Text style={styles.toggleDescription}>{description}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#D1D1D6', true: '#000' }}
      thumbColor="#FFFFFF"
    />
  </View>
);

const RadioOption = ({ label, isSelected, onSelect, icon }) => (
  <TouchableOpacity
    style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
    onPress={onSelect}
  >
    <View style={styles.radioOptionContent}>
      {icon && <Ionicons name={icon} size={20} color={isSelected ? '#fff' : '#000'} style={styles.radioIcon} />}
      <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>{label}</Text>
    </View>
    <View style={styles.radioButton}>
      {isSelected && <View style={styles.radioSelected} />}
    </View>
  </TouchableOpacity>
);

const PortfolioSettings = ({
  settings = {
    displayStyle: 'grid',
    sortableEnabled: true,
    projectsPerPage: 6,
    showProjectLinks: true,
    showTags: true
  },
  onSettingChange
}) => {
  
  const handleDisplayStyleChange = (style) => {
    onSettingChange('displayStyle', style);
  };
  
  const handleToggleSetting = (key) => {
    onSettingChange(key, !settings[key]);
  };
  
  const handleProjectsPerPageChange = (value) => {
    onSettingChange('projectsPerPage', value);
  };
  
  return (
    <ScrollView style={styles.container}>
      <SettingSection title="Display Style">
        <View style={styles.optionsContainer}>
          <RadioOption
            label="Grid View"
            icon="grid-outline"
            isSelected={settings.displayStyle === 'grid'}
            onSelect={() => handleDisplayStyleChange('grid')}
          />
          <RadioOption
            label="List View"
            icon="list-outline"
            isSelected={settings.displayStyle === 'list'}
            onSelect={() => handleDisplayStyleChange('list')}
          />
          <RadioOption
            label="Masonry"
            icon="albums-outline"
            isSelected={settings.displayStyle === 'masonry'}
            onSelect={() => handleDisplayStyleChange('masonry')}
          />
        </View>
      </SettingSection>

      <SettingSection title="User Controls">
        <ToggleSetting
          label="Enable Reordering"
          description="Allow users to drag and reorder projects"
          value={settings.sortableEnabled}
          onToggle={() => handleToggleSetting('sortableEnabled')}
        />
        <ToggleSetting
          label="Show Project Links"
          description="Display links to view full projects"
          value={settings.showProjectLinks}
          onToggle={() => handleToggleSetting('showProjectLinks')}
        />
        <ToggleSetting
          label="Show Tags"
          description="Display project tags"
          value={settings.showTags}
          onToggle={() => handleToggleSetting('showTags')}
        />
      </SettingSection>

      <SettingSection title="Display Options">
        <View style={styles.counterSetting}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Projects Per Page</Text>
            <Text style={styles.toggleDescription}>Number of projects displayed per page</Text>
          </View>
          <View style={styles.counter}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => handleProjectsPerPageChange(Math.max(3, settings.projectsPerPage - 3))}
              disabled={settings.projectsPerPage <= 3}
            >
              <Text style={[styles.counterButtonText, settings.projectsPerPage <= 3 && styles.counterButtonDisabled]}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{settings.projectsPerPage}</Text>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => handleProjectsPerPageChange(settings.projectsPerPage + 3)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SettingSection>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="rgba(0,0,0,0.5)" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          These settings control how your portfolio is displayed to visitors on your page.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  sectionContent: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  optionsContainer: {
    width: '100%',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  radioOptionSelected: {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  radioOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioIcon: {
    marginRight: 12,
  },
  radioLabel: {
    fontSize: 16,
    color: '#000',
  },
  radioLabelSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  toggleSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },
  counterSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  counterButtonDisabled: {
    opacity: 0.3,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20,
  },
});

export default PortfolioSettings; 