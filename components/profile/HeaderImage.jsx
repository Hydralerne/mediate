import React, { useState } from 'react';
import { View, Image, Animated } from 'react-native';
import createStyles from '../../utils/globalStyle';
import ProfileController from '../../hooks/ProfileColorControler';
import colors from '../../utils/colors';
import { useNavigation } from '@react-navigation/native';
import TouchableButton from '../global/ButtonTap';

const Avatar = ({ style, data, isSelf }) => {
    const navigation = useNavigation();
    const [color, setColor] = useState(colors.main);
    ProfileController.setImage = setColor;
    const handlePress = () => {
        if (data.user?.story?.id) {
            setColor(colors.openedStory)
            const param = isSelf ? 'MyStory' : 'SingleStory'
            navigation.navigate(param, { data: { ...data.user?.story, user: data.user } })
        }
    }
    return (
        <View style={styles.imageViewer}>
            <TouchableButton onPress={handlePress}>
                <Animated.View style={[styles.storyContainer, style, data.user?.story?.id && { backgroundColor: data.user?.story?.is_viewed ? colors.openedStory : color }]}>
                    <Image
                        source={{ uri: data.user?.image }}
                        style={[
                            styles.profileImage,
                            data.user?.story?.id && styles.storyExist,
                        ]}
                    />
                </Animated.View>
            </TouchableButton>
        </View>
    );
};

const styles = createStyles({
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.background,
        position: 'absolute',
        borderWidth: 5,
        borderColor: colors.background
    },
    Viewed: {
        backgroundColor: '#555'
    },
    storyExist: {
        borderWidth: 3,
        width: 95,
        height: 95,
    },
    storyContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageViewer: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        zIndex: 999,
        margin: 'auto',
        marginTop: 135,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Avatar;
