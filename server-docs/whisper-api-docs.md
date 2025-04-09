# Oblien Whisper API Documentation

This document outlines the server-side API endpoints for handling audio transcription using OpenAI's Whisper model.

## Overview

The Whisper API is designed to handle real-time transcription of audio streams. It follows a session-based approach where:

1. Client creates a transcription session
2. Client uploads audio chunks to that session
3. Server processes chunks and returns partial transcriptions
4. Client finalizes the session to get the complete transcription

## API Endpoints

### Create Transcription Session

Creates a new transcription session for streaming audio.

```
POST /ai/whisper/session
```

#### Request Body

```json
{
  "format": "wav",
  "sampleRate": 44100,
  "language": "en"
}
```

- `format` (string): Audio format ('wav', 'm4a', etc.)
- `sampleRate` (number): Sample rate in Hz
- `language` (string): Language code for transcription (default: 'en')

#### Response

```json
{
  "sessionId": "abc123xyz789",
  "expiresAt": "2023-04-30T15:30:00Z"
}
```

- `sessionId` (string): Unique identifier for the transcription session
- `expiresAt` (string): ISO timestamp when the session will expire

### Upload Audio Chunk

Uploads a chunk of audio to an existing session and returns partial transcription if available.

```
POST /ai/whisper/upload/:sessionId
```

#### Request Body (multipart/form-data)

- `audio` (file): Audio chunk data
- `chunkIndex` (string): Index of the current chunk

#### Response

```json
{
  "success": true,
  "partialTranscription": "What templates...",
  "shouldStop": false
}
```

- `success` (boolean): Whether the chunk was successfully processed
- `partialTranscription` (string, optional): Partial transcription based on chunks received so far
- `shouldStop` (boolean): Indicates if the client should stop sending chunks (e.g., when silence is detected)

### Finalize Session

Finalizes a transcription session and returns the complete transcription.

```
POST /ai/whisper/finalize/:sessionId
```

#### Response

```json
{
  "transcription": "What templates do you recommend for a portfolio website?",
  "confidence": 0.98,
  "language": "en",
  "duration": 3.45
}
```

- `transcription` (string): Complete transcription of the audio
- `confidence` (number): Confidence score between 0 and 1
- `language` (string): Detected language code
- `duration` (number): Duration of the audio in seconds

## Server Implementation Notes

### Session Management

Sessions are maintained server-side and have the following lifecycle:

1. **Creation**: When a new session is created, a unique ID is generated and associated with a dedicated Whisper processing instance.
2. **Chunk Processing**: As chunks arrive, they are concatenated and processed in order.
3. **Partial Results**: After sufficient chunks are received, the server attempts to generate partial transcriptions.
4. **Finalization**: The session is completed and resources are freed.
5. **Expiration**: Sessions automatically expire after 5 minutes of inactivity.

### Audio Processing

The server processes audio in these steps:

1. **Chunk Buffering**: Audio chunks are buffered in memory or temp files
2. **Preprocessing**: Audio is normalized and prepared for the model
3. **Inference**: The Whisper model processes the audio
4. **Post-processing**: Results are formatted and returned to the client

### Performance Considerations

- **Chunk Size**: 4KB chunks provide a good balance between latency and overhead
- **Real-time Transcription**: The server processes chunks as they arrive
- **Scaling**: The API is designed to scale horizontally with multiple worker instances
- **Error Handling**: Failed chunk uploads can be retried without restarting the session

## Example Implementation (Node.js)

```javascript
// Example server implementation (pseudocode)
const express = require('express');
const { Whisper } = require('@openai/whisper-node');
const multer = require('multer');
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Session storage
const sessions = new Map();

// Create session endpoint
app.post('/ai/whisper/session', (req, res) => {
  const { format, sampleRate, language } = req.body;
  const sessionId = generateUniqueId();
  
  sessions.set(sessionId, {
    id: sessionId,
    format,
    sampleRate,
    language: language || 'en',
    chunks: [],
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    partialResult: ''
  });
  
  res.json({ 
    sessionId, 
    expiresAt: sessions.get(sessionId).expiresAt
  });
});

// Upload chunk endpoint
app.post('/ai/whisper/upload/:sessionId', upload.single('audio'), async (req, res) => {
  const { sessionId } = req.params;
  const { chunkIndex } = req.body;
  
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Store the chunk
  session.chunks[parseInt(chunkIndex)] = req.file.buffer;
  
  // Process chunks if we have enough
  let partialTranscription = '';
  if (session.chunks.length >= 5) {
    const audioBuffer = concatAudioChunks(session.chunks);
    partialTranscription = await processAudioWithWhisper(audioBuffer, session);
    session.partialResult = partialTranscription;
  }
  
  res.json({
    success: true,
    partialTranscription: session.partialResult,
    shouldStop: detectSilence(req.file.buffer)
  });
});

// Finalize session endpoint
app.post('/ai/whisper/finalize/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Process all chunks for final result
  const audioBuffer = concatAudioChunks(session.chunks);
  const result = await processAudioWithWhisper(audioBuffer, session, true);
  
  // Clean up session
  sessions.delete(sessionId);
  
  res.json({
    transcription: result.text,
    confidence: result.confidence,
    language: result.language,
    duration: audioBuffer.duration
  });
});

app.listen(3000, () => {
  console.log('Whisper API server running on port 3000');
});
``` 