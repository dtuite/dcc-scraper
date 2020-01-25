const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');

const getSessionCookie = require('../getSessionCookie');

const HOSTNAME = 'http://www.dublincity.ie';
const url = (applicationId) => (
  `${HOSTNAME}/AniteIMWebSearch/ExternalEntryPoint.aspx?SEARCH_TYPE=1&DOC_CLASS_CODE=PL&folder1_ref=${applicationId}`
);

const scrapeResults = (html) => {
  const $ = cheerio.load(html);

  const rows = $('table#grdResults_tblData tr').map((i, tr) => {
    // To fetch the actual document, prepend
    // http://www.dublincity.ie/AniteIM.WebSearch/Download.aspx?ID=
    // to the id that is returned here.
    // Redirects have to be followed in order to get the documents.
    const path = $($('td a', tr)[0]).prop('href');
    const id = path && path.match(/ID=(\d+)/)[1];
    const date = _.trim($($('td a', tr)[0]).text());
    const description = _.trim($($('td', tr)[1]).text());
    const ref = _.trim($($('td', tr)[2]).text());
    return {
      id,
      date,
      description,
      ref,
    };
  }).get();

  // First two rows in the table are pagination and headings.
  return _.drop(rows, 2);
};

module.exports.scrapeDocumentsForPlanningApplication =
  async (planningApplicationId, cookieString) => {
    // This page requires a cookie to be set before it will load.
    if (!cookieString) {
      cookieString = await getSessionCookie();
    }

    const jar = rp.jar();
    jar.setCookie(cookieString, HOSTNAME);

    var options = {
      jar,
      uri: url(planningApplicationId),
    };

    const html = await rp(options);
    const pageResults = scrapeResults(html);
    return pageResults;
  };

