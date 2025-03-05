import React from 'react';
import { View, Image } from 'react-native'
import createStyles from '../../utils/globalStyle';
import TouchableButton from '../global/ButtonTap';


const StoriesFooter = ({ isLiked, setIsLiked }) => {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                {/* <BlurView tint="dark" experimentalBlurMethod="RenderScript" intensity={50} style={styles.blurBack} /> */}
                <View style={styles.innerButtons}>
                    {/* <TouchableButton style={[styles.button]}>
                        <Image source={require('../../assets/icons/posts/info menu-42-1661490994.png')} style={styles.icon} />
                    </TouchableButton>
                    <TouchableButton style={styles.button}>
                        <Image source={require('../../assets/icons/posts/replay square-7-57-1696832204.png')} style={styles.icon} />
                    </TouchableButton> */}
                    <TouchableButton onPress={() => setIsLiked(!isLiked)} style={[styles.button, { marginRight: 0 }]}>
                        <Image source={require('../../assets/icons/posts/heart like 2-176-1658434861.png')} style={[styles.icon, { display: isLiked ? 'none' : 'block' }]} />
                        <Image source={require('../../assets/icons/posts/heart like 2-19-1662493136.png')} style={[styles.icon, { display: isLiked ? 'block' : 'none' }]} />
                    </TouchableButton>
                </View>
            </View>
        </View>
    )
}

const styles = createStyles({
    blurBack: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    innerButtons: {
        flexDirection: 'row'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255 / 0.1)'
    },
    icon: {
        tintColor: 'white',
        width: 28,
        height: 28,
        resizeMode: 'contain',
        position: 'absolute'
    },
    innerContainer: {
        // width: 200,
        paddingHorizontal: 12.5,
        height: 60,
        // backgroundColor: 'rgba(255,255,255 / 0.1)',
        // borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: 99,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default React.memo(StoriesFooter)