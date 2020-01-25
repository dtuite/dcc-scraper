const rp = require('request-promise');
const _ = require('lodash');
const fs = require('fs');

const url = `http://www.dublincity.ie/swiftlg/apas/run/wphappsearchres.displayResultsURL?ResultID=5335334&StartIndex=1&SortOrder=APNID:DESC&DispResultsAs=WPHAPPSEARCHRES&BackURL=%3Ca%20href=wphappcriteria.display?paSearchKey=4583607%3ESearch%20Criteria%3C/a%3E`;

module.exports = async () => {
  const jar = rp.jar();

  const requestOpts = {
    uri: url,
    jar,
  };

  await rp(requestOpts);
  return jar.getCookieString(url);
};
