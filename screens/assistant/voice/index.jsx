import React, { useState, useEffect, useRef, memo } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import AIView from '../components/AIView';
import CaptionsViewer from '../components/CaptionsViewer';
import AnalyzingEffect from '../components/AnalyzingEffect';
import WelcomeMessage from '../components/WelcomeMessage';

const voiceAssistant = ({ audioLevel = 0, variationRef, captionsData, captionsSound, analysing, handleCaptionsEnd }) => {

    return (
        <View style={styles.emptyState}>
            <AIView audioLevel={audioLevel} variationRef={variationRef} />
            {captionsData && captionsSound ? (
                <CaptionsViewer
                    captions={captionsData}
                    soundObject={captionsSound}
                    onCaptionsEnd={handleCaptionsEnd}
                />
            ) :
                analysing ? (
                    <AnalyzingEffect analysing={analysing} />
                ) : (
                    <WelcomeMessage />
                )}
        </View>
    )
}

export default voiceAssistant;