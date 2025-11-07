import fragmentShader from './shaders/fragmentShader.js';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export const createRenderer = (gl, touchPositionRef, colorRefs) => {
        // Setup scene
        const scene = new THREE.Scene();
        const vMouseDamp = new THREE.Vector2();
        const vResolution = new THREE.Vector2();
        const vPrimaryColor = new THREE.Vector3(1.0, 1.0, 1.0); // Default to white
        const vSecondaryColor = new THREE.Vector3(0.0, 0.5, 1.0); // Default to blue

        // Start with variation 3 (triangle shape)
        let variation = 2

        // Get dimensions
        const w = gl.drawingBufferWidth;
        const h = gl.drawingBufferHeight;

        vResolution.set(w, h);

        const aspect = w / h;
        const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);

        const renderer = new Renderer({ gl });
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);

        // Create geometry and material
        const geo = new THREE.PlaneGeometry(3, 3);  // Scaled to cover full viewport
        const mat = new THREE.ShaderMaterial({
            vertexShader: /* glsl */`
                varying vec2 v_texcoord;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    v_texcoord = uv;
                }`,
            fragmentShader, // most of the action happening in the fragment
            uniforms: {
                u_mouse: { value: vMouseDamp },
                u_resolution: { value: vResolution },
                u_pixelRatio: { value: 2 },
                u_primaryColor: { value: vPrimaryColor },
                u_secondaryColor: { value: vSecondaryColor },
                u_colorMix: { value: 0.5 },
                u_time: { value: 0.0 },
                u_blurIntensity: { value: 0.5 },
                u_effectIntensity: { value: 1.0 }
            },
            defines: {
                VAR: variation
            }
        });

        // Mesh creation
        const quad = new THREE.Mesh(geo, mat);
        scene.add(quad);

        // Camera position and orientation
        camera.position.z = 1;

        // Animation loop for rendering
        let time = 0, lastTime = 0;
        let lastVariationChange = 0;
        let currentVariation = variation;

        const update = () => {
            // calculate delta time
            time = performance.now() * 0.001;
            const dt = time - lastTime;
            lastTime = time;

            // Update time uniform
            mat.uniforms.u_time.value = time;

            // Update color uniforms if refs are provided
            if (colorRefs && colorRefs.primaryColorRef && colorRefs.primaryColorRef.current) {
                const primaryColor = colorRefs.primaryColorRef.current;
                vPrimaryColor.set(primaryColor.r, primaryColor.g, primaryColor.b);
            }

            if (colorRefs && colorRefs.secondaryColorRef && colorRefs.secondaryColorRef.current) {
                const secondaryColor = colorRefs.secondaryColorRef.current;
                vSecondaryColor.set(secondaryColor.r, secondaryColor.g, secondaryColor.b);
            }

            if (colorRefs && colorRefs.colorMixRef) {
                mat.uniforms.u_colorMix.value = colorRefs.colorMixRef.current || 0.5;
            }

            // Update blur and effect intensity if provided
            if (colorRefs && colorRefs.blurIntensityRef) {
                mat.uniforms.u_blurIntensity.value = colorRefs.blurIntensityRef.current || 0.5;
            }

            if (colorRefs && colorRefs.effectIntensityRef) {
                mat.uniforms.u_effectIntensity.value = colorRefs.effectIntensityRef.current || 1.0;
            }

            // Update shader variation based on variation ref instead of audio level
            if (colorRefs && colorRefs.variationRef && colorRefs.variationRef.current !== currentVariation) {
                currentVariation = colorRefs.variationRef.current;
                mat.defines.VAR = currentVariation;
                mat.needsUpdate = true;
                lastVariationChange = time;
            }

            // Get current touch position from the ref
            const currentTouch = touchPositionRef.current;

            // ease touch motion with damping
            for (const k in currentTouch) {
                if (k == 'x' || k == 'y') {
                    vMouseDamp[k] = THREE.MathUtils.damp(vMouseDamp[k], currentTouch[k], 8, dt);
                }
            }

            // Update resolution if needed
            if (w !== gl.drawingBufferWidth || h !== gl.drawingBufferHeight) {
                const newW = gl.drawingBufferWidth;
                const newH = gl.drawingBufferHeight;
                vResolution.set(newW, newH);
                renderer.setSize(newW, newH);
            }

            // render scene
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            renderer.render(scene, camera);
            gl.flush();
            gl.endFrameEXP();
        };

        return { update };
    };
