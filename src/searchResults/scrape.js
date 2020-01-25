const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');

const sleep = require('../sleep');

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

module.exports.scrapeMultiplePages = async (createSearchUrl, opts = {}) => {
  const settings = {
    pagesToScrape: 2,
    resultsPerPage: 10,
    sleepBetweenRequests: 200,
    ...opts,
  };

  console.log('pagesToScrape', settings.pagesToScrape);

  let results = [];
  for (const pageIndex of _.times(settings.pagesToScrape)) {
    const uri = createSearchUrl((pageIndex * settings.resultsPerPage) + 1);
    const html = await rp(uri);
    const pageResults = scrapeResultsFromPage(html);
    results = [...results, ...pageResults];
    await sleep(settings.sleepBetweenRequests);
  }

  return _.flattenDeep(results);
};
