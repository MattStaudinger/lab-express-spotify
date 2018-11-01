const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
var clientId = "11a396d785e64d0c938445459e755878",
  clientSecret = "726bdfba97aa469aa82499f5b2272ccf";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/", (req, res) => {
  // console.log(req)
  res.render("index");
});

app.get("/artists", (req, res) => {
  let artist = req.query.name;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      let artistsList = data.body.artists.items;
      console.log(data.body.artists.items[1].images[0]);
      res.render("artists", { artistsList, artist });
    })
    .catch(err => {
      console.log("Error on Spotify API");
    });
});

app.get("/albums/:artistId", (req, res) => {
  let id = req.params.artistId;

  spotifyApi.getArtistAlbums(id).then(
    function(data) {
      let albums = data.body.items;
      console.log("Artist albums", data.body.items[0].external_urls);
      res.render("albums", { albums });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000);
