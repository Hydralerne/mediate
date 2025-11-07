import React, { useState, useEffect, useRef, memo } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import AIView from '../components/AIView';
import CaptionsViewer from '../components/CaptionsViewer';
import AnalyzingEffect from '../components/AnalyzingEffect';
import WelcomeMessage from '../components/WelcomeMessage';

const VoiceAssistant = ({ audioLevel = 0, variationRef, captionsData, captionsSound, analysing, handleCaptionsEnd }) => {

    return (
        <View style={{
            flex: 1,
        }}>
            <AIView audioLevel={audioLevel} variationRef={variationRef} />
            {captionsData && captionsSound ? (
                <CaptionsViewer
                    captions={captionsData}
                    soundObject={captionsSound}
                    onCaptionsEnd={handleCaptionsEnd}
                />
            ) :
                analysing || true ? (
                    <AnalyzingEffect analysing={"Processing your request and searching"} />
                ) : (
                    <WelcomeMessage />
                )}
        </View>
    )
}

export default VoiceAssistant;