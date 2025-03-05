import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform } from 'react-native';
import UserItem from './SearchList';
import useFollowers from '../../hooks/useFollowers';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { UserContext } from '../../contexts/UserContext';
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';

const UsersBody = ({ isMenu, id, offsetX, endpoint }) => {
    const { navigateInCurrentTab } = useNavigationContext();
    const { handleLoadMore, data, loading, hasMore, loadingMore } = useFollowers(id, endpoint);
    const { userData } = useContext(UserContext)

    const closeMenu = () => {
        if (isMenu) {
            global.DraggableMenuController.close()
        }
    }

    const renderItem = React.useCallback(
        ({ item }) => <UserItem closeMenu={closeMenu} userid={userData.user?.id} navigation={{ navigateInCurrentTab }} data={item} />,
        [navigateInCurrentTab]
    );

    return (
        <>
            {loading && data.length === 0 ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.mainColor} />
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingTop: Platform.OS == 'android' ? offsetX : 0 }}
                    contentInset={{ top: offsetX }}
                    contentOffset={{ y: -offsetX }}
                    scrollIndicatorInsets={{ top: offsetX, right: 0 }}
                    onEndReached={hasMore ? handleLoadMore : null}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        (loading || loadingMore) && data?.length > 0 ? (
                            <ActivityIndicator style={styles.loader} color={colors.mainColor} />
                        ) : null
                    }
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No users found</Text>
                            </View>
                        ) : null
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </>
    );
};

const styles = createStyles({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        color: colors.mainColor,
        fontSize: 16,
        opacity: 0.7,
    },
});

export default React.memo(UsersBody);