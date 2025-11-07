export default function happy(width, height) {
    const scale = Math.min(width, height) / 100;

    const pathData = `
    M ${28.35 * scale + width / 2}, ${-23.3 * scale + height / 2}
      C ${33.15 * scale + width / 2}, ${-17 * scale + height / 2}, ${32.95 * scale + width / 2}, ${-7.200000000000001 * scale + height / 2}, ${32.05 * scale + width / 2}, ${1.7999999999999994 * scale + height / 2}
      C ${31.15 * scale + width / 2}, ${10.7 * scale + height / 2}, ${29.55 * scale + width / 2}, ${18.8 * scale + height / 2}, ${24.65 * scale + width / 2}, ${23.3 * scale + height / 2}
      C ${19.85 * scale + width / 2}, ${27.7 * scale + height / 2}, ${11.75 * scale + width / 2}, ${28.599999999999998 * scale + height / 2}, ${2.65 * scale + width / 2}, ${29.8 * scale + height / 2}
      C ${-6.550000000000001 * scale + width / 2}, ${30.9 * scale + height / 2}, ${-16.85 * scale + width / 2}, ${32.3 * scale + height / 2}, ${-23.55 * scale + width / 2}, ${27.8 * scale + height / 2}
      C ${-30.15 * scale + width / 2}, ${23.3 * scale + height / 2}, ${-33.15 * scale + width / 2}, ${13 * scale + height / 2}, ${-31.75 * scale + width / 2}, ${3.999999999999999 * scale + height / 2}
      C ${-30.450000000000003 * scale + width / 2}, ${-5.000000000000001 * scale + height / 2}, ${-24.85 * scale + width / 2}, ${-12.700000000000001 * scale + height / 2}, ${-18.25 * scale + width / 2}, ${-18.900000000000002 * scale + height / 2}
      C ${-11.65 * scale + width / 2}, ${-25.2 * scale + height / 2}, ${-3.95 * scale + width / 2}, ${-30.099999999999998 * scale + height / 2}, ${4.85 * scale + width / 2}, ${-31.2 * scale + height / 2}
      C ${13.65 * scale + width / 2}, ${-32.3 * scale + height / 2}, ${23.45 * scale + width / 2}, ${-29.599999999999998 * scale + height / 2}, ${28.35 * scale + width / 2}, ${-23.3 * scale + height / 2}
      Z
  `;
  return pathData.replace(/\s+/g, ' ').trim();
}
