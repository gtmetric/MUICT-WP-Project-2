const Spotify = require('node-spotify-api');
const spotify = new Spotify({
    id: "8a0848d691524483bed754136bb569f1",
    secret: "4592dbec8da7454c8b6fbb6268aac750"
});

const Twit = require('twit');
const twit = new Twit({
    consumer_key: "qCbZc0VTCzvDuMl45AwaBBnRe",
    consumer_secret: "CaXAVn0xuvryMr8iAtp1cCHopuxw6FYoWwyqDhl0zlBiTvtZK6",
    access_token: "2793892352-HKrC8VC4efA0PQWheOqcDTG4q8PjLOluvNCiCG8",
    access_token_secret: "f309jaTOHbi94cClIBx8n4O51vW59zAFHftFJTiVN9lTr"
});

class WebService {

    /* Search for albums on Spotify */
    async searchSpotifyAlbum(query) {

        // Request for 3 albums that match to the query (search word)
        let res = await spotify.search({ 
            type: 'album', 
            query: `${query} original soundtrack`, 
            limit: "3"
        });

        // Return info of albums from the search
        return res.albums.items;
        
    }

    /* Search for audio tracks on Spotify */
    async searchSpotifyTrack(albumID) {

        // Link to the audio API
        let trackURL;

        // Request for all tracks in an album
        await spotify.request("https://api.spotify.com/v1/albums/" + albumID + "/tracks")
        .then(function(data) {

            // For debug
            // console.log("From model");
            // console.log(data.items[0].href); 

            // Get the link to the album API
            trackURL = data.items[0].href;

            // For debug
            // console.log(trackURL); 

        });

        // For keeping the result to send back to the client
        let track;

        // Request for the audio or a link to Spotify page
        await spotify.request(trackURL)
        .then(function(data) {

            // For debug
            // console.log("From model");
            // console.log(data.items[0].href); 
            
            // Prepare the response
            track = { 
                audio: data.preview_url,
                link: data.external_urls.spotify
            };
            
        });

        // Return the audio and link back to the client
        return track;

    }

    /* Search for comments in Twitter */
    async searchTwitter(query) {

        // Prepare parameters for the request
        let params = {
            q: `${query} movie review`,
            count: 3
        };

        // Search for comments on Twitter
        let res = await twit.get("search/tweets", params);

        // Get statuses (Tweets or Comments) from the response
        let tweets = res.data.statuses;

        // For debug
        // console.log("From model");
        // console.log(tweets);

        // Return the Tweets or Comments as a reponse
        return tweets;

    }

}

/* Export WebService (class) for user-router to use */
module.exports = WebService;