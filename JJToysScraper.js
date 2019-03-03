const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
let outputFile = require('os').homedir() + '/Desktop/scrapeResults.csv';
fs.writeFileSync(outputFile, '');
const outputStream = fs.createWriteStream(outputFile);
const baseUrl = 'http://shop.jjcards.com/';
const pageUrls = [
    'http://shop.jjcards.com/A_c_145-1-3.html',
    'http://shop.jjcards.com/A_c_145-2-3.html',
    'http://shop.jjcards.com/A_c_145-3-3.html',
    'http://shop.jjcards.com/B_c_146-1-3.html',
    'http://shop.jjcards.com/B_c_146-2-3.html',
    'http://shop.jjcards.com/C_c_147.html',
    'http://shop.jjcards.com/D_c_148.html',
    'http://shop.jjcards.com/E_c_149.html',
    'http://shop.jjcards.com/F_c_150.html',
    'http://shop.jjcards.com/G_c_151.html',
    'http://shop.jjcards.com/H_c_152.html',
    'http://shop.jjcards.com/I_c_153.html',
    'http://shop.jjcards.com/J_c_154.html',
    'http://shop.jjcards.com/K_c_155.html',
    'http://shop.jjcards.com/L_c_156.html',
    'http://shop.jjcards.com/M_c_157.html',
    'http://shop.jjcards.com/N_c_158.html',
    'http://shop.jjcards.com/O_c_159.html',
    'http://shop.jjcards.com/P_c_160.html',
    'http://shop.jjcards.com/Q_c_161.html',
    'http://shop.jjcards.com/R_c_162.html',
    'http://shop.jjcards.com/S_c_163.html',
    'http://shop.jjcards.com/T_c_164.html',
    'http://shop.jjcards.com/U_c_165.html',
    'http://shop.jjcards.com/V_c_166.html',
    'http://shop.jjcards.com/W_c_167.html',
    'http://shop.jjcards.com/X_c_168.html',
    'http://shop.jjcards.com/Z_c_169.html',
    'http://shop.jjcards.com/New-Releases_c_249.html'
];
let products = [];

const scrapeIntoProducts = (pageUrl) => {
    console.log(pageUrl);
    rp(pageUrl)
        .then(html => {
            let pageProducts = $('div.product-item', html);
            for (let i = 0; i < pageProducts.length; i++) {
                let prod = {};
                prod['img'] = baseUrl + $(pageProducts[i]).find('div.img > a')[0].attribs.href;
                prod['name'] = $(pageProducts[i]).find('div.name > a').text();
                prod['priceIfNotOnSale'] = $(pageProducts[i]).find('div.price > del.price2').text().trim();
                prod['currentPrice'] = $(pageProducts[i]).find('div.price').clone().children().remove().end().text().trim();
                prod['status'] = $(pageProducts[i]).find('div.status').text().trim();
                outputStream.write(prod.img + ',' + prod.name + ',' + prod.priceIfNotOnSale + ',' + prod.currentPrice + ',' + prod.status + '\n');
                console.log(prod['name']);

            }

        })
        .catch(err => {
            console.log(err);
        });
}
outputStream.write('"Image","Name","Original Price (If On Sale)","Current Price","Status"\n');

pageUrls.forEach(scrapeIntoProducts);