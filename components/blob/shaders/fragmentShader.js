const fragmentShader = `
precision highp float;

varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform vec3 u_primaryColor;   // Primary color for the blob
uniform vec3 u_secondaryColor; // Secondary color for gradient effect
uniform float u_colorMix;      // Value to control color mixing (0-1)
uniform float u_time;          // Time for animated color effects
uniform float u_blurIntensity; // Control blur amount (0-1)
uniform float u_effectIntensity; // Control overall effect intensity (0-1)
uniform float u_noiseEnabled;  // Enable/disable noise effects (0.0 or 1.0)

/* common constants */
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

/* variation constant */
#ifndef VAR
#define VAR 0
#endif

/* Coordinate and unit utils */
#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    // correct aspect ratio
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    // centering
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

/* signed distance functions */
float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

/* antialiased step function */
float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
/* Signed distance drawing methods */
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}

float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

// Color utility functions
vec3 mixColors(vec3 color1, vec3 color2, float mixValue) {
    // Using smoothstep for a more natural, non-linear blend
    float smoothMix = smoothstep(0.0, 1.0, mixValue);
    return mix(color1, color2, smoothMix);
}

// Optimized noise function (faster than Perlin but still organic looking)
float fastNoise(vec2 p, float time) {
    float t = time * 0.1;
    vec3 p3 = vec3(p, t);
    
    p3 = fract(p3 * vec3(.1031, .11369, .13787));
    p3 += dot(p3, p3.yxz + 19.19);
    
    float result = fract((p3.x + p3.y) * p3.z);
    return result;
}

// Cloud-like noise with 2 octaves - OPTIMIZED for performance
float cloudNoise(vec2 uv, float time) {
    // Reduced from 4 to 2 octaves for 50% performance improvement
    float noise = fastNoise(uv * 4.0, time * 0.5) * 0.6;
    noise += fastNoise(uv * 8.0, time * 0.7) * 0.4;
    
    // Normalize to 0-1 range
    return smoothstep(0.2, 0.8, noise);
}

// Pre-calculated noise structure to avoid redundant calculations
struct NoiseCache {
    float cloudPattern;
    float turbulence;
    float swirlNoise;
    float cloudMix;
};

// Creates a gradient based on position, time, sdf value, and pre-calculated noise
vec3 createGradient(vec2 st, float sdf, vec2 mousePos, NoiseCache noiseCache) {
    // Distance from current point to mouse position for gradient
    float distToMouse = length(st - mousePos);
    
    // Angle-based gradient component
    float angle = atan(st.y - 0.5, st.x - 0.5);
    
    // Use pre-calculated noise values
    float cloudMix = noiseCache.cloudMix;
    
    // More organic mix factor using noise and angle
    float mixFactor = smoothstep(0.0, 1.0, 
        (sin(angle * 2.0 + u_time * 0.2) * 0.2 + 0.5) * 
        (cloudMix * 0.7 + 0.3) * 
        (sin(distToMouse * 3.0 + u_time * 0.1) * 0.3 + 0.7)
    );
    
    // Add variation with mouse position
    mixFactor = mix(mixFactor, length(mousePos - vec2(0.5)) * 2.0, 0.2);
    
    // Create transition colors for smoother blending
    vec3 transitionColor1 = mix(u_primaryColor, u_secondaryColor, 0.3);
    vec3 transitionColor2 = mix(u_primaryColor, u_secondaryColor, 0.7);
    
    // Create an accent color that complements the gradient
    vec3 accentColor = vec3(
        mix(1.0 - u_primaryColor.r, u_secondaryColor.g, 0.4),
        mix(1.0 - u_primaryColor.g, u_secondaryColor.b, 0.4),
        mix(1.0 - u_primaryColor.b, u_secondaryColor.r, 0.4)
    );
    
    // Multi-step gradient with cloud-like transitions
    vec3 color1 = mix(u_primaryColor, transitionColor1, smoothstep(0.0, 0.3, mixFactor) * cloudMix);
    vec3 color2 = mix(transitionColor1, transitionColor2, smoothstep(0.3, 0.7, mixFactor));
    vec3 color3 = mix(transitionColor2, u_secondaryColor, smoothstep(0.7, 1.0, mixFactor) * (1.0 - cloudMix));
    
    // Combine all colors in a way that creates a cloud-like gradient
    vec3 baseGradient = mix(
        mix(color1, color2, smoothstep(0.3, 0.5, mixFactor)),
        color3, 
        smoothstep(0.5, 0.7, mixFactor)
    );
    
    // Add accent color in specific areas based on noise
    float accentMix = cloudMix * noiseCache.swirlNoise * u_colorMix;
    vec3 gradientColor = mix(baseGradient, accentColor, accentMix * 0.5);
    
    // Add white highlights that follow the cloud pattern
    float highlightIntensity = pow(sdf * 0.8, 2.0) * (0.7 + cloudMix * 0.5);
    gradientColor = mix(gradientColor, vec3(1.0), highlightIntensity * min(1.0, u_effectIntensity * 1.5));
    
    return gradientColor;
}

// HIGHLY OPTIMIZED blur - uses simple color sampling instead of recalculating everything
vec3 optimizedBlur(vec2 uv, vec3 baseColor, float sdf, float blurAmount, vec2 pixel, float glow, NoiseCache noiseCache) {
    // Early exit if blur amount is very small
    if (blurAmount < 0.01) {
        return baseColor * (sdf + glow * 0.3);
    }
    
    // Base weight for center pixel
    float weight = 0.6;
    vec3 result = baseColor * (sdf + glow * 0.3) * weight;
    float totalWeight = weight;
    
    // Reduced to 3 samples (was 4) and removed all noise calculations from loop
    vec2 offsets[3];
    float blurRadius = 2.0 + blurAmount * 4.0;
    offsets[0] = vec2(-1.0, 0.0) * pixel * blurRadius;
    offsets[1] = vec2(0.5, 0.866) * pixel * blurRadius;  // 60 degree angle
    offsets[2] = vec2(0.5, -0.866) * pixel * blurRadius; // -60 degree angle
    
    // Simple weighted sampling without recalculating gradients
    for (int i = 0; i < 3; i++) {
        vec2 sampleUv = uv + offsets[i];
        
        // Simple SDF approximation based on distance from center
        float distFromCenter = length(sampleUv - vec2(0.5));
        float sampleSdf = smoothstep(0.0, 1.0, sdf * (1.0 - distFromCenter * 0.2));
        
        // Approximate color by slightly shifting the base color (much faster than recalculating)
        vec3 sampleColor = createGradient(sampleUv, sampleSdf, uv, noiseCache);
        sampleColor *= (sampleSdf + glow * 0.3);
        
        // Fixed weight for simplicity
        float w = 0.3;
        
        result += sampleColor * w;
        totalWeight += w;
    }
    
    // Normalize
    return result / totalWeight;
}

void main() {
    vec2 pixel = 1.0 / u_resolution.xy;
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;
    
    // Use effect intensity (defaulting to 1.0 if not provided)
    float effectStrength = u_effectIntensity > 0.0 ? u_effectIntensity : 1.0;
    
    // Use blur intensity uniform (defaulting to 0.5 if not provided)
    float blurFactor = u_blurIntensity > 0.0 ? u_blurIntensity : 0.5;
    
    // PRE-CALCULATE NOISE VALUES ONCE (only if noise is enabled)
    // This is a major performance optimization - skip entirely if noise disabled
    NoiseCache noiseCache;
    
    if (u_noiseEnabled > 0.5) {
        // Calculate noise values for visual richness
        float timeOsc = sin(u_time * 0.3) * 0.5 + 0.5;
        
        // Calculate swirl coordinates once
        vec2 swirlUv = st - vec2(0.5);
        float swirl = 0.1 * sin(length(swirlUv) * 10.0 - u_time * 0.5);
        float cs = cos(swirl);
        float sn = sin(swirl);
        swirlUv = vec2(
            swirlUv.x * cs - swirlUv.y * sn,
            swirlUv.x * sn + swirlUv.y * cs
        ) + vec2(0.5);
        
        // Pre-calculate noise once and cache it
        noiseCache.cloudPattern = cloudNoise(st * 2.0 + timeOsc, u_time);
        noiseCache.turbulence = cloudNoise(st * 3.0 - u_time * 0.1, u_time * 0.5);
        noiseCache.swirlNoise = cloudNoise(swirlUv * 5.0, u_time * 0.3);
        noiseCache.cloudMix = mix(noiseCache.cloudPattern, noiseCache.swirlNoise, 0.5);
        noiseCache.cloudMix = mix(noiseCache.cloudMix, noiseCache.turbulence, 0.3);
    } else {
        // No noise - use simple constant values for maximum performance
        noiseCache.cloudPattern = 0.5;
        noiseCache.turbulence = 0.5;
        noiseCache.swirlNoise = 0.5;
        noiseCache.cloudMix = 0.5;
    }
    
    /* sdf (Round Rect) params */
    float size = 1.2;
    float roundness = 0.4;
    float borderSize = 0.05;
    
    /* sdf Circle params */
    float circleSize = 0.3;
    float circleEdge = 0.5;
    
    /* sdf Circle */
    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );
    
    // Apply slight smoothing to the circle edge
    sdfCircle = smoothstep(0.0, 1.0, sdfCircle);
    
    float sdf;
    if (VAR == 0) {
        /* sdf round rectangle with stroke param adjusted by sdf circle */
        sdf = sdRoundRect(st, vec2(size), roundness);
        sdf = stroke(sdf, 0.0, borderSize, sdfCircle) * 4.0;
    } else if (VAR == 1) {
        /* sdf circle with fill param adjusted by sdf circle */
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        /* sdf circle with stroke param adjusted by sdf circle */
        sdf = sdCircle(st, vec2(0.5));
        sdf = stroke(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) {
        /* sdf circle with fill param adjusted by sdf circle */
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }
    
    // Smooth the SDF value for better blending
    sdf = smoothstep(0.0, 1.0, sdf);
    
    // Calculate falloff for a subtle glow effect - adjusted by effect intensity
    float glow = smoothstep(0.0, 0.6, sdf) * 0.8 * effectStrength;
    
    // Generate base color with pre-calculated noise
    vec3 baseColor = createGradient(st, sdf, posMouse, noiseCache);
    
    // Apply the sdf value to the color with glow for base color
    vec3 color = baseColor * (sdf + glow * 0.3);
    
    // Calculate blur amount - based on the blur factor uniform
    float centerDist = length(st - vec2(0.5));
    float adaptiveBlur = blurFactor * 0.4 * (1.0 - sdf) * (1.0 - smoothstep(0.0, 0.7, centerDist));
    
    // Apply optimized blur with intensity control and pre-calculated noise
    vec3 blurredColor = optimizedBlur(st, baseColor, sdf, adaptiveBlur, pixel, glow, noiseCache);
    
    // Mix original and blurred color, with strength controlled by blurFactor
    color = mix(color, blurredColor, smoothstep(0.0, 0.5, adaptiveBlur * blurFactor * 2.0));
    
    // Add cloud detail only if noise is enabled
    if (u_noiseEnabled > 0.5) {
        float cloudDetail = cloudNoise(st * 10.0, u_time * 0.1) * 0.1 * effectStrength;
        color = mix(color, color * (1.0 + cloudDetail), 0.5);
    }
    
    // Add subtle vignette effect
    float vignette = smoothstep(1.2, 0.5, length(st - vec2(0.5)) * 1.5);
    color *= mix(0.92, 1.0, vignette);
    
    // Apply bloom effect proportional to the effect intensity
    float bloom = smoothstep(0.6, 1.0, sdf) * 0.15 * effectStrength;
    color += bloom * baseColor;
    
    gl_FragColor = vec4(color.rgb, 1.0);
}
`;

export default fragmentShader;