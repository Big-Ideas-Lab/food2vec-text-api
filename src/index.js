const express = require('express');
const cors = require('cors');
const axios = require('axios');
const URL = require('url-parse');

require('dotenv').config()

const { getRecipeInfo } = require('./recipes');

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
    res.sendFile(__dirname + '/index.html')
  }
});

app.get('/recipe', async (request, response) => {
  const query = request.query.query
  const number = request.query.number

  if (!query) {
    return response.status(400).json({
      status: 'ERROR',
      message: 'Make sure all parameters are given.'
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
    getRecipeInfo(query, food)
    .then((data) => {
      response.json(data)
    })
  })
  .catch(err => (
    response.status(500).send(err)
  ))
})

app.get('/recipes', async (request, response) => {
  const queries = request.query.queries
  const number = request.query.number

  if (!queries) {
    return response.status(400).json({
      status: 'ERROR',
      message: 'Make sure all parameters are given.'
    });
  }

  const qArr = queries.split(',')
  const promises = [];
  const output = [];

  for (let query of qArr) {
    const uri = new URL(`${url}/search`)
    const params = {
      query: query,
      number: number,
      apiKey: key,
    }
    uri.set('query', params)

    let location = uri.toString()

    promises.push(
      axios.get(location)
      .then(res => {
        const food = res.data.results
        return getRecipeInfo(query, food)
      })
    );
  }

  return Promise.all(promises).then((res) => {
    // console.log('res', res);
    response.json(res)
  })
})

// listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Food2Vec Text API listening on port ${port}!`);
})
