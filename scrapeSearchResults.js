const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');

const url = (startIndex) => {
  return `http://www.dublincity.ie/swiftlg/apas/run/wphappsearchres.displayResultsURL?ResultID=5335334&StartIndex=${startIndex}&SortOrder=APNID:DESC&DispResultsAs=WPHAPPSEARCHRES&BackURL=%3Ca%20href=wphappcriteria.display?paSearchKey=4583607%3ESearch%20Criteria%3C/a%3E`;
};

const scrapeResults = (html) => {
  const $ = cheerio.load(html);

  const rows = $('div#bodyContent table tr').map((i, tr) => {
    return [
      $($('td a', tr)[0]).prop('href'),
      $($('td', tr)[1]).text(),
      $($('td', tr)[2]).text(),
    ];
  }).get();

  return _.drop(_.chunk(rows, 3)).map((row) => {
    return {
      path: row[0],
      description: _.trim(row[1]),
      location: _.trim(row[2]),
    };
  });
};

const results = [];

const main = async () => {
  const html = await rp(url(1));
  const pageResults = scrapeResults(html);
  results.push(pageResults);

  const nextResults = await Promise.all(_.times(20, async (i) => {
    const html = await rp(url((i * 10) + 1));
    const pageResults = scrapeResults(html);
    return pageResults;
  }));

  results.push(nextResults);
  const flatResults = _.flattenDeep(results);
  fs.writeFileSync('searchResults.json', JSON.stringify(flatResults, null, 2));

  // console.log(JSON.stringify(results, null, 2));
};

main();
