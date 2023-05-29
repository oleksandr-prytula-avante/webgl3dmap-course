const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const dirname = __dirname + '/dist';

app.use(express.static(dirname));

app.get('*', function (_, res) {
  res.sendFile(path.resolve(dirname, 'index.html'));
});

app.listen(PORT, function () {
  console.log(`App server is running ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
