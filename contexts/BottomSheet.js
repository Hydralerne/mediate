import React, { createContext, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';

const BottomSheetContext = createContext();

export const useBottomSheet = () => useContext(BottomSheetContext);

// Memoized content component to prevent re-renders
const MemoizedContent = React.memo(({ children }) => children);

export const BottomSheetProvider = ({ children }) => {
    const bottomSheetRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState(null);
    const [snapPointsConfig, setSnapPointsConfig] = useState(['35%']);
    const unmountTimeoutRef = useRef(null);
    
    // Simple flag to control unmounting
    const [shouldUnmount, setShouldUnmount] = useState(true);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (unmountTimeoutRef.current) {
                clearTimeout(unmountTimeoutRef.current);
            }
        };
    }, []);

    // Open with custom content and optional custom snap points
    const openBottomSheet = useMemo(() => (contentComponent, snapPoints = ['35%']) => {
        // Clear any pending unmount timeout
        if (unmountTimeoutRef.current) {
            clearTimeout(unmountTimeoutRef.current);
            unmountTimeoutRef.current = null;
        }
        
        // First set the content
        setContent(contentComponent);
        setSnapPointsConfig(snapPoints);
        
        // Prevent unmounting while sheet is open
        setShouldUnmount(false);
        
        // Then open the sheet
        requestAnimationFrame(() => {
            bottomSheetRef.current?.expand();
            setIsOpen(true);
        });
    }, []);

    const closeBottomSheet = useMemo(() => () => {
        // Just close the sheet, don't unmount yet
        bottomSheetRef.current?.close();
        setIsOpen(false);
        Keyboard.dismiss();
    }, []);

    // Handle actual unmounting separately from closing
    const handleSheetChanges = useMemo(() => (index) => {
        if (index === -1) {
            // Sheet is fully closed, wait a bit then allow unmounting
            // Clear any existing timeout first
            if (unmountTimeoutRef.current) {
                clearTimeout(unmountTimeoutRef.current);
            }
            
            unmountTimeoutRef.current = setTimeout(() => {
                setShouldUnmount(true);
                unmountTimeoutRef.current = null;
            }, 300);
        } else {
            // If sheet is opening, cancel any pending unmount
            if (unmountTimeoutRef.current) {
                clearTimeout(unmountTimeoutRef.current);
                unmountTimeoutRef.current = null;
            }
            setShouldUnmount(false);
        }
    }, []);

    // Effect to clear content when unmounting is allowed and sheet is closed
    useEffect(() => {
        if (shouldUnmount && !isOpen) {
            setContent(null);
        }
    }, [shouldUnmount, isOpen]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({ 
        openBottomSheet, 
        closeBottomSheet 
    }), [openBottomSheet, closeBottomSheet]);

    // Memoize the backdrop component
    const renderBackdrop = useMemo(() => (props) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        </TouchableWithoutFeedback>
    ), []);

    return (
        <BottomSheetContext.Provider value={contextValue}>
            {children}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPointsConfig}
                enablePanDownToClose
                enableHandlePanningGesture
                enableContentPanningGesture
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                onClose={() => {
                    setIsOpen(false);
                }}
                handleIndicatorStyle={styles.bottomSheetIndicator}
                backgroundStyle={styles.bottomSheetBackground}
            >
                <BottomSheetView style={styles.bottomSheetView}>
                    <MemoizedContent>
                        {content}
                    </MemoizedContent>
                </BottomSheetView>
            </BottomSheet>
        </BottomSheetContext.Provider>
    );
};

const styles = StyleSheet.create({
    bottomSheetView: {
        flex: 1,
    },
    bottomSheetBackground: {
        backgroundColor: 'white',
    },
    bottomSheetIndicator: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});

export default BottomSheetProvider;