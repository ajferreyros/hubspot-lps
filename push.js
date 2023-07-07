require('dotenv').config();

// Load the API key as a variable
// const hubspotKey = process.env.HUBSPOT_PRIVATE_APP_KEY;
const hubspotKey = process.env.HUBSPOT_KEY_PROD;

var http = require('https');

const fs = require('fs');

function pushLive() {
  // Read the CSV file, parse and map its contents
  const file = fs.readFileSync('ids.csv', 'utf-8');

  const lines = file.split('\n');

  const header = lines.shift();

  let pageIds = lines.map((line) => {
    const [pageId] = line.split(',');
    return pageId;
  });

  fs.writeFileSync('ids.csv', header);

  // Loop through the page IDs and push drafts live
  pageIds.forEach((pageId) => {
    var options = {
      method: 'POST',
      hostname: 'api.hubapi.com',
      port: null,
      path: `/cms/v3/pages/landing-pages/${pageId}/draft/push-live`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${hubspotKey}`,
      },
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        var body = Buffer.concat(chunks);
        console.log(pageId + ' pushed live.');
      });
    });

    req.end();
  });
}

module.exports = pushLive;
