require('dotenv').config();
var tmi = require('tmi.js');

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
client.on('message', onMessageHandler);
// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  client.say(`#${process.env.CHANNEL_NAME}`, `Бот подключился в чат и готов для тестов`);
}

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  const commandName = msg.trim();
  switch (commandName) {
    case '!test':
      console.log(target)
      client.say(target, `тест: SUCCESS`);
      break;
  }
}
