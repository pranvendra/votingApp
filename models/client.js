const { Client } = require('pg');

const client = new Client({
    user: 'azilkqphlhwgni',
    host: 'ec2-34-232-147-86.compute-1.amazonaws.com',
    database: 'd3sc7n2mmjbt9q',
    password: '02df694e9ba47f164217ee121a47d90a7df814b6678c76d3dfe3f5412c263e78',
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