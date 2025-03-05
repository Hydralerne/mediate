import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';

const Deactive = ({ callback }) => {
    return (
        <View style={styles.outsetContainer}>
            <Text style={styles.headText}>We will miss you</Text>
            <View style={styles.container}>
                <TouchableButton style={[styles.button, styles.deactive]} onPress={() => callback('deactive')}>
                    <Text style={[styles.iconText, { color: colors.background }]}>Deactive account</Text>
                </TouchableButton>
                <TouchableButton style={[styles.button, styles.delete]} onPress={() => callback('delete')}>
                    <Text style={styles.iconText}>Delete account</Text>
                </TouchableButton>
                <TouchableButton style={[styles.button, styles.cancel]} onPress={() => callback('cancel')}>
                    <Text style={[styles.iconText,{color: colors.mainColor}]}>Cancel</Text>
                </TouchableButton>
            </View>
        </View>
    );
};

const styles = createStyles({
    headText: {
        color: colors.mainColor,
        textAlign: 'center',
        fontSize: 18,
        paddingBottom: 20,
        paddingTop: 10
    },
    deactive: {
        backgroundColor: colors.mainColor
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 75,
        zIndex: 99
    },
    delete: {
        backgroundColor: '#ff1744'
    },
    cancel: {
        borderWidth: 1,
        borderColor: colors.mediumBorder
    },
    button: {
        flex: 1,
        height: 50,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    iconText: {
        color: 'white',
        textAlign: 'center',
    },
});


export default Deactive