import { parse } from 'csv-parse';

const host = process.env.ACTIONKIT_HOST;
const username = process.env.ACTIONKIT_USERNAME;
const password = process.env.ACTIONKIT_PASSWORD;
const report = process.env.ACTIONKIT_REPORT_NAME;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=14400');

  const headers = new Headers();
  headers.append(
    'Authorization',
    'Basic ' + Buffer.from(username + ":" + password).toString('base64')
  );
  
  const resp = await fetch(`https://${host}/rest/v1/report/run/${report}?format=csv&refresh=1`, {
    method: 'GET',
    headers,
  });

  const csv = await resp.text();

  parse(csv, { columns: true }, (err, records) => {
    res.json({
      err,
      records,
    })
  });
}
