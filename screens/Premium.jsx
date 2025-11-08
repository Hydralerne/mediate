import React, { useState, useEffect } from 'react';
import {
    View,
    StatusBar,
} from 'react-native';
import createStyles from '../utils/globalStyle';
import Promotion from '@/components/premium/Promotion';

const Premium = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Promotion navigation={navigation} />
        </View>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});

export default Premium;