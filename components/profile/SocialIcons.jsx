import { memo } from 'react';
import { View, StyleSheet, Image, Linking, Animated, } from 'react-native'
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';
import colors from '../../utils/colors';

const SocialIcons = ({ data }) => {
    return (
        <View
            style={[
                styles.buttonsContainer,
                (!data || data?.length === 0) && { display: 'none' },
            ]}
        >
            {data?.map((item, index) => {
                const scale = new Animated.Value(1);

                const handlePressIn = () => {
                    Animated.timing(scale, {
                        toValue: 0.95,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                };

                const handlePressOut = () => {
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                };

                const handlePress = () => {
                    Linking.openURL(item.d).catch((err) => {
                        console.error('Error opening URL:', err);
                    });
                };

                const { image, style } = generateIcons(item.t);

                return (
                    <TouchableButton
                        key={index}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handlePress}
                    >
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                { transform: [{ scale }] },
                            ]}
                        >
                            <Image source={image} style={[styles.icon, style]} />
                        </Animated.View>
                    </TouchableButton>
                );
            })}
        </View>
    );
};

export const socialIcons = {
    fb: { title: 'Facebook', image: require('../../assets/icons/social/facebook square-176-1693375079.png') },
    gm: { title: 'Gmail', image: require('../../assets/icons/social/gmail.png') },
    gh: { title: 'GitHub', image: require('../../assets/icons/social/github.png') },
    pt: { title: 'Pinterest', image: require('../../assets/icons/social/pinterest-10-1693375216.png') },
    sn: { title: 'Snapchat', image: require('../../assets/icons/social/snapchat-61-1693375217.png') },
    rd: { title: 'Reddit', image: require('../../assets/icons/social/reddit-34-1693375216.png') },
    ig: { title: 'Instagram', image: require('../../assets/icons/social/instagram-87-1693375539.png') },
    sc: { title: 'SoundCloud', image: require('../../assets/icons/social/soundcloud-66-1693375584.png') },
    sp: { title: 'Spotify', image: require('../../assets/icons/social/spotify-74-1693375217.png') },
    wa: { title: 'WhatsApp', image: require('../../assets/icons/social/whatsapp-168-1693375584.png') },
    ln: { title: 'LinkedIn', image: require('../../assets/icons/social/linkedin-icon.png') },
    tw: { title: 'X (Twitter)', image: require('../../assets/icons/social/x.com-179-1693375584.png') },
    bh: { title: 'Behance', image: require('../../assets/icons/social/behance-102-1693375079.png') },
    yt: { title: 'YouTube', image: require('../../assets/icons/social/youtube-197-1693375584.png') },
    tk: { title: 'TikTok', image: require('../../assets/icons/social/tiktok-109-1693375584.png') },
    an: { title: 'Anghami', image: require('../../assets/icons/social/anghami.png'), style: { width: 20, height: 20 } },
};

export const generateIcons = (type) => socialIcons[type] || null;


const styles = createStyles({
    iconContainer: {
        marginHorizontal: 7.5,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        tintColor: colors.mainColor,
        width: 24,
        height: 24,
    },
    buttonsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20
    }
})

export default memo(SocialIcons)