// dotenv package and apiKeys varialble needed to hide and set api keys
require("dotenv").config();
var apiKeys = require("./keys.js");

// node-spotify-api, axios,  moment file system packages required
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
moment().format();
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

// Set the commandInput through a swith statement to direct code flow

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
        console.log('\n******** Instructions *********\nTo search for a movie, enter: "movie-this" followed by a space and the movie name.');
        console.log('\nTo search for live events for an artist, enter: "concert-this" followed by a space and the artist name');
        console.log('\nTo search spotify for an song, enter "spotify-this followed by a space and the song name');
        console.log('\nTo do what is listed in the random.txt file, enter "do-what-it-says"\n');
}

// Function to run Axios request to OMDB API if user command 'movie-this'
function movies() {
    // Build OMDB query URL using user inputs
    var omdbUrl = "http://www.omdbapi.com/?t=" + queryInput + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbUrl).then(function (omdbResponse) {
        console.log('********* movie-this request results *********\n')
        console.log('Movie Title Requested:  ' + omdbResponse.data.Title + '\n');
        console.log('Release Date:  ' + omdbResponse.data.Released + '\n');
        console.log('IMDB Rating:  ' + omdbResponse.data.Ratings[0].Value + '\n');
        console.log('Rotton Tomatoes Rating:  ' + omdbResponse.data.Ratings[1].Value + '\n');
        console.log('Production Country:  ' + omdbResponse.data.Country + '\n');
        console.log('Language:  ' + omdbResponse.data.Language + '\n');
        console.log('Plot:  ' + omdbResponse.data.Plot + '\n');
        console.log('Actors:  ' + omdbResponse.data.Actors + '\n');
    });
}

// Function to run Axios request to Bands in Town Artist Events API if user command 'concert-this'
function concert() {
    // Build BIT query URL using user inputs
    var bitUrl = "https://rest.bandsintown.com/artists/" + queryInput + "/events?app_id=codingbootcamp";

    axios.get(bitUrl).then(function (bitResponse) {
        console.log('\n********* concert-this request results *********\n')
        console.log('Artist:  ' + bitResponse.data[0].lineup[0] + '\n');
        console.log('Venue:  ' + bitResponse.data[0].venue.name + '\n');
        console.log('Location:  ' + bitResponse.data[0].venue.city + ', ' + bitResponse.data[0].venue.region + '\n');

        // Removing timestamp then moment date converstion
        var date = bitResponse.data[0].datetime.slice(0, 10);
        var dateMoment = moment(date, 'YYYY-MM-DD');
        var venueDate = (dateMoment.format('MM/DD/YYYY'));

        console.log('Date:  ' + venueDate + '\n');
    });
}

// Function to read the random-text file and execute the instrucitons within if user command 'do-what-it-says'
function doThis() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        // Conver the string read from random.txt into an array
        var dataArray = data.split(',');
        commandInput = dataArray[0];
        // Removing the quotations in dataArray[1] so the concert-this command works
        queryInput = dataArray[1].slice(1, (dataArray[1].length - 1));

        switch (commandInput) {
            case 'movie-this':
                movies();
                break;

            case 'concert-this':
                concert();
                break;

            case 'spotify-this-song':
                spotify();
                break;

            default:
                console.log('Formatting issues with the random.txt file!');
        }
    });
}

// Function to run node-spotify-api request if user command 'spotify-this-song'
function spotify() {
    // Setting the spotify api keys
    var spotify = new Spotify(apiKeys.spotify);

    // Run this if user supplies queryInput
    if (commandInput === 'spotify-this-song' && queryInput) {
        spotify.search({ type: 'track', query: queryInput, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log('********* spotify-this-song request results *********\n')
            console.log('Artist:  ' + data.tracks.items[0].artists[0].name + '\n');
            console.log('Song:  ' + data.tracks.items[0].name + '\n');
            console.log('Preview Link:  ' + data.tracks.items[0].external_urls.spotify + '\n');
            console.log('Album:  ' + data.tracks.items[0].album.name + '\n');
        });
    } else {
        // Run this if user doesn't supply queryInput
        spotify.search({ type: 'track', query: 'The Sign', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log('********* spotify-this-song request results *********\n')
            console.log('Artist:  ' + data.tracks.items[0].artists[0].name + '\n');
            console.log('Song:  ' + data.tracks.items[0].name + '\n');
            console.log('Preview Link:  ' + data.tracks.items[0].external_urls.spotify + '\n');
            console.log('Album:  ' + data.tracks.items[0].album.name + '\n');
        });
    }
}

