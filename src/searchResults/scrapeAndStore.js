const { scrapeMultiplePages } = require('./scrape');
const PlanningApplication = require('../planningApplication/model');

const prepareResultForDatabase = (result) => ({
  planningApplicationId: result.applicationId,
  description: result.description,
  addressText: result.location,
});

module.exports = async (createSearchUrl, pagesToScrape) => {
  const results = await scrapeMultiplePages(createSearchUrl, {
    pagesToScrape,
  });

  await PlanningApplication.bulkCreate(results.map(prepareResultForDatabase), {
    updateOnDuplicate: ['planningApplicationId'],
  });

  return null;
};
