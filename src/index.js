const sequelize = require('./database');
const PlanningApplication = require('./planningApplication/model');
const scrapeAndStoreSearchResults = require('./searchResults/scrapeAndStore');
const {
  findAllPlanningApplicationsWithoutDocuments,
} = require('./planningApplication/scopes');
const scrapeAndStoreDocuments = require('./documents/scrapeAndStore');
const {
  scrapeAndUpdateMultiple: scrapeAndUpdatePlanningApplications,
} = require('./planningApplication/scrape');

const sleep = require('./sleep');

const PAGES_TO_SCRAPE = 49;

// To get a URL, you have to manually perform a search on the website, then navigate to the
// second tab and back to the first tab. Take the URL and enter it here.
// The search below is everything in inchicore.
const createSearchUrl = (startIndex) => (
  `http://www.dublincity.ie/swiftlg/apas/run/WPHAPPSEARCHRES.displayResultsURL?ResultID=5337869&StartIndex=${startIndex}&SortOrder=APNID:DESC&DispResultsAs=WPHAPPSEARCHRES&BackURL=%3Ca%20href=wphappcriteria.display?paSearchKey=4585855%3ESearch%20Criteria%3C/a%3E`
);

const main = async () => {
  await sequelize.sync();
  console.log('database schema synced');

  // await scrapeAndStoreSearchResults(createSearchUrl, PAGES_TO_SCRAPE);
  // console.log('records created');

  // const allRecordsWithoutDocs = await findAllPlanningApplicationsWithoutDocuments();
  // await scrapeAndStoreDocuments(allRecordsWithoutDocs);

  const allRecordsNeedingScrape = await PlanningApplication.findAll({
    where: {
      registrationDate: null,
    },
    limit: 50,
  });
  await scrapeAndUpdatePlanningApplications(allRecordsNeedingScrape);
};

main()
  .catch(console.error);
