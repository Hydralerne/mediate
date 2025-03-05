import { Text } from 'react-native';

export default function Span({ children, style, ...props }) {
    const arabicRegex = /[\u0600-\u06FF]/;
    const fontFamily = 'arabic'//arabicRegex.test(children) ? 'SFArabic' : 'Gellix-Regular';
    return <Text style={[style, { fontFamily }]} {...props}>{children}</Text>;
}
