/* Import modules */
const express = require('express');
const user = express.Router();
user.use(express.json());

/* Import login-model for login authentication */
const LoginInfo = require('../models/login-model').LoginInfo;
const loginInfo = new LoginInfo();

const WebService = require("../models/user-model");
const webService = new WebService();

/* Authorization Pass */
var auth_pass;
// True: User has logged in.
// False: User has not logged in.


/* ---------- User Subsystem at http://localhost:8080/user/ ---------- */

// Request to Log in as User
user.post('/', async function(req, res){
    let login_info = req.body;

    // For debug
    // console.log("From router");
    // console.log(login_info);

    // Request to log in
    auth_pass = await loginInfo.authorize(login_info);

    // For debug
    // console.log(auth_pass);

    // Prepare the response
    let result = {"auth_pass": auth_pass};

    // Send the response back to the user
    return res.send({ error: false, data: result });

});

// Send the user page to the user
user.get('/', function(req, res) {

    // If the user has not logged in, send the login page instead
    if(!auth_pass) {
        return res.render("login"); // Send login.ejs to the user
    }    
    else {
        return res.render("user"); // Send user.ejs to the user
    }
    
});

// Search for albums of a movie on Spotify
user.post("/spotify/album", async function(req, res) {
    let query = req.body.query;

    // For debug
    // console.log("From router");
    // console.log(query);

    // Search for the albums
    let results = await webService.searchSpotifyAlbum(query);

    // For debug
    // console.log("From router 2");
    // console.log(results);

    // Return info of the albums from the search as a response
    return res.send({ error: false, data: results });

});

// Search for soundtracks in an album
user.post("/spotify/track", async function(req, res) {
    let albumID = req.body.id;

    // For debug
    // console.log("From router");
    // console.log(albumID);

    // Search for soundtracks with an album ID
    let track = await webService.searchSpotifyTrack(albumID);

    // For debug
    // console.log("From router 2");
    // console.log(track);

    // Return a link to the audio and a link to Spotify page as a response
    return res.send({ error: false, data: track });

});

// Search for tweets related to the movie
user.post("/twitter", async function(req, res) {
    let query = req.body.query;

    // For debug
    // console.log("From router");
    // console.log(query);

    let results = await webService.searchTwitter(query);

    // For debug
    // console.log("From router 2");
    // console.log(results);

    // Returning Tweets or Comments from the search as a response
    return res.send({ error: false, data: results });

});

/* Export user (router) for app.js to use */
module.exports = user;