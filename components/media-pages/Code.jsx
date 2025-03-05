import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/hljs";

const CODE_STR = `function processNumbers(numbers) {
    return numbers
        .sort((a, b) => a - b) 
        .map(n => n * 2)      
        .filter(n => n > 50)  
        .reduce((sum, num) => sum + num, 0); 
}

const numbers = [12, 5, 8, 130, 44, 99, 27, 73, 18, 22];
const result = processNumbers(numbers);

console.log(result);`;

export default function HighlightComponent() {
    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                <CodeHighlighter
                    hljsStyle={themes.defaultStyle}
                    containerStyle={styles.codeContainer}
                    textStyle={styles.text}
                    language="javascript"
                >
                    {CODE_STR}
                </CodeHighlighter>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    codeContainer: {
        padding: 10,
        minWidth: "100%", // Ensures scrollable content
    },
    container: {
        borderRadius: 10,
        marginVertical: 10,
        overflow: "hidden",
        width: "100%",
    },
    text: {
        fontSize: 14,
    },
});
