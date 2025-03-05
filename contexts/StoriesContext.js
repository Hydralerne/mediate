import React, { createContext, useContext, useState } from 'react';

const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
    const [stories, setStories] = useState([]);
    const [self, setSelf] = useState(null);
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true);

    return (
        <StoriesContext.Provider
            value={{
                self,
                setSelf,
                stories,
                setStories,
                hasMore,
                setHasMore,
                loading,
                setLoading,
            }}
        >
            {children}
        </StoriesContext.Provider>
    );
};

export const useStories = () => useContext(StoriesContext);