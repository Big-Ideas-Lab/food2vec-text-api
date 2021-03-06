const axios = require('axios');
const stripHtml = require("string-strip-html");

const key = process.env.API_KEY || false
const mainURL = 'https://api.spoonacular.com/recipes'

// call recipe/:id/information
async function getRecipeInfo(query, recipies) {
  const fullData = [];
  let corpus = '';

  for (let i = 0; i < recipies.length; i++) {
    let id = recipies[i].id
    let url = `${mainURL}/${id}/information?apiKey=${key}`
    console.log(url);
    await axios.get(url)
    .then(({ data }) => {
      fullData.push(data)
      const summary = data.summary
      const instructions = data.instructions
      const combined = stripHtml(`${summary} ${instructions}`)
      corpus += combined
    })
  }
  return {
    query,
    corpus,
    data: fullData
  }
}

module.exports = {
  getRecipeInfo,
}
