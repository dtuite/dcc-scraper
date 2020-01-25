const sequelize = require('../database');
const { scrapeMultiplePages } = require('./scrape');
const PlanningApplication = require('../models/PlanningApplication');
const PlanningApplicationDocument = require('../models/PlanningApplicationDocument');
const { scrapeDocumentsForPlanningApplication } = require('../documents/scrape');
const getSessionCookie = require('../getSessionCookie');

const prepareResultForDatabase = (result) => ({
  planningApplicationId: result.applicationId,
  description: result.description,
  addressText: result.location,
});

const prepareDocumentForDatabase = (result, planningApplicationId) => ({
  documentId: result.id,
  description: result.description,
  dateText: result.date,
  ref: result.ref,
  planningApplicationId,
});

const scrapeAndStoreSearchResults = async () => {
  const results = await scrapeMultiplePages();
  await PlanningApplication.bulkCreate(results.map(prepareResultForDatabase));
  return null;
};

async function scrapeAndStoreDocuments(planningApplications) {
  for(const app of planningApplications) {
    const planningAppId = app.get('planningApplicationId');
    console.log('scraping documents for', app.get('id'));
    // This is one less request per planning application. Faster and easier on the server.
    const sessionCookie = await getSessionCookie();
    const results = await scrapeDocumentsForPlanningApplication(planningAppId, sessionCookie);
    await PlanningApplicationDocument.bulkCreate(results.map((result) => (
      prepareDocumentForDatabase(result, app.get('id'))
    )));
  }
};

const main = async () => {
  await sequelize.sync({ force: true })
  console.log('database schema synced');
  await scrapeAndStoreSearchResults();

  console.log('records created');
  const allRecords = await PlanningApplication.findAll();
  await scrapeAndStoreDocuments(allRecords);
};

main()
  .catch(console.error);
