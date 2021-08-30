const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DATE_COLORCODE = {
    '#ff0000': (day) => day === 0 ? 'minggu' : 'hariRaya', // merah
    '#0000ff': (day) => 'pesta', // biru
    '#000000': (day) => 'biasa', // hitam
}


const parseDay = (el, meta) => {
    const tglEl = el.getElementsByClassName('k_tgl').item(0);
    const perayaanEl = el.getElementsByClassName('k_perayaan').item(0);
    const alkitabEl = el.getElementsByClassName('k_alkitab').item(0);
    const pakaianEl = el.getElementsByClassName('k_pakaian').item(0);

    const date = new Date(
        parseInt(meta.tahun),
        MONTHS_ID.indexOf(meta.bulan), // month start from 0
        parseInt(tglEl.textContent),
    );
    const dayColor = tglEl.getAttribute('style').match(/color:(#.{6})/).pop();

    return {
        // actual date
        date: date,

        // indonesian format date
        localDate: `${tglEl.textContent} ${meta.bulan} ${meta.tahun}`,

        // url to details
        url: `${document.baseURI}${tglEl.parentElement.getAttribute('href')}`,

        // day name of the feast / memorial / ferial
        name: perayaanEl.textContent.replace('<br>', '').replace(/\s\n|\s{2,}|\n/, ' '),

        // liturgical date 
        dayColor: dayColor,
        dayType: DATE_COLORCODE[dayColor](date.getDay()),

        // color theme
        color: pakaianEl.textContent.replace('Warna Liturgi ', '').toLowerCase(),

        readings: {
            // use this to re-render on html, don't rely on parsed result
            innerHTML: alkitabEl.innerHTML,
            // (experimental) parsed result, might get not accurate
            links: parseBcAlkitab(alkitabEl), // !links
        }, // !readings
    };
}; // !parseDay


const parseBcAlkitab = (el) => {
    // accumulate parsed readings (bacaan)
    let readingList = Array.from(el.getElementsByTagName("a")).map(el => {
        return {
            'url': el.href,
            // 'text': el.textContent,
            // description of the readings
            // known desc : 'BcO', 'Sore', 'Pagi', 'MT' (Mazmur),
            //              'atau' means it belongs to previous readings
            'text': ((el) => {
                const readingText = el.textContent.replace(/\s\n|\s{2,}|\n/, ' ');
                let prevEl = el.previousSibling;
                if (prevEl == null) {
                    return el.textContent;
                }

                let prefix = null;
                if (prevEl.nodeType == Node.TEXT_NODE) {
                    prefix = prevEl.textContent.match(/[^;\n<\/br>\s+]\w+/);
                }
                return prefix === null ? readingText : prefix + " " + readingText;
            })(el),
        }
    });

    // join `atau` keywords
    for (let i = 0; i < readingList.length; ++i) {
        if (readingList[i]['text'].match(/atau/)) {
            // remove array element
            const reading = readingList.splice(i, 1)[0];

            // join to previous
            readingList[i - 1]['url'] += reading['url'].replace('https://www.imankatolik.or.id/alkitabq.php?q=', '');
            readingList[i - 1]['text'] += " " + reading['text'];

            // since current element is removed, start over from previous
            --i;
        }
    }

    return readingList;

};


const scrapeKalender = (document) => {
    // get global month and year
    const tanggalBulanStr = document.getElementsByClassName('kal_bln').item(0)
        .textContent.replace('Kalender Liturgi Bulan ', '');
    const [, bulan, tahun] = /(\w+) (\d+)/.exec(tanggalBulanStr)

    // get day elements by selecting all cell and skip empty ones
    const dayElements = Array.from(document.getElementsByClassName('k_tbl_td'))
        .filter(el => el.getElementsByTagName('table').length === 1)

    // parse each day elements
    const data = dayElements.map(el => parseDay(el, { bulan: bulan, tahun: tahun }));

    return data;

};


console.log(scrapeKalender(document));
