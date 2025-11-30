const fetch = require('node-fetch');

async function seed(count=200){
  const url = process.env.API_URL || 'http://localhost:4000/api/dev/seed';
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ count }) });
  const data = await res.json();
  console.log('Seed result', data);
}

seed(process.argv[2] ? parseInt(process.argv[2],10) : 200).catch(err => console.error(err));
