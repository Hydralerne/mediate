import React, { createContext, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';

const BottomSheetContext = createContext();

export const useBottomSheet = () => useContext(BottomSheetContext);

// Memoized content component to prevent re-renders
const MemoizedContent = React.memo(({ children }) => children);

// Individual bottom sheet component
const SheetInstance = React.memo(({ 
  id, 
  content, 
  snapPoints, 
  isVisible, 
  zIndex, 
  onClose, 
  onAnimationEnd,
  setRef
}) => {
  const bottomSheetRef = useRef(null);
  const [shouldRenderContent, setShouldRenderContent] = useState(isVisible);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  
  // Expose methods to parent
  useEffect(() => {
    if (bottomSheetRef.current && setRef) {
      setRef({
        ...bottomSheetRef.current,
        setGestureEnabled: (enabled) => {
          setGestureEnabled(enabled);
        }
      });
    }
    
    return () => {
      if (setRef) {
        setRef(null);
      }
    };
  }, [setRef]);
  
  // Effect to control the sheet visibility
  useEffect(() => {
    if (isVisible) {
      // When opening, render content immediately
      setShouldRenderContent(true);
      bottomSheetRef.current?.expand();
    } else {
      // When closing, just close the sheet
      // Content will be unmounted after animation completes
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);
  
  // Memoize the backdrop component
  const renderBackdrop = useMemo(() => (props) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BottomSheetBackdrop 
        {...props} 
        appearsOnIndex={0} 
        disappearsOnIndex={-1} 
        opacity={0.5} // Slightly transparent to show stacking
      />
    </TouchableWithoutFeedback>
  ), []);
  
  // Handle sheet index changes
  const handleSheetChange = (index) => {
    if (index === -1) {
      // Sheet is fully closed
      // Wait for animation to complete before unmounting content
      setTimeout(() => {
        setShouldRenderContent(false);
      }, 300);
      
      // Notify parent that animation has ended
      onAnimationEnd(id);
    }
  };
  
  return (
    <View style={[styles.sheetContainer, { zIndex }]}>
      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose={gestureEnabled}
        enableHandlePanningGesture={gestureEnabled}
        enableContentPanningGesture={gestureEnabled}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        onClose={() => onClose(id)}
        handleIndicatorStyle={[
          styles.bottomSheetIndicator,
          !gestureEnabled && styles.disabledIndicator
        ]}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          {shouldRenderContent && (
            <MemoizedContent>
              {React.cloneElement(content, { bottomSheetRef: bottomSheetRef })}
            </MemoizedContent>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
});

export const BottomSheetProvider = ({ children }) => {
  // State to track all active sheets
  const [sheets, setSheets] = useState([]);
  // Counter for generating unique IDs
  const nextIdRef = useRef(0);
  // Track sheets pending removal
  const [pendingRemovals, setPendingRemovals] = useState({});
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingRemovals).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [pendingRemovals]);

  // Open a new bottom sheet
  const openBottomSheet = useMemo(() => (contentComponent, snapPoints = ['35%']) => {
    const id = `sheet-${nextIdRef.current++}`;
    
    // Add the new sheet to the stack
    setSheets(prevSheets => [
      ...prevSheets,
      {
        id,
        content: contentComponent,
        snapPoints,
        isVisible: true,
        createdAt: Date.now()
      }
    ]);
    
    // Return the sheet ID so it can be referenced later
    return id;
  }, []);

  // Close a specific bottom sheet by ID
  const closeBottomSheet = useMemo(() => (sheetId) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === sheetId 
          ? { ...sheet, isVisible: false } 
          : sheet
      )
    );
    
    Keyboard.dismiss();
  }, []);
  
  // Close the top-most sheet if no ID is provided
  const closeTopSheet = useMemo(() => () => {
    setSheets(prevSheets => {
      if (prevSheets.length === 0) return prevSheets;
      
      // Find the top-most visible sheet
      const visibleSheets = prevSheets.filter(s => s.isVisible);
      if (visibleSheets.length === 0) return prevSheets;
      
      // Sort by creation time (newest first)
      const sortedSheets = [...visibleSheets].sort((a, b) => b.createdAt - a.createdAt);
      const topSheetId = sortedSheets[0].id;
      
      // Mark it as not visible
      return prevSheets.map(sheet => 
        sheet.id === topSheetId 
          ? { ...sheet, isVisible: false } 
          : sheet
      );
    });
    
    Keyboard.dismiss();
  }, []);
  
  // Close all sheets
  const closeAllSheets = useMemo(() => () => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => ({ ...sheet, isVisible: false }))
    );
    
    Keyboard.dismiss();
  }, []);

  // Handle when a sheet animation ends (fully closed)
  const handleSheetAnimationEnd = useMemo(() => (sheetId) => {
    // Set a timeout to remove the sheet from the DOM
    const timeout = setTimeout(() => {
      setSheets(prevSheets => prevSheets.filter(sheet => sheet.id !== sheetId));
      setPendingRemovals(prev => {
        const newPending = { ...prev };
        delete newPending[sheetId];
        return newPending;
      });
    }, 300);
    
    // Track the timeout so we can clear it if needed
    setPendingRemovals(prev => ({
      ...prev,
      [sheetId]: timeout
    }));
  }, []);

  // Memoize the context value
  const contextValue = useMemo(() => ({ 
    openBottomSheet, 
    closeBottomSheet,
    closeTopSheet,
    closeAllSheets
  }), [openBottomSheet, closeBottomSheet, closeTopSheet, closeAllSheets]);

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
      
      {/* Render all sheets in the stack */}
      {sheets.map((sheet, index) => (
        <SheetInstance
          key={sheet.id}
          id={sheet.id}
          content={sheet.content}
          snapPoints={sheet.snapPoints}
          isVisible={sheet.isVisible}
          zIndex={1000 + index} // Ensure proper stacking
          onClose={closeBottomSheet}
          onAnimationEnd={handleSheetAnimationEnd}
        />
      ))}
    </BottomSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bottomSheetView: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
  },
  bottomSheetIndicator: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  disabledIndicator: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default BottomSheetProvider;