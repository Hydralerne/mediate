import { useState } from 'react'

export const useTabs = (initialFollowersLoaded, initialFollowingLoaded) => {
    const [loadedTabs, setLoadedTabs] = useState({
        followers: initialFollowersLoaded,
        following: initialFollowingLoaded
    });

    const onTabChange = (index) => {
        if (index === 0 && !loadedTabs.followers) {
            setLoadedTabs(prev => ({ ...prev, followers: true }));
        } else if (index === 1 && !loadedTabs.following) {
            setLoadedTabs(prev => ({ ...prev, following: true }));
        }
    };

    return { loadedTabs, onTabChange };
};

