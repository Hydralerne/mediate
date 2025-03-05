import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PagesHeader from '../global/PagesHeader';
import TabBar from '../global/TabBar';
import colors from '../../utils/colors';
import createStyles from '../../utils/globalStyle';
import SettingsIcon from '../global/SettingsGlobal';

const InboxHeader = ({ tabs, activeTab, setActiveTab, swipeX, viewWidth, headerText, screen, onTabChange }) => {
    return (
        <View style={styles.container}>
            <PagesHeader title={headerText} contextIcon={<SettingsIcon screen={screen} />} isMainStack={true} />
            <TabBar
                style={styles.tabBar}
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                swipeX={swipeX}
                viewWidth={viewWidth}
                onTabPress={onTabChange}
            />
        </View>
    )
}

const styles = createStyles({
    contextMenu: {
        left: null,
        right: 0,
        marginLeft: 0,
        marginRight: 10
    },
    backButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        lef: 0,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },
    backIcon: {
        tintColor: 'white',
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    container: {
        flex: 1
    },
    tabBar: {
        position: 'relative',
        marginTop: 90,
        zIndex: 99,
        paddingTop: 10,
        height: 55,
        backgroundColor: colors.background,
        borderBottomColor: colors.lightBorder
    },
})

export default React.memo(InboxHeader)