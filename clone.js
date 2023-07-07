require('dotenv').config();

// Load the API key as a variable
// const hubspotKey = process.env.HUBSPOT_PRIVATE_APP_KEY;
const hubspotKey = process.env.HUBSPOT_KEY_PROD;

var https = require('https');

const fs = require('fs');

let toClone = 10123456789;

function clonePages() {
  var options = {
    method: 'POST',
    hostname: 'api.hubapi.com',
    path: `/content/api/v2/pages/${toClone}/clone`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hubspotKey}`,
    },
  };

  // Read the CSV file, parse and map its contents
  const file = fs.readFileSync('clonedpages.csv', 'utf-8');

  const lines = file.split('\n');

  const header = lines.shift();

  const pages = lines.map((line) => {
    const [slug, name] = line.split(',');
    return { slug, name };
  });

  // Loop through the pages array and make a clone request for each page
  pages.forEach(function (page) {
    var req = https.request(options, function (res) {
      var chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        var body = Buffer.concat(chunks);
        var response = JSON.parse(body.toString());
        console.log(response.id);
        fs.appendFileSync('ids.csv', `\n${response.id}`);
      });
    });

    req.write(JSON.stringify({ name: page.name, slug: page.slug, state: 'PUBLISHED' }));
    req.end();
  });
}

module.exports = clonePages;
