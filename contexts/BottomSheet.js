import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated, { Easing } from 'react-native-reanimated';

const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
    const bottomSheetRef = useRef(null);
    const [content, setContent] = useState(null);
    const [style, setStyle] = useState(null)

    const openBottomSheet = useCallback(({ content, style }) => {
        if (content) {
            setContent(content)
        }
        bottomSheetRef.current?.present()
    }, []);

    const handleDismiss = () => {
        setTimeout(() => setContent(null), 200)
    }

    const animationConfigs = {
        duration: 200,
        easing: Easing.out(Easing.exp),
    };

    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={styles.backdrop}
        />
    ), []);

    return (
        <BottomSheetModalProvider>
            <BottomSheetContext.Provider value={{ openBottomSheet }}>
                {children}
                <BottomSheetModal
                    ref={bottomSheetRef}
                    handleStyle={styles.handle}
                    backgroundStyle={[styles.content, style]}
                    handleIndicatorStyle={styles.handleIndicator}
                    backdropComponent={renderBackdrop}
                    animationConfigs={animationConfigs}
                    onDismiss={handleDismiss}
                >
                    <BottomSheetView style={[styles.content, style]}>
                        {content}
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetContext.Provider>
        </BottomSheetModalProvider>
    );
};

export const useBottomSheet = () => useContext(BottomSheetContext);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        minHeight: 350,
        backgroundColor: '#000',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    handleIndicator: {
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    handle: {
        backgroundColor: 'transparent',
    },
    backdrop: {
        position: 'absolute',
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#313131',
        opacity: 0.5
    },
});
