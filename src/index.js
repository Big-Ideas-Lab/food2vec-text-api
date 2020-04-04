const express = require('express');
const cors = require('cors');

// start app
const app = express();
app.use(cors());

// routes
app.get('/', (_, res) => {
  res.send('hello world!')
});


// listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`COVIDentify API listening on port ${port}!`);
})
