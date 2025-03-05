import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const BASE_WIDTH = 390
const isSmallDevice = width < BASE_WIDTH;
const isLargeDevice = width > 414;
const isTablet = width >= 500;

const shouldScale = (isSmallDevice || isLargeDevice) && !isTablet;

const scaleFactor = shouldScale ? width / BASE_WIDTH : 1;

const SIZE_PROPERTIES = [
    'width', 'height', 'fontSize', 'padding', 'margin',
    'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'borderRadius', 'top', 'bottom', 'left', 'right',
    'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
    'paddingHorizontal', 'paddingVertical', 'marginHorizontal', 'marginVertical',
];

const viewportScale = (size) => PixelRatio.roundToNearestPixel(size * scaleFactor);

const createStyles = (styles) => {
    const scaledStyles = {};
    Object.keys(styles).forEach((key) => {
        scaledStyles[key] = { };
        if(Platform.OS == 'android'){
            scaledStyles[key].fontFamily = 'main' 
        }
        Object.keys(styles[key]).forEach((property) => {
            if (SIZE_PROPERTIES.includes(property) && typeof styles[key][property] === 'number') {
                scaledStyles[key][property] = viewportScale(styles[key][property]);
            } else {
                scaledStyles[key][property] = styles[key][property];
            }
        });
    });
    return StyleSheet.create(scaledStyles);
};

export default createStyles;
