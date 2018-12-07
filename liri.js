// dotenv package and apiKeys varialble needed to hide and set api keys
require("dotenv").config();
var apiKeys = require("./keys.js");

// node-spotify-api, axios,  moment file system packages required
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');


// Store all of the arguments in an array
var nodeArgs = process.argv;
// Set the user's command input
var commandInput = nodeArgs[2];
// Create an empty variable to hold the query input
var queryInput = '';

// Populate the queryName var above with '+' delimited user input starting at process.argv[3]
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        queryInput = queryInput + '+' + nodeArgs[i];
    }
    else {
        queryInput += nodeArgs[i];
    }
}

// Set the commandInput through a swith statement to direct data flow

switch (commandInput) {
    case 'movie-this':
        movies();
        break;

    case 'concert-this':
        concert();
        break;

    case 'do-what-it-says':
        doThis();
        break;

    case 'spotify-this-song':
        spotify();
        break;

    default:
        console.log('To search for a movie, enter: "movie-this" followed by a space and the movie name');
        console.log('To search for live events for an artist, enter: "concert-this" followed by a space and the artist name');
        console.log('To search spotify for an song, enter "spotify-this followed by a space and the song name');
        console.log('To do what is listed in the random.txt file, enter "do-what-it-says');
}

// Function to run Axios request to OMDB API if user command 'movie-this'
function movies() {
    // Build OMDB query URL using user inputs
    var omdbUrl = "http://www.omdbapi.com/?t=" + queryInput + "&y=&plot=short&apikey=trilogy";
    console.log(omdbUrl);

    axios.get(omdbUrl).then(function (omdbResponse) {
        console.log(omdbResponse.data.Title);
        console.log(omdbResponse.data.Released);
        console.log(omdbResponse.data.Ratings[0].Value);
        console.log(omdbResponse.data.Ratings[1].Value);
        console.log(omdbResponse.data.Country);
        console.log(omdbResponse.data.Language);
        console.log(omdbResponse.data.Plot);
        console.log(omdbResponse.data.Actors);
    });
}

// Function to run Axios request to Bands in Town Artist Events API if user command 'concert-this'
function concert() {
    // Build BIT query URL using user inputs
    var bitUrl = "https://rest.bandsintown.com/artists/" + queryInput + "/events?app_id=codingbootcamp";
    console.log(bitUrl);

    axios.get(bitUrl).then(function (bitResponse) {
        // console.log(bitResponse.data[1]);
        console.log(bitResponse.data[0].venue.name);
        console.log(bitResponse.data[0].venue.city);
        console.log(bitResponse.data[0].venue.region);
        console.log(bitResponse.data[0].datetime);
    });
}

// Function to read the random-text file and execute the instrucitons within if user command 'do-what-it-says'
function doThis() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        // Conver the string read from random.txt into an array
        var dataArray = data.split(',');
        console.log(dataArray);
    });
}

// Function to run node-spotify-api request if user command 'spotify-this-song'
function spotify() {
    // Setting the spotify api keys
    var spotify = new Spotify(apiKeys.spotify);
// Declaring variables required in the api request
    var artist = '';
    var songName = '';
    var previewLink = '';
    var albumName = '';

    // Run this if user supplies queryInput
    if (commandInput === 'spotify-this-song' && queryInput) {
        spotify.search({ type: 'track', query: queryInput, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            artist = data.tracks.items[0].artists[0].name;
            songName = data.tracks.items[0].name;
            previewLink = data.tracks.items[0].external_urls.spotify;
            albumName = data.tracks.items[0].album.name;

            console.log('Artist: ' + artist);
            console.log('Song: ' + songName);
            console.log('Preview Link: ' + previewLink);
            console.log('Album: ' + albumName);
        });
    } else {
        // Run this if user doesn't supply queryInput
        spotify.search({ type: 'track', query: 'The Sign', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            artist = data.tracks.items[0].artists[0].name;
            songName = data.tracks.items[0].name;
            previewLink = data.tracks.items[0].external_urls.spotify;
            albumName = data.tracks.items[0].album.name;

            console.log('Artist: ' + artist);
            console.log('Song: ' + songName);
            console.log('Preview Link: ' + previewLink);
            console.log('Album: ' + albumName);
        });
    }
}

