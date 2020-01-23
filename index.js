const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const url = 'http://www.dublincity.ie/swiftlg/apas/run/wphappsearchres.displayResultsURL?ResultID=5335334&StartIndex=1&SortOrder=APNID:DESC&DispResultsAs=WPHAPPSEARCHRES&BackURL=%3Ca%20href=wphappcriteria.display?paSearchKey=4583607%3ESearch%20Criteria%3C/a%3E';

const results = [];

const main = async () => {
  const html = await rp(url);
  const $ = cheerio.load(html);
  // console.log(html);

  const rows = $('div#bodyContent table tr').map((i, tr) => {
    return [
      $($('td a', tr)[0]).prop('href'),
      $($('td', tr)[1]).text(),
      $($('td', tr)[2]).text(),
    ];
  }).get();
  // console.log('rows', rows);

  _.drop(_.chunk(rows, 3)).forEach((row) => {
    results.push({
      path: row[0],
      description: _.trim(row[1]),
      location: _.trim(row[2]),
    });
  });

  console.log(JSON.stringify(results, null, 2));
};

main();
