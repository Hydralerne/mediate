import { lazy } from 'react';

const ProfileScreen = lazy(() => import('../screens/shared/ProfileScreen'));
const PostDetailScreen = lazy(() => import('../screens/shared/PostDetailsScreen'));
const Followers = lazy(() => import('../modals/Followers'));
const BookmarkScreen = lazy(() => import('../screens/left-menu/BookmarkScreen'));

const sharedConfig = [
    {
        name: 'ProfilePage',
        component: ProfileScreen,
        props: {
            detachPreviousScreen: false
        }
    },
    {
        name: 'PostDetails',
        component: PostDetailScreen,
    },
    {
        name: 'Followers',
        component: Followers,
    },
    {
        name: 'Bookmarks',
        component: BookmarkScreen,
    }
];

export default sharedConfig;
