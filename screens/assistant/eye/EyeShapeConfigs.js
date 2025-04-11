/**
 * EyeShapeConfigs.js
 * 
 * Unified configuration for robot eye shapes and expressions.
 * Each shape contains both the path generation function and settings.
 */

// ========================================
// EYE SHAPES & EXPRESSIONS
// ========================================

import * as shapes from './shapes';


/**
 * Unified eye shapes object - contains both path generators and settings
 */
export const eyeShapes = {
  // Standard neutral circle
  standard: {
    // Path generator function
    getPath: shapes.standard,
    // Expression settings
    settings: {
      squint: 2,
      eyeScale: 1,
      eyeTransformY: 0,
      pupilSize: 0.3,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.7
    },
    // Blinking behavior
    blinking: {
      type: 'sync', // sync, async, or independent
      speed: 'normal', // fast, normal, or slow
      blinkCloseSpeed: 80, // ms
      blinkOpenSpeed: 120, // ms
    }
  },

  // Happy curved eye
  happy: {
    getPath: shapes.happy,
    settings: {
      squint: 0.3,
      eyeScale: 0.8,
      eyeTransformY: 0,
      pupilSize: 0.35,
      lookTargetX: 0,
      lookTargetY: -0.05,
      pupilConstraintX: 0.6,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Excited happy eyes - more open
  excited: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.6}
        Q ${width * 0.5} ${height * 0.1} ${width} ${height * 0.6}
        Q ${width * 0.8} ${height * 0.8} ${width * 0.5} ${height * 0.8}
        Q ${width * 0.2} ${height * 0.8} 0 ${height * 0.6}
        Z
      `.trim();
    },
    settings: {
      squint: -0.2,
      eyeScale: 1,
      eyeTransformY: 0,
      pupilSize: 0.45,
      lookTargetX: 0,
      lookTargetY: -0.05,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.8
    },
    blinking: {
      type: 'sync',
      speed: 'fast',
      blinkCloseSpeed: 60,
      blinkOpenSpeed: 90,
    }
  },

  // Happy bean shape
  joyful: {
    getPath: shapes.happy,
    settings: {
      squint: 0.2,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.4,
      lookTargetX: 0,
      lookTargetY: -0.1,
      pupilConstraintX: 0.6,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 70,
      blinkOpenSpeed: 110,
    }
  },

  // Sad downward curve
  sad: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.4}
        Q ${width * 0.5} ${height * 0.9} ${width} ${height * 0.4}
        Q ${width * 0.8} ${height * 0.2} ${width * 0.5} ${height * 0.2}
        Q ${width * 0.2} ${height * 0.2} 0 ${height * 0.4}
        Z
      `.trim();
    },
    settings: {
      squint: 0.2,
      eyeScale: 0.8,
      eyeTransformY: 0,
      pupilSize: 0.25,
      lookTargetX: 0,
      lookTargetY: 0.05,
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.6
    },
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 90,
      blinkOpenSpeed: 130,
    }
  },

  // More pronounced sadness
  depressed: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.4}
        Q ${width * 0.5} ${height * 0.9} ${width} ${height * 0.4}
        Q ${width * 0.8} ${height * 0.2} ${width * 0.5} ${height * 0.2}
        Q ${width * 0.2} ${height * 0.2} 0 ${height * 0.4}
        Z
      `.trim();
    },
    settings: {
      squint: 0.4,
      eyeScale: 0.7,
      eyeTransformY: -3,
      pupilSize: 0.2,
      lookTargetX: 0,
      lookTargetY: 0.1,
      pupilConstraintX: 0.4,
      pupilConstraintY: 0.5
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 100,
      blinkOpenSpeed: 140,
    }
  },

  // Sad bean shape
  melancholy: {
    getPath: (width, height) => {
      const curveHeight = height * 0.3;
      return `
        M 0 ${height * 0.5}
        Q ${width * 0.5} ${curveHeight} ${width} ${height * 0.5}
        Q ${width * 0.5} ${height * 0.9} 0 ${height * 0.5}
        Z
      `.trim();
    },
    settings: {
      squint: 0.3,
      eyeScale: 0.8,
      eyeTransformY: -2,
      pupilSize: 0.25,
      lookTargetX: 0,
      lookTargetY: 0.1,
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.6
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 110,
      blinkOpenSpeed: 150,
    }
  },

  // Sharp angular angry eyes
  angry: {
    getPath: shapes.angry,
    settings: {
    },
    blinking: {
      type: 'sync',
      speed: 'fast',
      blinkCloseSpeed: 70,
      blinkOpenSpeed: 100,
    }
  },

  // More extreme anger
  furious: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.65}
        L ${width * 0.2} ${height * 0.25}
        L ${width * 0.8} ${height * 0.25}
        L ${width} ${height * 0.65}
        L ${width} ${height * 0.8}
        L 0 ${height * 0.8}
        Z
      `.trim();
    },
    settings: {
      squint: 0.5,
      eyeScale: 0.6,
      eyeTransformY: -5,
      pupilSize: 0.3,
      lookTargetX: 0,
      lookTargetY: -0.15,
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.5
    },
    blinking: {
      type: 'sync',
      speed: 'fast',
      blinkCloseSpeed: 60,
      blinkOpenSpeed: 90,
    }
  },

  // Wide surprised eyes
  surprised: {
    getPath: (width, height) => {
      // Wider ellipse
      const radiusX = width / 2 * 1.1;
      const radiusY = height / 2 * 1.2;

      return `M ${width / 2},0 A ${radiusX},${radiusY} 0 1,1 ${width / 2},${height} A ${radiusX},${radiusY} 0 1,1 ${width / 2},0 Z`;
    },
    settings: {
      squint: -0.3, // negative means eyes are more open
      eyeScale: 1.2,
      eyeTransformY: 0,
      pupilSize: 0.4,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.8
    },
    blinking: {
      type: 'sync',
      speed: 'fast',
      blinkCloseSpeed: 60,
      blinkOpenSpeed: 90,
    }
  },

  // Extreme surprise
  shocked: {
    getPath: (width, height) => {
      // Larger perfect circle
      const scale = 1.2;
      const radiusX = width / 2 * scale;
      const radiusY = height / 2 * scale;
      const centerX = width / 2;
      const centerY = height / 2;

      return `M ${centerX},${centerY - radiusY} A ${radiusX},${radiusY} 0 1,1 ${centerX},${centerY + radiusY} A ${radiusX},${radiusY} 0 1,1 ${centerX},${centerY - radiusY} Z`;
    },
    settings: {
      squint: -0.5, // very wide open
      eyeScale: 1.3,
      eyeTransformY: 0,
      pupilSize: 0.5,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.8
    },
    blinking: {
      type: 'sync',
      speed: 'fast',
      blinkCloseSpeed: 60,
      blinkOpenSpeed: 90,
    }
  },

  // Tired half-closed eyes
  tired: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.3}
        L ${width} ${height * 0.3}
        L ${width} ${height * 0.7}
        L 0 ${height * 0.7}
        Z
      `.trim();
    },
    settings: {
      squint: 0.6,
      eyeScale: 0.6,
      eyeTransformY: 0,
      pupilSize: 0.2,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.4,
      pupilConstraintY: 0.4
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 110,
      blinkOpenSpeed: 150,
    }
  },

  // Sleepy eyes
  sleepy: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.3}
        L ${width} ${height * 0.3}
        L ${width} ${height * 0.7}
        L 0 ${height * 0.7}
        Z
      `.trim();
    },
    settings: {
      squint: 0.5,
      eyeScale: 0.7,
      eyeTransformY: 0,
      pupilSize: 0.25,
      lookTargetX: 0,
      lookTargetY: 0.05,
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.5
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 110,
      blinkOpenSpeed: 150,
    }
  },

  // Thinking asymmetric eyes
  thinking: {
    // Position parameter makes this asymmetric
    getPath: (width, height, position = 'left') => {
      // Simple shape with one side higher than the other
      const isRight = position === 'right';
      const offset = isRight ? height * 0.15 : 0;

      return `
        M 0 ${height * 0.4 - offset}
        L ${width} ${height * 0.4 + offset}
        L ${width} ${height * 0.8}
        L 0 ${height * 0.8}
        Z
      `.trim();
    },
    settings: {
      squint: 0.2,
      eyeScale: 0.8,
      eyeTransformY: 0,
      pupilSize: 0.3,
      lookTargetX: 0.1,
      lookTargetY: 0.1, // looking up
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.5
    },
    blinking: {
      type: 'async',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Confused asymmetric eyes
  confused: {
    // Position parameter makes this asymmetric
    getPath: (width, height, position = 'left') => {
      // Simple shape with one side higher than the other
      const isRight = position === 'right';
      const offset = isRight ? height * 0.15 : 0;

      return `
        M 0 ${height * 0.4 - offset}
        L ${width} ${height * 0.4 + offset}
        L ${width} ${height * 0.8}
        L 0 ${height * 0.8}
        Z
      `.trim();
    },
    settings: {
      squint: 0.1,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.3,
      lookTargetX: 0.1,
      lookTargetY: 0,
      pupilConstraintX: 0.6,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'async',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Suspicious eyes
  suspicious: {
    // Position parameter makes this asymmetric
    getPath: (width, height, position = 'left') => {
      const isRight = position === 'right';
      // For right eye, make top slightly higher on outer edge
      // For left eye, make top slightly higher on inner edge
      const leftTopY = height * (isRight ? 0.35 : 0.45);
      const rightTopY = height * (isRight ? 0.45 : 0.35);

      return `
        M 0 ${leftTopY}
        L ${width} ${rightTopY}
        L ${width} ${height * 0.65}
        L 0 ${height * 0.65}
        Z
      `.trim();
    },
    settings: {
      squint: 0.3,
      eyeScale: 0.7,
      eyeTransformY: -2,
      pupilSize: 0.3,
      lookTargetX: 0.2, // looking to the side
      lookTargetY: 0,
      pupilConstraintX: 0.5,
      pupilConstraintY: 0.6
    },
    blinking: {
      type: 'async',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Skeptical expression
  skeptical: {
    // Position parameter makes this asymmetric
    getPath: (width, height, position = 'left') => {
      const isRight = position === 'right';
      // For right eye, make top slightly higher on outer edge
      // For left eye, make top slightly higher on inner edge
      const leftTopY = height * (isRight ? 0.35 : 0.45);
      const rightTopY = height * (isRight ? 0.45 : 0.35);

      return `
        M 0 ${leftTopY}
        L ${width} ${rightTopY}
        L ${width} ${height * 0.65}
        L 0 ${height * 0.65}
        Z
      `.trim();
    },
    settings: {
      squint: 0.4,
      eyeScale: 0.6,
      eyeTransformY: -3,
      pupilSize: 0.3,
      lookTargetX: 0.15,
      lookTargetY: -0.05,
      pupilConstraintX: 0.6,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'async',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Flat bored eyes
  bored: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.45}
        L ${width} ${height * 0.45}
        L ${width} ${height * 0.55}
        L 0 ${height * 0.55}
        Z
      `.trim();
    },
    settings: {
      squint: 0.2,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.25,
      lookTargetX: 0,
      lookTargetY: 0.1, // looking down
      pupilConstraintX: 0.6,
      pupilConstraintY: 0.6
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 100,
      blinkOpenSpeed: 140,
    }
  },

  // Neutral expression
  neutral: {
    getPath: (width, height) => {
      return `M ${width / 2},0 A ${width / 2},${height / 2} 0 1,1 ${width / 2},${height} A ${width / 2},${height / 2} 0 1,1 ${width / 2},0 Z`;
    },
    settings: {
      squint: 0.1,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.3,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Almond-shaped natural eyes
  natural: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.5}
        Q ${width * 0.1} ${height * 0.1} ${width * 0.5} ${height * 0.1}
        Q ${width * 0.9} ${height * 0.1} ${width} ${height * 0.5}
        Q ${width * 0.9} ${height * 0.9} ${width * 0.5} ${height * 0.9}
        Q ${width * 0.1} ${height * 0.9} 0 ${height * 0.5}
        Z
      `.trim();
    },
    settings: {
      squint: 0.1,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.35,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  },

  // Relaxed almond eyes
  relaxed: {
    getPath: (width, height) => {
      return `
        M 0 ${height * 0.5}
        Q ${width * 0.1} ${height * 0.1} ${width * 0.5} ${height * 0.1}
        Q ${width * 0.9} ${height * 0.1} ${width} ${height * 0.5}
        Q ${width * 0.9} ${height * 0.9} ${width * 0.5} ${height * 0.9}
        Q ${width * 0.1} ${height * 0.9} 0 ${height * 0.5}
        Z
      `.trim();
    },
    settings: {
      squint: 0.3,
      eyeScale: 0.8,
      eyeTransformY: 0,
      pupilSize: 0.3,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 110,
      blinkOpenSpeed: 150,
    }
  },

  // Fearful wide eyes
  fearful: {
    getPath: (width, height) => {
      const scale = 1.2;
      const radiusX = width / 2 * scale;
      const radiusY = height / 2 * scale;
      const centerX = width / 2;
      const centerY = height / 2;

      return `M ${centerX},${centerY - radiusY} A ${radiusX},${radiusY} 0 1,1 ${centerX},${centerY + radiusY} A ${radiusX},${radiusY} 0 1,1 ${centerX},${centerY - radiusY} Z`;
    },
    settings: {
      squint: -0.25,
      eyeScale: 1.2,
      eyeTransformY: -3,
      pupilSize: 0.5,
      lookTargetX: 0,
      lookTargetY: -0.1,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.8
    },
    blinking: {
      type: 'sync',
      speed: 'fast',
      blinkCloseSpeed: 60,
      blinkOpenSpeed: 90,
    }
  },

  // Nervous eyes
  nervous: {
    getPath: (width, height) => {
      return `M ${width / 2},0 A ${width / 2},${height / 2} 0 1,1 ${width / 2},${height} A ${width / 2},${height / 2} 0 1,1 ${width / 2},0 Z`;
    },
    settings: {
      squint: 0.05,
      eyeScale: 1.05,
      eyeTransformY: -1,
      pupilSize: 0.35,
      lookTargetX: 0.2,
      lookTargetY: 0.1,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'async',
      speed: 'fast',
      blinkCloseSpeed: 70,
      blinkOpenSpeed: 100,
    }
  },

  // Focused eyes
  focused: {
    getPath: (width, height) => {
      const yScale = 0.7;
      const radiusY = height / 2 * yScale;
      return `M ${width / 2},0 A ${width / 2},${radiusY} 0 1,1 ${width / 2},${height} A ${width / 2},${radiusY} 0 1,1 ${width / 2},0 Z`;
    },
    settings: {
      squint: 0.1,
      eyeScale: 0.9,
      eyeTransformY: 0,
      pupilSize: 0.4,
      lookTargetX: 0,
      lookTargetY: 0,
      pupilConstraintX: 0.6,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'slow',
      blinkCloseSpeed: 90,
      blinkOpenSpeed: 130,
    }
  },

  // Interested eyes
  interested: {
    getPath: (width, height) => {
      return `M ${width / 2},0 A ${width / 2},${height / 2} 0 1,1 ${width / 2},${height} A ${width / 2},${height / 2} 0 1,1 ${width / 2},0 Z`;
    },
    settings: {
      squint: -0.1,
      eyeScale: 1.1,
      eyeTransformY: -1,
      pupilSize: 0.4,
      lookTargetX: 0,
      lookTargetY: -0.05,
      pupilConstraintX: 0.7,
      pupilConstraintY: 0.7
    },
    blinking: {
      type: 'sync',
      speed: 'normal',
      blinkCloseSpeed: 80,
      blinkOpenSpeed: 120,
    }
  }
};
/**
 * Mirror an SVG path horizontally for right eye rendering
 * @param {string} path - Original SVG path
 * @param {number} width - Eye width
 * @returns {string} - Mirrored path
 */
export const mirrorPathHorizontally = (path, width) => {
  // This function transforms an SVG path by mirroring it horizontally
  // across the center of the width

  // Replace all x coordinates in the path, keeping y coordinates the same
  // Process SVG commands and coordinates
  let mirrored = '';
  const pathCommands = path.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

  for (let i = 0; i < pathCommands.length; i++) {
    const command = pathCommands[i];
    const cmdLetter = command.charAt(0);
    const isRelative = cmdLetter.toLowerCase() === cmdLetter;
    const coords = command.slice(1).trim().split(/[\s,]+/).map(parseFloat);

    mirrored += cmdLetter;

    // Process based on command type
    switch (cmdLetter.toLowerCase()) {
      case 'm': // moveto
      case 'l': // lineto
        // These take pairs of x,y coords
        for (let j = 0; j < coords.length; j += 2) {
          if (j > 0) mirrored += ' ';
          // Mirror x coordinate
          if (!isRelative) {
            mirrored += `${width - coords[j]}`;
          } else {
            mirrored += `${-coords[j]}`;
          }
          // Keep y coordinate
          if (j + 1 < coords.length) {
            mirrored += ` ${coords[j + 1]}`;
          }
        }
        break;

      case 'h': // horizontal lineto
        // These take only x coords
        for (let j = 0; j < coords.length; j++) {
          if (j > 0) mirrored += ' ';
          if (!isRelative) {
            mirrored += `${width - coords[j]}`;
          } else {
            mirrored += `${-coords[j]}`;
          }
        }
        break;

      case 'v': // vertical lineto
        // These take only y coords - no change needed
        mirrored += command.slice(1);
        break;

      case 'c': // curveto
        // These take 3 pairs of x,y coords
        for (let j = 0; j < coords.length; j += 2) {
          if (j > 0) mirrored += ' ';
          // Mirror x coordinate
          if (!isRelative) {
            mirrored += `${width - coords[j]}`;
          } else {
            mirrored += `${-coords[j]}`;
          }
          // Keep y coordinate
          if (j + 1 < coords.length) {
            mirrored += ` ${coords[j + 1]}`;
          }
        }
        break;

      case 'a': // elliptical arc
        // Format: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        for (let j = 0; j < coords.length; j += 7) {
          if (j > 0) mirrored += ' ';
          // rx, ry, x-axis-rotation stay the same
          mirrored += `${coords[j]} ${coords[j + 1]} ${coords[j + 2]}`;

          // large-arc-flag and sweep-flag stay the same
          mirrored += ` ${coords[j + 3]} ${coords[j + 4]}`;

          // Mirror x coordinate
          if (!isRelative) {
            mirrored += ` ${width - coords[j + 5]}`;
          } else {
            mirrored += ` ${-coords[j + 5]}`;
          }

          // Keep y coordinate
          mirrored += ` ${coords[j + 6]}`;
        }
        break;

      default:
        // For unsupported commands, keep as is
        mirrored += command.slice(1);
    }

    mirrored += ' ';
  }

  return mirrored.trim();
};

/**
 * Get path for the appropriate eye position (left or right)
 * @param {function} pathGenerator - Function that generates the eye path
 * @param {number} width - Eye width
 * @param {number} height - Eye height
 * @param {string} position - 'left' or 'right'
 * @returns {string} - SVG path appropriate for the eye position
 */
export const getPositionAwarePath = (pathGenerator, width, height, position) => {
  // For position-aware shapes, use their built-in positioning
  if (pathGenerator.length >= 3) {
    return pathGenerator(width, height, position);
  }

  // For shapes without position parameter, mirror the path for right eye
  const originalPath = pathGenerator(width, height);
  if (position === 'right') {
    // For asymmetric shapes that don't handle position internally,
    // we apply a transform to mirror the path horizontally
    return mirrorPathHorizontally(originalPath, width);
  }

  return originalPath;
};

/**
 * Get the eye shape function based on expression name
 * 
 * @param {string} expressionName - The name of the expression
 * @returns {function} - The shape generator function
 */
export const getExpressionShape = (expressionName) => {
  const expression = typeof expressionName === 'string' ? expressionName.toLowerCase() : 'standard';
  return eyeShapes[expression]?.getPath || eyeShapes.standard.getPath;
};

/**
 * Get the expression settings based on the expression name
 * 
 * @param {string} expressionName - The name of the expression
 * @returns {object} - The expression settings
 */
export const getExpressionSettings = (expressionName) => {
  const expression = typeof expressionName === 'string' ? expressionName.toLowerCase() : 'standard';
  return eyeShapes[expression]?.settings || eyeShapes.standard.settings;
}; 