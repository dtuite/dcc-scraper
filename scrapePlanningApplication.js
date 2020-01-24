
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');

const TAB_REF = {
  addressDetails: 1,
  decision: 2,
  documents: 3,
  appealDetails: 4,
  furtherInfo: 5,
};

const url = (applicationId, tabNo = 1) => (
  `http://www.dublincity.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=${applicationId}&theTabNo=${tabNo}`
);

const scrapeResults = (html) => {
  const $ = cheerio.load(html);

};

const main = async () => {
  const html = await rp(url('WEB1259/19'));
  const pageResults = scrapeResults(html);

  // console.log(JSON.stringify(results, null, 2));
};

main();
