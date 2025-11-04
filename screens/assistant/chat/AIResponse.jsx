import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import colors from '../../../utils/colors';
import CodeBlock from './CodeBlock';

const { width } = Dimensions.get('window');

const AIResponse = ({ message }) => {
    // Split text by code blocks (marked with ```...)
    const parts = message.text.split(/(```[\s\S]*?```)/g);
    
    return (
        <View style={styles.aiResponseContainer}>
            {parts.map((part, index) => {
                // Check if this part is a code block
                if (part.startsWith('```') && part.endsWith('```')) {
                    // Extract code and language (if specified)
                    let code = part.slice(3, -3);
                    let language = '';
                    
                    // Check if a language is specified in the first line
                    const firstLineBreak = code.indexOf('\n');
                    if (firstLineBreak > 0) {
                        language = code.substring(0, firstLineBreak).trim();
                        // Only if the language specification is a single word
                        if (!/\s/.test(language)) {
                            code = code.substring(firstLineBreak + 1);
                        } else {
                            language = '';
                        }
                    }
                    
                    return <CodeBlock key={index} code={code} language={language} />;
                } else if (part.trim() !== '') {
                    // Use the markdown component for all non-code parts
                    return (
                        <Markdown
                            key={index}
                            style={markdownStyles}
                        >
                            {part}
                        </Markdown>
                    );
                }
                return null;
            })}
        </View>
    );
};

// Styles specifically for markdown components
const markdownStyles = {
    body: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
        marginBottom: 6,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 6,
        marginBottom: 4,
    },
    heading3: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 4,
        marginBottom: 2,
    },
    paragraph: {
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    strong: {
        fontWeight: 'bold',
    },
    em: {
        fontStyle: 'italic',
    },
    bullet_list: {
        marginBottom: 10,
    },
    ordered_list: {
        marginBottom: 10,
    },
    list_item: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
        paddingLeft: 10,
        paddingVertical: 4,
        marginLeft: 10,
        marginVertical: 6,
    },
    code_inline: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        backgroundColor: 'rgba(100, 100, 100, 0.2)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2,
    },
};

const styles = StyleSheet.create({
    aiResponseContainer: {
        marginVertical: 16,
        maxWidth: '95%',
        alignSelf: 'flex-start',
    },
    aiText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#fff',
        marginBottom: 12,
        letterSpacing: 0.3,
    }
});

export default AIResponse; 