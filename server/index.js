require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());
app.use(fileUpload());

app.use('/api/user', require('./apis/users'));

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log('Express server is running on localhost:3001')
);
