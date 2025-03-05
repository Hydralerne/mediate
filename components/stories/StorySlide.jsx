import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import StoriesHeader from './StoriesHeader';
import StoriesBody from './StoriesBody';
import createStyles from '../../utils/globalStyle';

const StorySlide = ({ data, IndicatorStyle, resolve, TouchHandlers, activeIndex, index, isActive = activeIndex === index, CloseStories, openProfile }) => {
    const prepare = Math.abs(index - activeIndex) === 2;
    return (
        <View style={styles.container}>
            <StoriesHeader
                CloseStories={CloseStories}
                IndicatorStyle={IndicatorStyle}
                openProfile={openProfile}
                data={data}
            />
            <StoriesBody resolve={resolve} prepare={prepare} isActive={isActive} data={data} />
            {TouchHandlers && <TouchHandlers />}
        </View>
    );
};

const styles = createStyles({
    container: {
        flex: 1,
    }
});

export default React.memo(StorySlide);