const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config()

// start app
const app = express();
app.use(cors());

// routes
app.get('/', async (_, res) => {
  const key = process.env.API_KEY || false
  if (!key) {
    throw new Error('API Key Not Found.')
  }

  const url = `https://api.spoonacular.com/recipes/search?query=milkshake&number=2&apiKey=${key}`

  axios.get(url)
  .then(function (r) {
    res.json(r.data)
  })
  .catch(function (err) {
    console.log(err);
  })

  res.send('hello worlds!')

});


// listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Food2Vec Text API listening on port ${port}!`);
})
