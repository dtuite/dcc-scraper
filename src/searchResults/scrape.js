const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');

const url = (startIndex) => {
  return `http://www.dublincity.ie/swiftlg/apas/run/wphappsearchres.displayResultsURL?ResultID=5335334&StartIndex=${startIndex}&SortOrder=APNID:DESC&DispResultsAs=WPHAPPSEARCHRES&BackURL=%3Ca%20href=wphappcriteria.display?paSearchKey=4583607%3ESearch%20Criteria%3C/a%3E`;
};

const scrapeResultsFromPage = (html) => {
  const $ = cheerio.load(html);

  const rows = $('div#bodyContent table tr').map((i, tr) => {
    // The href this finds is absolutely bonkers. It has actual HTML in it. All we really
    // need is the first parameter called 'theApnID'. This is the application ID. The show
    // page of any application can be reached by appending this application ID onto the
    // URL of the show page like this: 
    // http://www.dublincity.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=5725/04
    const applicationIdHref = $($('td a', tr)[0]).prop('href');
    const applicationIdMatch = applicationIdHref && applicationIdHref
      .match(/theApnID=([\w\d//]+)/);
    const applicationId = applicationIdMatch && applicationIdMatch[1];
    const description = _.trim($($('td', tr)[1]).text());
    const location = _.trim($($('td', tr)[2]).text());
    return {
      applicationIdHref,
      applicationId,
      description,
      location,
    };
  }).get();

  return _.drop(rows);
};

module.exports.scrapeMultiplePages = async (pagesToScrape = 2, resultsPerPage = 10) => {
  // TODO: I'm scraping all the pages in parallel here. Not very friendly to the server.
  const results = await Promise.all(_.times(pagesToScrape, async (i) => {
    const uri = url((i * resultsPerPage) + 1);
    const html = await rp(uri);
    const pageResults = scrapeResultsFromPage(html);
    return pageResults;
  }));

  return _.flattenDeep(results);
};
