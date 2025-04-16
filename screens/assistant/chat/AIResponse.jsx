import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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
                    // Regular text paragraphs (skip empty parts)
                    // Split by double newlines to create separate paragraphs
                    return part.split(/\n\n+/).map((paragraph, pIndex) => (
                        <Text key={`${index}-${pIndex}`} style={styles.aiText}>
                            {paragraph}
                        </Text>
                    ));
                }
                return null;
            })}
        </View>
    );
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