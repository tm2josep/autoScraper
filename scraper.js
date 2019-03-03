const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
let outputStream;
let recordCount = 0;
fs.readFile('./scraper-config.json', function (err, data) {
    if (err) {
        throw err;
    }

    let config = JSON.parse(data);
    synchronousScrape(config);
});

function synchronousScrape(config) {
    for (let groupName in config.groups) {
        beginScraper(config.groups[groupName], groupName, config.baseUrl);
    }
}


async function beginScraper(config, groupName, baseUrl) {
    fs.writeFileSync(config.outputFile, '');
    outputStream = fs.createWriteStream(config.outputFile);

    let { scrape } = config;
    for (let field in scrape) {
        outputStream.write(scrape[field].name + ',');
    }

    outputStream.write('\n');

    config.urls.forEach((pageUrl) =>
        rp(baseUrl + pageUrl)
            .then(html => {
                let content = $(config.selector, html);
                for (let i = 0; i < content.length; i++) {
                    let record = {};

                    for (let field in scrape) {
                        
                        let fieldConfig = scrape[field];
                        record[field] = $(content[i]).find(fieldConfig.selector);

                        if (scrape[field].hasOwnProperty('options')) {
                            if (scrape[field].options.hasOwnProperty('attribute')) {
                                record[field] = record[field][0].attribs[scrape[field].options.attribute];
                            }

                            if (scrape[field].options.hasOwnProperty('prependBaseUrl') && scrape[field].options.prependBaseUrl) {
                                record[field] = baseUrl + record[field];
                            }

                            if (scrape[field].options.hasOwnProperty('excludeSiblings') && scrape[field].options.excludeSiblings) {
                                record[field] = record[field].clone().children().remove().end().text().trim();
                            }
                        } else {
                            record[field] = "\"" + record[field].text().trim() + "\"";
                        }
                    }
                    
                    console.log(++recordCount);

                    for (let field in record) {
                        outputStream.write(record[field] + ',');
                    }

                    outputStream.write('\n');
                }
            })
    )
}