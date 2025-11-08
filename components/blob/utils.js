import { Dimensions } from 'react-native';

// Animation patterns
export const PATTERNS = {
    CIRCULAR: 'circular',
    WAVE: 'wave',
    RANDOM: 'random',
    SPIRAL: 'spiral'
};
  
// Animation functions for different patterns
export const animationPatterns = {
    // Simple circular motion
    [PATTERNS.CIRCULAR]: (params) => {
        const { centerX, centerY, angle, baseR, maxRadiusPercent } = params;
        const x = centerX + Math.cos(angle) * (baseR * maxRadiusPercent);
        const y = centerY + Math.sin(angle) * (baseR * maxRadiusPercent);
        return { x, y };
    },

    // Wavy circular motion
    [PATTERNS.WAVE]: (params) => {
        const { centerX, centerY, angle, baseR, maxRadius, waveFrequency, waveAmplitude, audioFactor } = params;
        const waveOffset = Math.sin(angle * waveFrequency) * waveAmplitude * audioFactor;
        const x = centerX + Math.cos(angle) * Math.min(baseR + waveOffset, maxRadius);
        const y = centerY + Math.sin(angle) * Math.min(baseR + waveOffset, maxRadius);
        return { x, y };
    },

    // Random movement with coherence
    [PATTERNS.RANDOM]: (params) => {
        const {
            centerX, centerY, angle, baseR, maxRadius, randomness, normalizedAudioLevel,
            currentRadius, updateRadius, updateAngle
        } = params;

        // Scale randomness by audio level - more contained at low levels
        const scaledRandomness = randomness * (0.2 + normalizedAudioLevel * 0.8);

        // Add some randomness to angle and radius
        const randomAngleOffset = (Math.random() * 2 - 1) * scaledRandomness * Math.PI;
        const randomRadiusOffset = (Math.random() * 2 - 1) * scaledRandomness * baseR;

        // Update angle
        updateAngle(randomAngleOffset);

        // Update radius with audio-based constraints
        const newRadius = currentRadius + randomRadiusOffset;
        updateRadius(Math.max(10, Math.min(newRadius, maxRadius)));

        // Calculate position with the constrained radius
        let x = centerX + Math.cos(angle) * currentRadius;
        let y = centerY + Math.sin(angle) * currentRadius;

        // Add stronger pull toward center when audio is low
        if (normalizedAudioLevel < 0.9) {
            const centerPull = 1 - normalizedAudioLevel;
            x = x * (1 - centerPull * 0.3) + centerX * (centerPull * 0.3);
            y = y * (1 - centerPull * 0.3) + centerY * (centerPull * 0.3);
        }

        return { x, y };
    },

    // Expanding/contracting spiral
    [PATTERNS.SPIRAL]: (params) => {
        const {
            centerX, centerY, angle, baseR, maxRadius, spiralExpansion,
            deltaTime, normalizedAudioLevel, currentRadius, updateRadius
        } = params;

        // Update radius for spiral, constrained by max radius
        const newSpiralRadius = currentRadius +
            spiralExpansion * baseR * deltaTime * (1 + normalizedAudioLevel * 5);

        // Constrain spiral radius by audio level
        updateRadius(Math.min(newSpiralRadius, maxRadius));

        // Reset spiral when it gets too large
        if (currentRadius > maxRadius * 0.95) {
            updateRadius(10);
        }

        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;

        return { x, y };
    }
};
// Main touch movement simulation controller - OPTIMIZED
export const createTouchSimulator = (refs) => {
    const {
        touchPositionRef,
        animationStateRef,
        audioLevelRef,
        edgePointsRef,
        lastUpdateTimeRef
    } = refs;

    // Cache frequently used values
    let cachedNormalizedAudio = 0;
    let cacheTime = 0;
    const CACHE_DURATION = 50; // ms - reuse normalized audio for 50ms

    return {
        // Main simulation function - OPTIMIZED
        simulate: (params = {}) => {
            const now = performance.now();
            
            // Cache normalized audio to avoid recalculating every frame
            if (now - cacheTime > CACHE_DURATION) {
                const rawAudioLevel = audioLevelRef.current;
                cachedNormalizedAudio = normalizeAudioLevel(rawAudioLevel);
                cacheTime = now;
            }

            const {
                centerX = Dimensions.get('window').width / 2,
                centerY = Dimensions.get('window').height / 2,
                baseRadius = 100,
                radiusMultiplier = 1.5,
                speed = 5.0,
                pattern = PATTERNS.RANDOM,
                waveAmplitude = 50,
                waveFrequency = 2,
                randomness = 0.3,
                spiralExpansion = 0.05
            } = params;

            // Store center position in animation state
            animationStateRef.current.centerX = centerX;
            animationStateRef.current.centerY = centerY;

            // Get delta time for animation
            const deltaTime = (now - lastUpdateTimeRef.current) / 1000; // in seconds
            lastUpdateTimeRef.current = now;

            // Simplified speed calculation
            const effectiveSpeed = speed * 3;

            // Update animation angle
            animationStateRef.current.angle += effectiveSpeed * deltaTime;

            // Simplified radius calculation - fewer conditionals
            const audioFactor = (0.2 + cachedNormalizedAudio * 0.8) * radiusMultiplier * 
                               (cachedNormalizedAudio >= 0.9 ? 2 : 1);
            const maxRadiusPercent = 0.2 + (cachedNormalizedAudio * 0.8);
            const baseR = baseRadius * audioFactor;
            const maxRadius = baseRadius * maxRadiusPercent;

            // Initialize radius if needed
            if (!animationStateRef.current.radius) {
                animationStateRef.current.radius = baseR * 0.3;
            }

            // Helper functions for pattern handlers
            const updateRadius = (newRadius) => {
                animationStateRef.current.radius = newRadius;
            };

            const updateAngle = (angleOffset) => {
                animationStateRef.current.angle += angleOffset;
            };

            // Create common parameters for pattern functions
            const patternParams = {
                centerX,
                centerY,
                angle: animationStateRef.current.angle,
                baseR,
                maxRadius,
                maxRadiusPercent,
                waveFrequency,
                waveAmplitude,
                audioFactor,
                normalizedAudioLevel: cachedNormalizedAudio,
                randomness,
                spiralExpansion,
                deltaTime,
                currentRadius: animationStateRef.current.radius,
                updateRadius,
                updateAngle
            };

            // Get pattern function and calculate position
            const patternFunction = animationPatterns[pattern] || animationPatterns[PATTERNS.RANDOM];
            let position = patternFunction(patternParams);

            // Apply edge point influence only if necessary
            if (edgePointsRef.current.length > 0 && cachedNormalizedAudio > 0.7) {
                position = applyEdgePointInfluence(
                    position,
                    edgePointsRef.current,
                    animationStateRef.current.angle,
                    cachedNormalizedAudio
                );
            }

            // Update the touch position ref
            touchPositionRef.current.set(position.x, position.y);
        }
    };
};


