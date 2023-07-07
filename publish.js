require('dotenv').config();

// Load the API key as a variable
// const hubspotKey = process.env.HUBSPOT_PRIVATE_APP_KEY;
const hubspotKey = process.env.HUBSPOT_KEY_PROD;

var http = require('https');

const fs = require('fs');

function publishPages() {
  var options = {
    method: 'POST',
    hostname: 'api.hubapi.com',
    port: null,
    path: '/cms/v3/pages/landing-pages/schedule',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${hubspotKey}`,
    },
  };

  // Create a date variable so we don't have to set it manually every time
  const currentDate = new Date();

  const publishDate = new Date(currentDate.getTime() + 5 * 60 * 1000).toISOString();

  // Read the CSV file, parse and map its contents
  const file = fs.readFileSync('ids.csv', 'utf-8');

  const lines = file.split('\n');

  const header = lines.shift();

  const pages = lines.map((line) => {
    const [id] = line.split(',');
    return { id };
  });

  // Loop through the pages array and set a publish date in the future
  pages.forEach(function (page) {
    var req = http.request(options, function (res) {
      var chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        var body = Buffer.concat(chunks);
        console.log(page.id + ' scheduled to publish.');
      });
    });

    req.write(JSON.stringify({ id: page.id, publishDate: publishDate }));
    req.end();
  });
}

module.exports = publishPages;
