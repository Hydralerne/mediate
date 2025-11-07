# ONVO AI Assistant

## Overview
The ONVO AI Assistant provides users with a voice-powered and text-based interface to interact with the ONVO website builder. It helps users create and modify their websites through natural conversations, making the website building process more accessible and efficient.

## Features
- **Live Voice Streaming**: Real-time audio capture and streaming for instant voice-to-text conversion.
- **Visual Audio Feedback**: Dynamic visualizers that respond to audio input levels.
- **Live Transcription**: Shows the transcription as it's being processed, updating in real-time.
- **Text-based Chat**: Traditional text input for typing questions and commands.
- **Intelligent Responses**: The assistant provides contextually relevant information about website building, templates, and best practices.
- **Responsive UI**: Automatically adjusts when keyboard appears/disappears.
- **Futuristic Design**: Modern interface with subtle animations that give it a premium feel.

## Components
- **Main.jsx**: The primary screen component that integrates all features.
- **LiveAudioVisualizer.jsx**: Animated audio waveform that reacts to voice levels in real-time.
- **LiveTranscription.jsx**: Component that shows the live speech-to-text results as they are processed.
- **VoiceWaveform.jsx**: Simpler animated waveform visualization.
- **MessageBubble.jsx**: Component to display user messages.
- **AssistantResponse.jsx**: Animated component for AI assistant responses with typing effect.

## Services
- **AudioStreamService.js**: Handles real-time voice recording and streaming to the server with audio level monitoring.
- **AssistantAPI.js**: Manages communication with the AI backend for processing queries and generating responses.

## Implementation Notes
- **Real-time Streaming**: The assistant uses chunked audio streaming to send voice data as it's being recorded, rather than waiting for a complete recording.
- **Audio Level Detection**: Monitors audio input levels to provide visual feedback during recording.
- **Proper Keyboard Handling**: Uses KeyboardAvoidingView with proper offsets to ensure content remains visible when the keyboard appears.
- **SafeArea Support**: Respects device safe areas to display properly on all iOS and Android devices.
- **Dark/Light Mode**: Automatically adapts to system theme changes.

## Technical Details
### Voice Streaming
The implementation simulates streaming audio chunks to a server in real-time:

1. Audio is recorded using Expo's Audio API
2. The recording is divided into chunks (simulated in this demo)
3. Each chunk is sent to the server as it's being recorded
4. The server processes the partial audio and sends back intermediate transcription results
5. The UI displays these intermediate results, updating as more audio is processed
6. When recording stops, the final transcription is determined and used for AI processing

This approach provides a more responsive experience than waiting for the entire recording to complete before processing.

## Getting Started
To integrate the AI Assistant into your navigation:

```javascript
import AssistantScreen from '../screens/assistant';

// Add to your navigation stack
<Stack.Screen name="AssistantScreen" component={AssistantScreen} />
```

## Future Enhancements
- WebSocket integration for true real-time communication
- Multi-turn conversations with context memory
- Voice activity detection for automatic recording start/stop
- Support for multiple languages
- Direct website manipulation through voice commands
- AI-powered suggestions based on user's website content and style 