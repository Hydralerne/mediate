# Robot Eye Animation System

A high-performance, customizable animation system for robot eyes in React Native. This system provides extensive control over eye shapes, expressions, blinking patterns, and eye movements.

## Features

### Eye Shapes and Expressions
- **30+ Predefined Eye Shapes**: Including standard, happy, sad, surprised, thinking, confused, and more
- **Per-Shape Settings**: Each shape has its own set of properties:
  - Shape path generator function
  - Default settings (squint, scale, pupil size, etc.)
  - Blinking behavior configuration
- **Asymmetric Eye Shapes**: Certain shapes like 'thinking', 'confused', 'suspicious' have built-in asymmetry
  - Automatically mirrored for the right eye when needed
  - Smart recognition of position-aware shapes vs. symmetric shapes

### Blinking Controls
- **Shape-Based Blinking**: Each eye shape has its own blinking pattern:
  ```javascript
  blinking: {
    type: 'sync',   // 'sync', 'async'
    speed: 'normal', // 'fast', 'normal', 'slow'
    blinkCloseSpeed: 80, // milliseconds
    blinkOpenSpeed: 120, // milliseconds
  }
  ```
- **Manual Blink Trigger**:
  ```javascript
  // Trigger a blink for both eyes
  triggerBlink();
  
  // Trigger a blink for left eye only
  triggerBlink({ eye: 'left' });
  
  // Trigger a double blink for right eye
  triggerBlink({ eye: 'right', isDouble: true });
  ```

### Eye Movement Controls
- **Look At Coordinates**:
  ```javascript
  // Look straight ahead
  lookAt(0, 0);
  
  // Look up and right (values range from -1 to 1)
  lookAt(0.5, -0.3);
  
  // Look with one eye only
  lookAt(0.5, 0, { eye: 'left', duration: 300 });
  ```

- **Animation Modes**:
  ```javascript
  // Set animation mode
  setAnimation('idle');   // Options: idle, active, sleepy, alert, focused, nervous, confused
  ```

### Expression Controls
- **Temporary Expressions**:
  ```javascript
  // Show surprised expression for 1 second
  triggerExpression('surprised', { duration: 1000 });
  
  // Show angry expression on right eye only
  triggerExpression('angry', { eye: 'right', duration: 800 });
  ```

- **Emotion Intensity**:
  ```javascript
  // Apply moderate sadness
  applyEmotion('sad', { intensity: 0.7 });
  
  // Apply extreme happiness to left eye only
  applyEmotion('happy', { intensity: 1.5, eye: 'left' });
  ```

### Independent Eye Control
- **Set Different Moods Per Eye**:
  ```jsx
  // Using component props
  <Main leftMood="happy" rightMood="sad" />
  
  // Using controller functions
  setEyeMood('surprised', 'left');
  setEyeMood('skeptical', 'right');
  ```

## Usage

### Basic Component

```jsx
import Main from './screens/assistant/eye/Main';

// Basic usage with default settings
<Main />

// With custom size and colors
<Main 
  size={150} 
  color="#336699" 
  mood="happy" 
/>

// With independent eye control
<Main 
  leftMood="surprised" 
  rightMood="skeptical" 
  animation="active" 
/>
```

### With Controller Hook

```jsx
import { useEyeController } from './screens/assistant/eye/EyeController';

function MyComponent() {
  const { 
    setMood, 
    setEyeMood,
    triggerBlink, 
    triggerExpression,
    lookAt, 
    applyEmotion,
    setAnimation
  } = useEyeController();
  
  const handleButtonPress = () => {
    // Look at a point
    lookAt(0.3, -0.2);
    
    // Trigger a blink
    triggerBlink({ isDouble: true });
    
    // Show a temporary expression
    triggerExpression('surprised', { duration: 1000 });
    
    // Change animation mode - also changes all animation settings
    setAnimation('active');
  };
  
  return (
    <View>
      <Main />
      <Button title="React!" onPress={handleButtonPress} />
    </View>
  );
}
```

