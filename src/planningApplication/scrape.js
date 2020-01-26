const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');

const sleep = require('../sleep');

const url = (applicationId) => (
  `http://www.dublincity.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=${applicationId}&theTabNo=1`
);

const getTextAtMatrixIndex = ($, rowElements, rowIndex, colIndex) => {
  const val = _.trim($($('td', rowElements[rowIndex])[colIndex]).text());
  if (val === '') return null;
  return val;
};

const getDateAtMatrixIndex = ($, rowElements, rowIndex, colIndex) => {
  const text = getTextAtMatrixIndex($, rowElements, rowIndex, colIndex);
  if (!text) return null;
  return Date.parse(text);
};

const scrapeResultsFromPage = (html) => {
  const $ = cheerio.load(html);

  const topTableRows = $('div#bodyContent table tr');
  const webReference = getTextAtMatrixIndex($, topTableRows, 0, 1);
  const applicationDate = getDateAtMatrixIndex($, topTableRows, 0, 3);
  const registrationDate = getDateAtMatrixIndex($, topTableRows, 1, 3);
  const decisionDate = getDateAtMatrixIndex($, topTableRows, 2, 1);
  const applicationType = getTextAtMatrixIndex($, topTableRows, 2, 3);
  const finalGrantDate = getDateAtMatrixIndex($, topTableRows, 3, 1);
  const extensionOfTimeToDate = getDateAtMatrixIndex($, topTableRows, 3, 3);
  const lastDateForObservations = getDateAtMatrixIndex($, topTableRows, 4, 1);
  const proposal = getTextAtMatrixIndex($, topTableRows, 7, 1);

  const inTabsTableRows = $('div#bodyContent table table table tr');
  const applicantName = getTextAtMatrixIndex($, inTabsTableRows, 2, 1);
  const applicantCompany = getTextAtMatrixIndex($, inTabsTableRows, 3, 1);
  const caseOfficer = getTextAtMatrixIndex($, inTabsTableRows, 5, 1);
  const agentName = getTextAtMatrixIndex($, inTabsTableRows, 8, 1);
  const agentCompany = getTextAtMatrixIndex($, inTabsTableRows, 9, 1);
  const agentCompanyAddress = getTextAtMatrixIndex($, inTabsTableRows, 10, 1);

  return {
    webReference,
    applicationDate,
    registrationDate,
    decisionDate,
    applicationType,
    finalGrantDate,
    lastDateForObservations,
    proposal,
    applicantName,
    applicantCompany,
    caseOfficer,
    agentName,
    agentCompany,
    agentCompanyAddress,
  };
};

const scrapeAndUpdate = async (planningApplicationRecord) => {
  const html = await rp(url(planningApplicationRecord.get('planningApplicationId')));
  const results = scrapeResultsFromPage(html);
  console.log(JSON.stringify(results, null, 2));
  const updatedRecord = await planningApplicationRecord.update(results);
  return updatedRecord;
};

module.exports.scrapeAndUpdate = scrapeAndUpdate;

module.exports.scrapeAndUpdateMultiple = async (planningApplicationRecords) => {
  for (const record of planningApplicationRecords) {
    console.log('scrapeAndUpdate', record.get('id'), record.get('planningApplicationId'));
    await scrapeAndUpdate(record);
    await sleep(1000);
  }
}
