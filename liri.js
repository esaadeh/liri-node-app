require("dotenv").config();

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
// switch (command) {
//     case 'movie-this'
// }



// Build OMDB query URL using user inputs
// Key=trilogy
var omdbUrl = "http://www.omdbapi.com/?t=" + queryInput + "&y=&plot=short&apikey=trilogy";
console.log(omdbUrl);

// Axios request to OMDB API if user command 'movie-this'
if (commandInput === 'movie-this') {
    axios.get(omdbUrl).then(function (omdbResponse) {
        console.log(omdbResponse.data);
    });
}

// Build BIT query URL using user inputs
//app_id=codingbootcamp
var bitUrl = "https://rest.bandsintown.com/artists/" + queryInput + "/events?app_id=codingbootcamp";
console.log(bitUrl);
// Axios request to Bands in Town Artist Events API if user command 'concert-this'
if (commandInput === 'concert-this') {
    axios.get(bitUrl).then(function (bitResponse) {
        console.log(bitResponse.data);
    });
}

// Read the random-text file and execute the instrucitons within if user command 'do-what-it-says'
if (commandInput === 'do-what-it-says') {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        // Conver the string read from random.txt into an array
        var dataArray = data.split(',');
//*******************Double quotes in some name */
        console.log(dataArray);
    });
}