const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://facturdv:secret@localhost:5432/facturdv'
});
client.connect()
  .then(() => client.query('SELECT id, company_id, status FROM invoices WHERE id = \'c9978651-fb27-4081-a66e-81673d3ed364\''))
  .then(res => { console.log(res.rows); client.end(); })
  .catch(err => { console.error(err); client.end(); });
