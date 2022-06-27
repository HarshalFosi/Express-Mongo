//require the express module
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require(`path`);
require('dotenv').config();
const { getNowPlaying } = require('./lib/spotify');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

app.get('/now-playing', async(req, res) => {
  const response = await getNowPlaying();
  if (response.status === 204 || response.status > 400) {
    return res.render("notPlaying",{
        status: "Not Playing",
        css: process.env.CSS_LOCATION
    })
  }

  const song = await response.json();
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;



  return res.render("Playing", {
    status: isPlaying,
    title: title,
    artist: artist,
    album: album,
    albumImageUrl: albumImageUrl,
    songUrl: songUrl,
    css: process.env.CSS_LOCATION
  })
})

app.listen(port, () => {
    console.log(`Congrats Server live on ${process.env.HOST}:${port} !`);
});
