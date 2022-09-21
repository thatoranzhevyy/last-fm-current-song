require('dotenv').config();
var request = require("request"),
  tmi = require('tmi.js'),
  currentTrack;

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME, password: process.env.OAUTH_TOKEN
  }, channels: [process.env.CHANNEL_NAME]
};
// Create a client with our options
const client = new tmi.client(opts);
// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);
// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  fetchLastPlayedTrack(process.env.LAST_FM_USERNAME, checkIfTrackIsPlayingAndNew);
  console.log(`* Connected to ${addr}:${port}`);
}


function fetchLastPlayedTrack(username, callback) {
  var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks" +
      "&user=" + username +
      "&api_key=" + process.env.LAST_FM_TOKEN +
      "&format=json",
    data,
    track;

  request(url, function (error, response, body) {
    if (error) {
      console.error(error);
    } else if (response.statusCode != 200) {
      console.error("Unhandled response type:", response.statusCode);
    } else {
      try {
        data = JSON.parse(body);
        if (data.recenttracks && data.recenttracks.track) {
          track = data.recenttracks.track;

          if (Array.isArray(track)) {
            track = track[0];
          }

          if (callback) {
            callback(track);
          } else {
            console.log(track);
          }
        } else if (data.error && data.message) {
          console.error(data.message)
        } else {
          console.error("Unrecognized data", data);
        }

        setTimeout(function () {
          fetchLastPlayedTrack(username, checkIfTrackIsPlayingAndNew);
        }, 10000);
      } catch (e) {
        console.error(e, body);
      }
    }
  });
}

function checkIfTrackIsPlayingAndNew(track) {
  var trackName;

  if (track.hasOwnProperty("@attr") &&
    track["@attr"].nowplaying &&
    "true" == track["@attr"].nowplaying) {
    trackName = track.artist["#text"] + " - " + track.name;

    if (currentTrack != trackName) {
      // console.log(trackName);
      sendMessageToTwitch(trackName);
      currentTrack = trackName;
    }
  }
}

function sendMessageToTwitch(message) {
  console.log(new Date().toLocaleString() + ": " + message)
  client.say(`#${process.env.CHANNEL_NAME}`, `Сейчас играет: ${message}`);
}

