import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../../utils/colors';
import createStyles from '../../../utils/globalStyle';

const MessageBubble = ({ text, isUser = false }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
        {text}
      </Text>
    </View>
  );
};

const styles = createStyles({
  container: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 2,
  },
  userContainer: {
    backgroundColor: colors.main,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    backgroundColor: colors.secoundBackground,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.lightBorder,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: colors.mainColor,
  },
});

export default MessageBubble; 