const { Client } = require('pg');

const client = new Client({
    user: 'nqrkcmaxydzxpi',
    host: 'ec2-52-44-166-58.compute-1.amazonaws.com',
    database: 'dbhslald02r5f7',
    password: '3eba7b9c0f5b3a366dcc749ecbce1176b799ca5c5e3710c6d7e0935af2d0703a',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});


client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  });

module.exports = {
    client
}