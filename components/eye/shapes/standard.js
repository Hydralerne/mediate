export default function standard(width, height) {
    const scale = Math.min(width, height) / 100;
    const pathData = `
    M ${24.8 * scale + width / 2}, ${-26.1 * scale + height / 2}
      C ${30.4 * scale + width / 2}, ${-19.1 * scale + height / 2}, ${32.2 * scale + width / 2}, ${-9.6 * scale + height / 2}, ${33.3 * scale + width / 2}, ${1.1 * scale + height / 2}
      C ${34.3 * scale + width / 2}, ${11.7 * scale + height / 2}, ${34.8 * scale + width / 2}, ${23.4 * scale + height / 2}, ${29.1 * scale + width / 2}, ${31.3 * scale + height / 2}
      C ${23.4 * scale + width / 2}, ${39.1 * scale + height / 2}, ${11.7 * scale + width / 2}, ${43.1 * scale + height / 2}, ${0.1 * scale + width / 2}, ${43.1 * scale + height / 2}
      C ${-11.6 * scale + width / 2}, ${43 * scale + height / 2}, ${-23.2 * scale + width / 2}, ${38.9 * scale + height / 2}, ${-29.7 * scale + width / 2}, ${31 * scale + height / 2}
      C ${-36.2 * scale + width / 2}, ${23.2 * scale + height / 2}, ${-37.7 * scale + width / 2}, ${11.6 * scale + height / 2}, ${-36.6 * scale + width / 2}, ${1.1 * scale + height / 2}
      C ${-35.4 * scale + width / 2}, ${-9.3 * scale + height / 2}, ${-31.7 * scale + width / 2}, ${-18.6 * scale + height / 2}, ${-25.2 * scale + width / 2}, ${-25.6 * scale + height / 2}
      C ${-18.6 * scale + width / 2}, ${-32.7 * scale + height / 2}, ${-9.3 * scale + width / 2}, ${-37.4 * scale + height / 2}, ${0.1 * scale + width / 2}, ${-37.5 * scale + height / 2}
      C ${9.6 * scale + width / 2}, ${-37.6 * scale + height / 2}, ${19.1 * scale + width / 2}, ${-33.2 * scale + height / 2}, ${24.8 * scale + width / 2}, ${-26.1 * scale + height / 2}
      Z
  `;

    return pathData.replace(/\s+/g, ' ').trim();
}

