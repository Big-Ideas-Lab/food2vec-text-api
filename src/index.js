const express = require('express');
const cors = require('cors');
const axios = require('axios');
const URL = require('url-parse');

require('dotenv').config()

const { getRecipesData } = require('./recipes');

// start app
const app = express();
app.use(cors());

const url = "https://api.spoonacular.com/recipes"
const key = process.env.API_KEY || false

// routes
app.get('/', async (_, res) => {
  if (!key) {
    res.status(500).json({
      status: 'ERROR',
      message: 'API Key Not Found.'
    })
  } else {
    const urlString = `https://api.spoonacular.com/recipes/search?query=milkshake&number=2&apiKey=${key}`

    axios.get(urlString)
    .then(function (r) {
      res.json(r.data)
    })
    .catch(function (err) {
      console.log(err);
    })

    res.send('hello worlds!')
  }
});

// app.get()

app.get('/recipes', async (request, response) => {
  const query = request.query.query
  const number = request.query.number

  if (!query && !number) {
    return response.status(400).json({
      status: 'ERROR',
      message: 'Make sure all queries are given.'
    });
  }

  const uri = new URL(`${url}/search`)
  const params = {
    ...request.query,
    apiKey: key,
  }
  uri.set('query', params)

  let location = uri.toString()

  return axios.get(location)
  .then(res => {
    const food = res.data.results
    // const data = await getRecipesData(food)
    // response.json(data)
    getRecipesData(food)
    .then((data) => {
      response.json(data)
    })
  })
  .catch(err => (
    response.status(500).send(err)
  ))
})


// listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Food2Vec Text API listening on port ${port}!`);
})
