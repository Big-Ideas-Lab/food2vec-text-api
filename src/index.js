const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

// start app
const app = express();
app.use(cors());

// start db connection
// TODO: move to .env
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'covidentify'
});

db.connect((err) => {
  if (err) {
    console.log('db connection failed!');
    throw err;
  } else {
    console.log('MySQL Connected...');
  }
})

// routes
app.get('/', (_, res) => {
  res.send('hello world!')
});

// Create db
app.get('/createdb', (req, res) => {
  let query = 'CREATE DATABASE covidentify';
  db.query(query, (err, qres) => {
    if(err) throw err;
    console.log('query result:', qres);
    res.send('Database created...')
  })
})

// Create db table
app.get('/createtable', (req, res) => {
  let query = 'CREATE TABLE data(id int AUTO_INCREMENT, email VARCHAR(255), PRIMARY KEY (id))';
  db.query(query, (err, qres) => {
    if(err) throw err;
    console.log('query result:', qres);
    res.send('Data table created...')
  })
})

// listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`COVIDentify API listening on port ${port}!`);
})
