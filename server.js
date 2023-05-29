require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const express = require('express');

const { useHeightMaps } = require('./firebase/heightMaps');

const app = express();
const PORT = process.env.PORT || 8080;
const dirname = __dirname + '/dist';

app.use(cors());
app.use(express.static(dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

useHeightMaps(app);

app.get('*', function (_, res) {
  res.sendFile(path.resolve(dirname, 'index.html'));
});

app.listen(PORT, function () {
  console.log(`App server is running ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
