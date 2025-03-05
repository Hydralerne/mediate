import React, { useState, useContext, useEffect, memo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import InboxHeader from '../../components/inbox/Header'
import TabView from '../../components/global/TabView'
import MessageBody from '../../components/inbox/MessagesBody';
import { useSharedValue } from 'react-native-reanimated';
import { UserContext } from '../../contexts/UserContext';
import { useNavigationContext } from '../../contexts/NavigationContext';
import createStyles from '../../utils/globalStyle';
import useTranslation from '../../hooks/useTranslation';
import colors from '../../utils/colors';

const MessagesScreen = ({ navigation }) => {
    const { userData } = useContext(UserContext);
    const { registerTabNavigation, unregisterTabNavigation } = useNavigationContext();
    const t = useTranslation()
    useEffect(() => {
        registerTabNavigation('MessagesTab', navigation);

        return () => {
            unregisterTabNavigation('MessagesTab');
        };
    }, [navigation]);

    const counts = userData?.data?.counts

    const swipeX = useSharedValue(0);
    const [headerText, setHeaderText] = useState((counts?.messages || '') + ' ' + t('messages.headerMessages.title'))
    const [ArchiveEndpoint, setArchiveEndpoint] = useState(null)
    const [SentEndpoint, setSentEndpoint] = useState(null)

    const onTabChange = (index) => {
        if (index == 0) {
            setHeaderText((counts?.messages || '') + ' ' + t('messages.headerMessages.title'))
        } else if (index == 1) {
            if (!ArchiveEndpoint) {
                setArchiveEndpoint('posts/dm/archive')
            }
            setHeaderText((counts?.archives || 0) + ' ' + t('messages.headerMessages.title'))
        } else if (index == 2) {
            if (!SentEndpoint) {
                setSentEndpoint('posts/dm/sent')
            }
            setHeaderText((counts?.sent || 0) + ' ' + t('messages.headerMessages.title'))
        }
    }

    const tabs = [
        {
            title: t('messages.headerMessages.inbox'),
            body: (
                <MessageBody refIndex={'messagesRefs'} offsetX={160} />
            )
        },
        {
            title: t('messages.headerMessages.archive'),
            body: ArchiveEndpoint && (<MessageBody dir={'archive'} refIndex={'archiveRefs'} endpoint={ArchiveEndpoint} offsetX={160} />),
            onTap: () => onTabChange(1)
        },
        {
            title: t('messages.headerMessages.sent'),
            body: SentEndpoint && (<MessageBody dir={'sent'} refIndex={'messagesRefs'} endpoint={SentEndpoint} offsetX={160} />),
            onTap: () => onTabChange(2)
        }
    ]
    return (
        <View style={styles.container}>
            <InboxHeader
                onTabChange={onTabChange}
                tabs={tabs}
                swipeX={swipeX}
                headerText={headerText}
                screen={'Inbox'}
            />
            <TabView
                swipeX={swipeX}
                tabs={tabs}
                onTabChange={onTabChange}
            />
        </View>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});

export default memo(MessagesScreen);