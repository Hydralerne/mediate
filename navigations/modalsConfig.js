
import { lazy } from 'react';

const MusicPage = lazy(() => import('../modals/Music'));
const MoviesPage = lazy(() => import('../modals/Movies'));
const InboxModal = lazy(() => import('../modals/SendBox'));
const StoriesPage = lazy(() => import('../modals/Stories'));
const SingleStory = lazy(() => import('../modals/SingleStory'));
const ReplyModal = lazy(() => import('../modals/Reply'));
const Browser = lazy(() => import('../screens/shared/Browser'));
const Coder = lazy(() => import('../modals/Coder'));
const SettingsModal = lazy(() => import('../modals/Settings'));

import { Platform } from 'react-native';
const isAndroid = Platform.OS == 'android'

const modalsConfig = [
    {
        name: 'MusicModal',
        component: MusicPage,
        props: {
            presentation: 'modal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'ReplyModal',
        component: ReplyModal,
        props: {
            presentation: isAndroid ? 'modal' : 'transparentModal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'MoviesModal',
        component: MoviesPage,
        props: {
            presentation: 'modal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'Coder',
        component: Coder,
        props: {
            presentation: 'modal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'InboxModal',
        component: InboxModal,
        props: {
            presentation: isAndroid ? 'modal' : 'transparentModal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'Stories',
        component: StoriesPage,
        props: {
            presentation: isAndroid ? 'modal' : 'transparentModal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'SingleStory',
        component: SingleStory,
        props: {
            presentation: isAndroid ? 'modal' : 'transparentModal',
            animation: isAndroid ? 'slide_from_bottom' : undefined
        }
    },
    {
        name: 'MyStory',
        component: SingleStory,
        props: {
            animation: 'slide_from_bottom'
        }
    },
    {
        name: 'Browser',
        component: Browser,
        props: {
            fullScreenGestureEnabled: true,
        }
    },
    {
        name: 'SettingsModal',
        component: SettingsModal,
        props: {
            presentation: 'modal',
            fullScreenGestureEnabled: true,
        }
    },

];

const getCurrentTab = (navigation) => {
    const state = navigation.getState();
    const mainTabsState = state.routes.find((route) => route.name === 'MainTabs');
    if (mainTabsState && mainTabsState.state) {
        return mainTabsState.state.routes[mainTabsState.state.index].name;
    }
    return null;
};

export const navigateInTab = (navigation, stackScreen, mainScreen, params = {}) => {
    const currentTab = getCurrentTab(navigation);
    if (currentTab) {
        navigation.navigate('MainTabs', {
            screen: currentTab,
            params: {
                screen: stackScreen,
                params: {
                    screen: mainScreen,
                    params: params,
                },
            },
        });
    } else {
        console.error('Unable to determine the current tab.');
    }
};


export default modalsConfig;
