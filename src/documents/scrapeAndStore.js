const PlanningApplicationDocument = require('./model');
const { scrapeDocumentsForPlanningApplication } = require('./scrape');
const getSessionCookie = require('../getSessionCookie');
const sleep = require('../sleep');

const prepareDocumentForDatabase = (result, planningApplicationId) => ({
  documentId: result.id,
  description: result.description,
  dateText: result.date,
  ref: result.ref,
  planningApplicationId,
});

module.exports = async function scrapeAndStoreDocuments(planningApplications) {
  // This is one less request per planning application. Faster and easier on the server.
  const sessionCookie = await getSessionCookie();

  for(const app of planningApplications) {
    const planningAppId = app.get('planningApplicationId');
    console.log('scraping documents for planning application id:', app.get('id'));
    const results = await scrapeDocumentsForPlanningApplication(planningAppId, sessionCookie);
    if (results) {
      await PlanningApplicationDocument.bulkCreate(results.map((result) => (
        prepareDocumentForDatabase(result, app.get('id'))
      )), {
        updateOnDuplicate: ['documentId'],
      });
    }
    await sleep(500);
  }
};
