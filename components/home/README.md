# Home Components

Components for the Medical Research Agent's main chat interface.

## Components

### **Header.jsx**
- **Purpose**: Top navigation bar
- **Features**:
  - Menu button (opens drawer)
  - App title: "Medical Research AI"
  - Info/Settings button
  - Safe area aware (adjusts for notch/status bar)

### **ChatInput.jsx**
- **Purpose**: Input interface for user queries
- **Location**: Bottom of screen
- **Props**:
  - `onSend`: Callback function when user sends a message
  - `disabled`: Boolean to disable input (default: false)

#### Features:
- **Multi-line text input** with 1000 character limit
- **Suggestion pills** for quick queries (e.g., "Latest CVD treatments", "Cancer immunotherapy")
- **Attachment button** for uploading files/images
- **Dynamic send button** that activates when text is entered
- **Character counter** showing usage (e.g., "0/1000")
- **Keyboard aware** - adjusts properly on iOS and Android
- **Safe area aware** - respects bottom insets (iPhone home indicator)

## Layout

```
┌─────────────────────────────────┐
│  [Menu] Medical Research AI [ℹ️] │  ← Header
├─────────────────────────────────┤
│                                 │
│                                 │
│     Chat Content Area           │
│     (Messages will go here)     │
│                                 │
│                                 │
├─────────────────────────────────┤
│  [Latest CVD] [Cancer immuno]   │  ← Suggestion Pills
│                                 │
│  ┌─────────────────────────┐   │
│  │ Ask me anything... [📎] │ [→]│  ← ChatInput
│  └─────────────────────────┘   │
│                      0/1000     │
└─────────────────────────────────┘
```

## Integration

The components are integrated in `/screens/Home.jsx`:

```jsx
import Header from '../components/home/Header';
import ChatInput from '../components/home/ChatInput';

// In component:
<Header navigation={navigation} />
<ChatInput onSend={handleSendMessage} />
```

## Styling

- **Theme**: Dark mode optimized
- **Colors**: Uses app's color palette from `utils/colors.js`
- **Primary color**: Blue (#3B82F6)
- **Background**: Black (#000)
- **Text**: White with various opacity levels

## Future Enhancements

- [ ] Add chat messages display component
- [ ] Implement file upload functionality
- [ ] Add voice input support
- [ ] Show typing indicators
- [ ] Add message streaming for AI responses
- [ ] Implement markdown rendering for medical formulas
- [ ] Add citation/reference support for research papers

