//require the express module
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

app.listen(port, () => {
    console.log(`Congrats Server live on ${process.env.HOST}:${port} !`);
});
