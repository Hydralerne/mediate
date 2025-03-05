
export function generatePostShare(url, ftxt, stxt) {
    const arabic = /[\u0600-\u06FF]/;
    const symb = arabic?.test(ftxt?.split(' ')[0]) ? '←' : '→';
    const cof = ftxt?.split('')?.length;
    const cos = stxt?.split('')?.length;
    const maxnum = 280 - url?.split('').length - 4;
    const hfnum = maxnum / 2;
    let text = ''

    if ((cof + cos) > maxnum) {
        if (cof > hfnum && cos > hfnum) {
            text = ftxt?.substr(0, hfnum - 3) + '... ' + symb + ' ' + stxt?.substr(0, hfnum - 3) + '...';
        } else if (cof > hfnum && cos < hfnum) {
            const bl = cof > (maxnum - cos) ? '...' : '';
            text = ftxt?.substr(0, ((2 * hfnum) - cos - bl.length)) + bl + ' ' + symb + ' ' + stxt;
        } else if (cof < hfnum && cos > hfnum) {
            const bl = cos > (maxnum - cof) ? '...' : '';
            text = ftxt + ' ' + symb + ' ' + stxt?.substr(0, ((2 * hfnum) - cof - bl.length)) + bl;
        }
    } else {
        text = ftxt + ' ' + symb + ' ' + stxt;
    }

    if (!ftxt) {
        text = text?.replace(symb, '');
    }

    return { text, url }
}

