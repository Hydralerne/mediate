import { Image, StyleSheet, Text, View } from 'react-native';
import PagesHeader from '../../components/global/PagesHeader';
import colors from '../../utils/colors';
import TouchableButton from '../../components/global/ButtonTap';
import CheckBox from '../../components/global/CheckBox';
import { useState } from 'react';
import { toggleCheckbox } from '../../utils/calls/settings';
import { useSettings } from '../../contexts/SettingsProvider';
import useTranslation from '../../hooks/useTranslation';
import createStyles from '../../utils/globalStyle';

const Main = ({ route, navigation }) => {

    const { data } = useSettings()
    const t = useTranslation()
    const safety = data.options.safety

    const [sectionsState, setSectionsState] = useState(safety);

    const handleToggle = (key) => {
        toggleCheckbox('safety', key, setSectionsState);
    };

    const handleMenu = () => { };

    let sections = [
        'allow_only_registered',
        'profanity_filter',
        'allow_only_verified',
        'allow_only_from_country',
        'hide_stories_view',
        'hide_likes',
        'allow_anon_stories'
    ];

    return (
        <View style={styles.container}>
            <PagesHeader
                title={t('settings.safety.header')}
                navigation={navigation}
                contextMenu={handleMenu}
            />
            <View style={styles.pageContainer}>
                {sections.map((section) => (
                    <TouchableButton onPress={() => handleToggle(section)} key={section}>
                        <View style={styles.section}>
                            <Text style={styles.titleText}>{t(`settings.safety.${section}`)}</Text>
                            <CheckBox
                                onPress={() => handleToggle(section)}
                                checked={sectionsState[section]}
                                color={colors.main}
                                style={styles.checkbox}
                            />
                        </View>
                    </TouchableButton>
                ))}
            </View>
            {/* <View style={button.buttons}>
                <TouchableButton>
                    <View style={button.section}>
                        <Image style={button.mainIcon} source={require('../../assets/icons/settings/forbidden sign-88-1658435662.png')} />
                        <View style={button.grid}>
                            <Text style={button.title}>Blocked Accounts</Text>
                            <Text style={button.value}>See the list of blocked accounts</Text>
                        </View>
                        <View style={button.edit}>
                            <Text style={button.editText}>View</Text>
                            <Image style={button.editIcon} source={require('../../assets/icons/settings/chevron right-18-1696832403.png')} />
                        </View>
                    </View>
                </TouchableButton>
            </View> */}
        </View>
    );
};


const button = createStyles({
    buttons: {
        marginTop: 20
    },
    edit: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
        marginRight: 10
    },
    headeing: {
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 1,
        paddingBottom: 15,
        paddingTop: 10,
        marginTop: 20
    },
    textHeading: {
        color: colors.mainColor,
        fontSize: 18
    },
    editText: {
        color: colors.mainSecound,
    },
    value: {
        color: colors.mainSecound,
    },
    title: {
        color: colors.mainColor,
        fontSize: 16,
        marginBottom: 2
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopColor: colors.lightBorder,
        borderTopWidth: 1
    },
    editIcon: {
        tintColor: colors.mainMedium,
        width: 20,
        height: 20,
        marginLeft: 10
    },
    mainIcon: {
        tintColor: colors.mainSecound,
        width: 24,
        height: 24,
        marginRight: 15,

    }
})

const styles = StyleSheet.create({
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

export default Main;
