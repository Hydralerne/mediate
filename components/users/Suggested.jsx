import { View, Text, FlatList, StyleSheet } from 'react-native'
import UserItem from './UserPost'
import { useNavigationContext } from '../../contexts/NavigationContext';
import createStyles from '../../utils/globalStyle';

const SuggestedUsers = ({ data }) => {
    const { navigateInCurrentTab } = useNavigationContext();

    const renderItem = ({ item, index }) => {
        return (
            <UserItem data={item} navigation={{ navigateInCurrentTab }} index={item} />
        )
    }
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item?.id.toString() || index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
        />
    )
}

const styles = createStyles({
    container: {
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        borderBottomWidth: 1,
        minHeight: 200,
        paddingVertical: 10,
    }
});


export default SuggestedUsers