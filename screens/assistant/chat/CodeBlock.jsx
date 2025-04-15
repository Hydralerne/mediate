import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width } = Dimensions.get('window');

// Professional syntax colors
const SYNTAX_COLORS = {
  background: '#1E1E2E',
  text: '#F8F8F2',
  comment: '#6272A4',
  keyword: '#FF79C6',
  string: '#F1FA8C',
  number: '#BD93F9',
  function: '#50FA7B',
  operator: '#FF79C6',
  property: '#8BE9FD',
  classname: '#50FA7B',
  variable: '#F8F8F2'
};

const CodeBlock = ({ code, language }) => {
    const [expanded, setExpanded] = useState(false);
    const maxLines = 6;
    
    // Count number of lines in code
    const lineCount = (code.match(/\n/g) || []).length + 1;
    const shouldCollapse = lineCount > maxLines;
    
    return (
        <View style={styles.codeBlockContainer}>
            {/* Header with language label and line count */}
            <View style={styles.codeHeader}>
                <View style={styles.headerLeft}>
                    {language && (
                        <Text style={styles.codeLanguage}>{language}</Text>
                    )}
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.lineCount}>{lineCount} lines</Text>
                </View>
            </View>
            
            {/* Code content with line numbers */}
            <View style={styles.codeContentWrapper}>
                {!expanded && shouldCollapse ? (
                    <MaskedView
                        style={{ height: maxLines * 24 }}
                        maskElement={
                            <LinearGradient
                                colors={['transparent', 'white', 'transparent']}
                                locations={[0, 0.8, 1]}
                                style={{ flex: 1 }}
                            />
                        }
                    >
                        <View style={styles.codeContent}>
                            {code.split('\n').map((line, i) => (
                                <View key={i} style={styles.codeLine}>
                                    <Text style={styles.lineNumber}>{i + 1}</Text>
                                    <Text style={styles.codeText}>{line}</Text>
                                </View>
                            ))}
                        </View>
                    </MaskedView>
                ) : (
                    <View style={styles.codeContent}>
                        {code.split('\n').map((line, i) => (
                            <View key={i} style={styles.codeLine}>
                                <Text style={styles.lineNumber}>{i + 1}</Text>
                                <Text style={styles.codeText}>{line}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            
            {/* Expand/collapse button */}
            {shouldCollapse && (
                <View style={styles.expandButtonContainer}>
                    <TouchableOpacity 
                        style={styles.expandButton}
                        onPress={() => setExpanded(!expanded)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.expandButtonInner}>
                            <Text style={styles.expandButtonText}>
                                {expanded ? "Collapse" : "Expand"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    codeBlockContainer: {
        marginVertical: 16,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: SYNTAX_COLORS.background,
        borderWidth: 1,
        borderColor: 'rgba(100, 100, 150, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        width: width * 0.9,
        maxWidth: 600,
    },
    codeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: '#15151F',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    codeLanguage: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    lineCount: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
    },
    codeContentWrapper: {
        overflow: 'hidden',
        backgroundColor: SYNTAX_COLORS.background,
    },
    codeContent: {
        padding: 12,
    },
    codeLine: {
        flexDirection: 'row',
        paddingVertical: 2,
    },
    lineNumber: {
        width: 30,
        marginRight: 12,
        textAlign: 'right',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    codeText: {
        flex: 1,
        color: SYNTAX_COLORS.text,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
        lineHeight: 20,
    },
    expandButtonContainer: {
        backgroundColor: '#15151F', 
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    expandButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: 'rgba(100, 100, 150, 0.1)',
    },
    expandButtonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default CodeBlock; 