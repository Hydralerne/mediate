import React, { useState, useRef, useEffect, useContext, memo } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import PagesHeader from '../../components/global/PagesHeader';
import colors from '../../utils/colors';
import UserItem from '../../components/users/SearchList';
import { request } from '../../utils/requests';
import { getToken } from '../../utils/token';
import UserLoader from '../../loaders/UserLoader'
import SettingsIcon from '../../components/global/SettingsGlobal';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { UserContext } from '../../contexts/UserContext';
import createStyles from '../../utils/globalStyle';

const SearchBar = React.memo(({ onSearch }) => {
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false); // Track focus state
    const timeoutRef = useRef(null);

    const handleTextChange = (text) => {
        setSearchText(text);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onSearch(text);
        }, 200);
    };

    return (
        <View style={styles.searchContainer}>
            <View style={styles.innerSearchContainer}>
                <View style={[styles.placeholderContainer,searchText && {opacity: 0}]}>
                    <Image
                        source={require('../../assets/icons/menu-bottom/search-123-1658435124.png')}
                        style={styles.searchIcon}
                    />
                </View>
                <TextInput
                    style={styles.textInput}
                    numberOfLines={1}
                    placeholder="Search"
                    placeholderTextColor={colors.placeholder}
                    value={searchText}
                    onChangeText={handleTextChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
        </View>
    );
})

const SearchBody = ({ navigateInCurrentTab }) => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { userDate } = useContext(UserContext)

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setIsLoading(true);
        if (query) {
            try {
                const response = await request(
                    'https://api.onvo.me/v2/search',
                    { q: query },
                    'GET',
                    {
                        Authorization: `Bearer ${await getToken()}`,
                    }
                );
                setData(response);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setData([]);
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <PagesHeader
                style={{ height: 110 }}
                center={<SearchBar onSearch={handleSearch} />}
                isMainStack={true}
                contextIcon={<SettingsIcon />}
            />
            <ScrollView style={styles.scrollView}>
                {isLoading ? (
                    <UserLoader />
                ) : (
                    data.map((item, index) => (
                        <UserItem userid={userDate?.user?.id} navigation={{ navigateInCurrentTab }} key={index} data={item} />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const SearchScreen = ({ navigation }) => {
    const { registerTabNavigation, unregisterTabNavigation, navigateInCurrentTab } = useNavigationContext();

    useEffect(() => {
        registerTabNavigation('SearchTab', navigation);

        return () => {
            unregisterTabNavigation('SearchTab');
        };
    }, [navigation]);

    return (
        <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
            <SearchBody navigateInCurrentTab={navigateInCurrentTab} />
        </TouchableWithoutFeedback>
    );
};

const styles = createStyles({
    scrollView: {
        flex: 1,
        paddingTop: 115
    },
    searchIcon: {
        tintColor: colors.placeholder,
        width: 20,
        height: 20,
        position: 'absolute',
        marginLeft: -50,
        marginTop: 10
    },
    searchContainer: {
        flex: 1,
        height: 40,
        paddingHorizontal: 60,
    },
    textInput: {
        flex: 1,
        width: '100%',
        textAlign: 'center',
        paddingHorizontal: 20,
        color: colors.mainColor,
    },
    innerSearchContainer: {
        flex: 1,
        backgroundColor: colors.lightBorder,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contextMenu: {
        right: 0,
        marginRight: 10,
    },
    backButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
    },
    backIcon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
});

export default memo(SearchScreen);