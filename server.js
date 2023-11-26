const path = require('path');
const express = require('express');
const app = express();

// From package.json (name)
const projectName = 'cacheando';

// Serve static files
app.use(express.static(`${__dirname}/dist/${projectName}`));

// Send all requests to index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(`${__dirname}/dist/${projectName}/browser/index.html`));
});

// default Heroku port
app.listen(process.env.PORT || 5000);
