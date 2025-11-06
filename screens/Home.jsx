import React, { memo } from 'react';
import { StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';

import colors from '../utils/colors';
import Header from './components/Header';

const Main = ({ navigation }) => {

  return (
    <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Header />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  }
});

export default memo(Main); 