## Animation Settings

The `ANIMATIONS` object in `EyeUtils.js` defines different animation modes:

```javascript
export const ANIMATIONS = {
  // Default idle animation - occasional blinks, natural eye movements
  idle: {
    blinkInterval: [3000, 6000],     // Min/max milliseconds between blinks
    blinkSpeed: 1,                   // Relative speed multiplier
    eyeMovement: 'natural',          // Type of movement
    lookAroundInterval: [4000, 8000], // Min/max milliseconds between movements
    lookSpeed: 0.8,                  // Movement speed
    doubleBlinkChance: 0.2           // Probability of double blinks (0-1)
  },
  // ... other animation types
};
```

## Working with Asymmetric Eye Shapes

For asymmetric eye shapes, the system handles mirroring automatically:

1. **Position-Aware Shapes**: Shapes like 'thinking', 'suspicious', etc. accept a position parameter:
   ```javascript
   getPath: (width, height, position = 'left') => {
     const isRight = position === 'right';
     // Adjust path based on position
     // ...
   }
   ```

2. **Automatic Path Mirroring**: For other shapes, the system intelligently mirrors the SVG path.

When creating new asymmetric shapes, you have two options:
- Create a position-aware shape function that handles both left and right eyes
- Create a left-eye shape, and let the automatic mirroring system handle the right eye

## Performance Optimizations

The system is optimized for performance:

- Uses native animation driver for smooth animations
- Shares animation values when eyes are synced (reduces JS bridge traffic)
- Includes safety mechanisms to prevent animation buildup
- Implements proper cleanup of timers and animations
- Uses guard clauses to prevent unnecessary operations
- Periodically resets to center to prevent animation drift

## Customization

To add new eye shapes, edit the `eyeShapes` object in `EyeShapeConfigs.js`:

```javascript
export const eyeShapes = {
  myNewShape: {
    // Path generator function
    getPath: (width, height) => {
      // Return SVG path data string
      return `...`;
    },
    // Expression settings
    settings: {
      squint: 0.2,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.3,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.7
    },
    // Blinking behavior
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  }
}
``` 


## SVG conventer
```javascript
function convert(rawSvg) {
  const match = rawSvg.match(/<path[^>]+d="([^"]+)"/);
  if (!match) return '// No <path d="..."> found in SVG';

  const d = match[1];
  const commands = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
  if (!commands) return '// No path data found';

  // Extract numeric values to determine bounding box
  const nums = commands.filter(c => /^-?\d*\.?\d+$/.test(c)).map(parseFloat);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Find center to re-center the path
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  let output = 'const getPath = (width, height) => {\n' +
               '  const scale = Math.min(width, height) / 100;\n\n' +
               '  const pathData = `\n';

  const indent = '    ';
  let line = indent;
  let coordIndex = 0;
  let currentCommand = '';

  for (let i = 0; i < commands.length; i++) {
    const token = commands[i];

    if (/^[a-zA-Z]$/.test(token)) {
      if (line.trim() !== '') {
        output += line.trimEnd() + '\n';
        line = indent;
      }
      currentCommand = token;
      line += currentCommand + ' ';
      coordIndex = 0;
    } else {
      const num = parseFloat(token);
      const isX = coordIndex % 2 === 0;

      const centered = isX ? num - cx : num - cy;
      const expr = `\${${centered} * scale + ${isX ? 'width' : 'height'} / 2}`;
      line += expr;
      coordIndex++;

      const next = commands[i + 1];
      const nextIsNum = next && /^-?\d*\.?\d+$/.test(next);

      if (nextIsNum) {
        line += ', ';
      } else {
        output += line.trimEnd() + '\n';
        line = indent + '  ';
      }
    }
  }

  if (line.trim() !== '') output += line.trimEnd() + '\n';

  output += '  `;\n\n' +
            '  return pathData.replace(/\\s+/g, \' \').trim();\n' +
            '};';

  return output;
}


```
