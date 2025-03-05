import { StyleSheet, Text, View } from 'react-native';
import PagesHeader from '../../components/global/PagesHeader';
import colors from '../../utils/colors';
import TouchableButton from '../../components/global/ButtonTap';
import CheckBox from '../../components/global/CheckBox';
import { useEffect, useState } from 'react';
import { toggleCheckbox } from '../../utils/calls/settings';
import { useSettings } from '../../contexts/SettingsProvider';
import useTranslation from '../../hooks/useTranslation';
import createStyles from '../../utils/globalStyle';

const Notifications = ({ route, navigation }) => {
    const { data } = useSettings()
    const t = useTranslation()
    const notification = data?.options?.notifications

    const [sectionsState, setSectionsState] = useState(notification);

    useEffect(() => {
        setSectionsState(notification)
    }, [notification])

    const handleToggle = (key) => {
        toggleCheckbox('notifications', key, setSectionsState);
    };

    const handleMenu = () => { };

    let sections = [
        'notify_new_question',
        'notify_new_follower',
        'notify_new_reply',
        'notify_recommendation',
        'notify_story_like',
        'notify_story_views'
    ];

    return (
        <View style={styles.container}>
            <PagesHeader
                title={'Notifications'}
                navigation={navigation}
                contextMenu={handleMenu}
            />
            <View style={styles.pageContainer}>
                {sections.map((section) => (
                    <TouchableButton onPress={() => handleToggle(section)} key={section}>
                        <View style={styles.section}>
                            <Text style={styles.titleText}>{t(`settings.notifications.${section}`)}</Text>
                            <CheckBox
                                onPress={() => handleToggle(section)}
                                checked={sectionsState?.[section]}
                                color={colors.main}
                                style={styles.checkbox}
                            />
                        </View>
                    </TouchableButton>
                ))}
            </View>
            <View style={styles.mutedSections}></View>
        </View>
    );
};

const styles = createStyles({
    checkbox: {
        position: 'absolute',
        right: 0,
        marginRight: 15
    },
    pageContainer: {
        marginTop: 110
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        minHeight: 50
    },
    titleText: {
        color: colors.mainColor,
        marginBottom: 4,
        marginRight: 50
    }
});

export default Notifications;