// Normalize audio level to 0-1 scale based on min-max range
export const normalizeAudioLevel = (audioLevel) => {
    return Math.max(0, Math.min(1, (audioLevel - 0.7) / 0.45));
}

// Apply edge point influence based on angle
export const applyEdgePointInfluence = (position, edgePoints, angle, normalizedAudioLevel) => {
    if (edgePoints.length === 0 || normalizedAudioLevel <= 0.7) {
        return position;
    }

    // Find the closest edge point based on current angle
    const sectorSize = Math.PI * 2 / edgePoints.length;
    const sectorIndex = Math.floor((angle % (Math.PI * 2)) / sectorSize);
    const edgePoint = edgePoints[sectorIndex % edgePoints.length];

    if (!edgePoint) {
        return position;
    }

    // Apply influence from the edge point - stronger at high audio levels
    const influenceFactor = Math.max(0, (normalizedAudioLevel - 0.7) * 2) * 0.3;
    position.x += (edgePoint.x - position.x) * influenceFactor;
    position.y += (edgePoint.y - position.y) * influenceFactor;

    return position;
}

// Get window dimensions
export const getWindowDimensions = () => {
    return {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    };
}

// Generate colors based on audio level and time
export const generateColors = (normalizedAudioLevel, time) => {
    // Generate primary color that changes with audio level
    // Higher audio = more vibrant colors
    const hue1 = (time * 0.05) % 1.0;
    const saturation1 = 0.5 + normalizedAudioLevel * 0.5;
    const lightness1 = 0.3 + normalizedAudioLevel * 0.4;

    // Generate complementary color for secondary
    const hue2 = (hue1 + 0.5) % 1.0;
    const saturation2 = 0.7 + normalizedAudioLevel * 0.3;
    const lightness2 = 0.2 + normalizedAudioLevel * 0.2;

    // Convert HSL to RGB for primary color
    const primaryColor = hslToRgb(hue1, saturation1, lightness1);

    // Convert HSL to RGB for secondary color
    const secondaryColor = hslToRgb(hue2, saturation2, lightness2);

    // Calculate color mix based on audio level
    // Higher audio = more dynamic mixing
    const colorMix = 0.3 + normalizedAudioLevel * 0.7;

    return {
        primaryColor,
        secondaryColor,
        colorMix
    };
}
// Convert HSL color values to RGB
// h, s, l values in range 0-1
export const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r, g, b };
}
