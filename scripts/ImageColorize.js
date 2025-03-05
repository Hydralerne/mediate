

function hexToHSLA(hex, opacity = 1) {
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

    h = h * 360;
    s = s * 100;
    l = l * 100;
    return `hsl(${h.toFixed(2)}deg ${s.toFixed(2)}% ${l.toFixed(2)}% / ${opacity * 100}%)`;
}

export function hexToRGBA(hex, opacity = 1) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function darkenColor(hex, darkenAmount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, Math.round(r * (1 - darkenAmount)));
    g = Math.max(0, Math.round(g * (1 - darkenAmount)));
    b = Math.max(0, Math.round(b * (1 - darkenAmount)));
    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

export function generateShades(hex, numberOfShades = 10) {
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
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function colorEqualizer(baseHex, targetHex) {
    const baseHSL = hexToHSL(baseHex);
    const targetHSL = hexToHSL(targetHex);
    const newColor = hslToHex(targetHSL[0], baseHSL[1], baseHSL[2]);
    return newColor;
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

function fadeColor(hex, fadeAmount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.round(r + (128 - r) * fadeAmount);
    g = Math.round(g + (128 - g) * fadeAmount);
    b = Math.round(b + (128 - b) * fadeAmount);
    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

export async function getColors(imageURL, shco) {
    try {
        const palette = await ExtractColor(imageURL);
        const mutedColor = palette.Muted.getHex();
        const shades = generateShades(mutedColor, shco);
        return { shades: shades, muted: mutedColor }
    } catch (err) {
        console.error('Failed to load image or extract colors:', err);
    }
}

export async function getProfile(imageURL) {
    const colors = await ExtractColor(imageURL);
    const shade = colors.shades[4]
    const main = colorEqualizer('#fec5eb', shade)
    const helper = colorEqualizer('#9390d0', shade)
    return { main, helper }
}