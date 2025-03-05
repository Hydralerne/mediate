import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import ProfileController from '../../hooks/ProfileColorControler'
import createStyles from '../../utils/globalStyle';
import colors from '../../utils/colors';

const HeaderBack = ({ url, style }) => {
    const [render, setRender] = useState(false)
    useEffect(() => {
        if (!render) {
            setTimeout(() => {
                setRender(true)
            }, 200)
        }
    }, [])
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
      * {
      margin: 0
      }
      .header-back:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    z-index: 9;
}
    .header-back img {
    width: 100px;
    height: 100px;
    position: absolute;
    background-size: cover;
    background-position: center;
    filter: grayscale(0.15) saturate(0.85) brightness(1) contrast(0.9);
}
        .header-back {
    position: absolute;
    height: 100%;
    width: 100%;
}
      </style>
    </head>
    <body style="background-color: ${colors.profileHaderOverlay};">
      <div class="header-back" style="background-color: ${colors.profileHaderOverlay};">
        <img onload="fireSwice()" src="${url}" />
        <img src="${url}" style="right: 0px; bottom: 0px;"/>
      </div>
      <script>
      
      async function fireSwice(){
          const url = '${url?.replace('/profile_large/', '/profile/')}';
          const colors = await getColors(url,5)
      }
      function generateShades(hex, numberOfShades = 10) {
        const hsl = hexToHSL(hex);
        const shades = [];
        for (let i = -Math.floor(numberOfShades / 2); i <= Math.floor(numberOfShades / 2); i++) {
            let newLightness = Math.min(Math.max(hsl[2] + i * 10, 0), 100);
            shades.push(hslToHex(hsl[0], hsl[1], newLightness));
        }
    
        return shades;
    }
    
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return \`#\${f(0)}\${f(8)}\${f(4)}\`;
    }
    
    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
    
        r /= 255;
        g /= 255;
        b /= 255;
    
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
    
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
    
        return [h * 360, s * 100, l * 100];
    }
    
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
    
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    }
    
async function getColors(imageURL, shco) {
    try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/node-vibrant/dist/vibrant.min.js';
        
        script.onload = async () => {
            try {
                // Ensure the script is loaded before proceeding
                const img = await loadImage(imageURL);
                const vibrant = new Vibrant(img);
                const palette = await vibrant.getPalette();
                const muted = palette.Muted.getHex();
                const shades = generateShades(muted, shco);
                window.ReactNativeWebView.postMessage(JSON.stringify({muted,shades}));
            } catch (innerErr) {
                console.error('Error while extracting colors:', innerErr);
            }
        };
        
        script.onerror = () => {
            console.error('Failed to load Vibrant library script.');
        };

        document.head.appendChild(script);

    } catch (err) {
        console.error('Failed to load image or extract colors:', err);
    }
}

      </script>
    </body>
    </html>
  `;



    const handleWebViewMessage = (event) => {
        const data = event.nativeEvent.data;
        const color = JSON.parse(data).shades[3]
        ProfileController.setColor(color)
        ProfileController.setBottom(color)
        ProfileController.setImage(color)
    };

    return (
        <Animated.View style={[styles.container, style]}>
            <View style={styles.Disabler}></View>
            {render &&
                <WebView
                    source={{ html: htmlContent }}
                    style={styles.webview}
                    originWhitelist={['*']}
                    onMessage={handleWebViewMessage}

                />}
        </Animated.View>
    );
};

const styles = createStyles({
    Disabler: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 99
    },
    container: {
        height: 140,
        overflow: 'hidden',
        position: 'absolute',
        width: '100%',
        top: 0,
        zIndex: 9,
        backgroundColor: colors.border
    },
    webview: {
        flex: 1,
        backgroundColor: colors.background
    },
});

export default memo(HeaderBack);
