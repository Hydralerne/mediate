import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingsIcon from '../../components/global/SettingsGlobal';
import PagesHeader from '../../components/global/PagesHeader';
import NotificationsList from '../../components/notifications/NotificationsList';
import { useNavigationContext } from '../../contexts/NavigationContext';
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';

const NotificationsScreen = ({ navigation }) => {
    const { registerTabNavigation, unregisterTabNavigation } = useNavigationContext();

    useEffect(() => {
        registerTabNavigation('NotificationsTab', navigation);

        return () => {
            unregisterTabNavigation('NotificationsTab');
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <PagesHeader
                navigation={navigation}
                style={{ height: 100 }}
                title={'Notifications'}
                isMainStack={true}
                contextIcon={<SettingsIcon screen={'Notifications'} />}
            />
            <NotificationsList navigation={navigation} />
        </View>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10,
    },
});

export default memo(NotificationsScreen);