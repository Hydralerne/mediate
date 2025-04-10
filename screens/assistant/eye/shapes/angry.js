export default function standard(width, height) {
    const scale = Math.min(width, height) / 100; // Scale factor based on SVG viewBox

    // Original path data, scaled to fit the target width and height
    const pathData = `
          M ${17.2 * scale + width / 2}, ${-13.2 * scale + height / 2}
          C ${23.9 * scale + width / 2}, ${-10.5 * scale + height / 2}, 
            ${32.1 * scale + width / 2}, ${-5.2 * scale + height / 2}, 
            ${31.6 * scale + width / 2}, ${-0.5 * scale + height / 2}
          C ${31.2 * scale + width / 2}, ${4.3 * scale + height / 2}, 
            ${22 * scale + width / 2}, ${8.6 * scale + height / 2}, 
            ${15.3 * scale + width / 2}, ${11.6 * scale + height / 2}
          C ${8.6 * scale + width / 2}, ${14.5 * scale + height / 2}, 
            ${4.3 * scale + width / 2}, ${16.1 * scale + height / 2}, 
            ${-2.2 * scale + width / 2}, ${18.3 * scale + height / 2}
          C ${-8.7 * scale + width / 2}, ${20.5 * scale + height / 2}, 
            ${-17.4 * scale + width / 2}, ${23.3 * scale + height / 2}, 
            ${-24.3 * scale + width / 2}, ${20.3 * scale + height / 2}
          C ${-31.3 * scale + width / 2}, ${17.4 * scale + height / 2}, 
            ${-36.6 * scale + width / 2}, ${8.7 * scale + height / 2}, 
            ${-36.9 * scale + width / 2}, ${-0.4 * scale + height / 2}
          C ${-37.3 * scale + width / 2}, ${-9.4 * scale + height / 2}, 
            ${-32.7 * scale + width / 2}, ${-18.8 * scale + height / 2}, 
            ${-25.7 * scale + width / 2}, ${-21.5 * scale + height / 2}
          C ${-18.8 * scale + width / 2}, ${-24.3 * scale + height / 2}, 
            ${-9.4 * scale + width / 2}, ${-20.3 * scale + height / 2}, 
            ${-2.1 * scale + width / 2}, ${-18.3 * scale + height / 2}
          C ${5.2 * scale + width / 2}, ${-16.2 * scale + height / 2}, 
            ${10.5 * scale + width / 2}, ${-15.9 * scale + height / 2}, 
            ${17.2 * scale + width / 2}, ${-13.2 * scale + height / 2}
          Z
        `;

    // Remove extra whitespace and newlines for a cleaner string
    return pathData.replace(/\s+/g, ' ').trim();

}