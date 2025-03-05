import React, { useState, useEffect } from 'react';
import { fetchStories } from '../../utils/calls/stories'
import StoriesButtons from './StoriesButtons'
import { useStories } from '../../contexts/StoriesContext';

const StoriesFetch = ({ style }) => {
    const data = useStories();
    useEffect(() => {
        fetchStories(data);
    }, []);
    return (
        <StoriesButtons style={style} />
    )
}

export default React.memo(StoriesFetch)