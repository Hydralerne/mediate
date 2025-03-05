
import React, { useRef } from 'react';
import ProfileMenu from './TabsMenu';


const SwiperView = ({ hook, styles, type }) => {
    const listRef = useRef(null);

    return (
        <PanGestureHandler
            style={{ flex: 1 }}
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
            onEnded={gestureEndHandler}
            activeOffsetX={[0, 50]}
        >
            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <Animated.View style={[styles.listsContainer, { width: SCREEN_WIDTH * 2 }, animatedStyle]}>
                    <ReactAnimated.FlatList
                        ref={listRef}
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderThreadItem}
                        style={[{ paddingTop: HEADER_HEIGHT },]}
                        onScroll={onFlatListScroll}
                        scrollEventThrottle={16}
                        scrollIndicatorInsets={{ top: HEADER_HEIGHT - 10, right: 0 }}
                        bounces={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                    />
                    <ReactAnimated.FlatList
                        ref={listRef}
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderThreadItem}
                        style={[{ paddingTop: HEADER_HEIGHT },]}
                        onScroll={onFlatListScroll}
                        scrollEventThrottle={16}
                        scrollIndicatorInsets={{ top: HEADER_HEIGHT - 10, right: 0 }}
                        bounces={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                    />
                </Animated.View>
            )}
        </PanGestureHandler>
    )
}