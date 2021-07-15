
const mqtt = require('async-mqtt');
const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const Config = require('./config');
var mongodbUrl = `mongodb://${Config.mongodbUsername}:${Config.mongodbPassword}@${Config.mongodbHost}`;

/**
 * Save data to mongodb collection
 */
async function saveToCollection(persistentLogId, collection, data) {
  console.log(`${persistentLogId}: saving data ${JSON.stringify(data)} to collection ${collection}`);
  try {
    const db = await MongoClient.connect(mongodbUrl);
    var dbo = db.db(Config.mongodbDatabase);
    await dbo.collection(collection).insertOne(data);
    db.close();
    console.log(`${persistentLogId}: Saved to the database`);
  } catch (e) {
    console.error(`${persistentLogId}: Could not save data: ${e}`);
  }
}
/**
 * Short code for matching simple wildcards for topic and parameter separation
 * 
 * https://stackoverflow.com/a/32402438/6803886
 */
function matchRuleShort(str, rule) {
  var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}

async function saveChatMessage(message) {
  const persistentLogId = `PlayerChat-${uuidv4()}`;
  saveToCollection(persistentLogId, Config.mongodbChatCollection, message);
}

async function savePlayerConnected(message) {
  const persistentLogId = `PlayerConnected-${uuidv4()}`;
  saveToCollection(persistentLogId, Config.mongodbConnectionCollection, message);
}

async function savePlayerDisconnected(message) {
  const persistentLogId = `PlayerDisconnected-${uuidv4()}`;
  saveToCollection(persistentLogId, Config.mongodbDisconnectsCollection, message);
}

async function savePlayerHit(message) {
  const persistentLogId = `PlayerHit-${uuidv4()}`;
  saveToCollection(persistentLogId, Config.mongodbPlayerHitCollection, message);
}

async function savePlayerItemPickup(message) {
  const persistentLogId = `PlayerItemPickup-${uuidv4()}`;
  saveToCollection(persistentLogId, Config.mongodbItemPickupCollection, message);
}

/**
 * Subscribe to all the topics and process messages
 */
async function start() {
  console.log(`Connecting to MQTT ${Config.mqttHost}`)
  const client = await mqtt.connectAsync(Config.mqttHost, { connectTimeout: 10 }, true)
  console.log("Connected")
  await client.subscribe("game/server/+/events/player/+/chat", (e) => e && console.log(e));
  await client.subscribe("game/server/+/events/player/+/connect", (e) => e && console.log(e));
  await client.subscribe("game/server/+/events/player/+/disconnect", (e) => e && console.log(e));
  await client.subscribe("game/server/+/events/player/+/hit", (e) => e && console.log(e));
  await client.subscribe("game/server/+/events/player/+/item/+/pickup", (e) => e && console.log(e));

  client.on('message', async function (topic, message) {
    console.log(`Got message on topic ${topic}`)
    // message is Buffer
    const parsedMessage = JSON.parse(message.toString())

    // Naive approach to finding parameters, but it will have to do for now.
    const topicSplit = topic.split('/')
    if (matchRuleShort(topic, 'game/server/*/events/player/*/chat')) {
      await saveChatMessage({ ...parsedMessage, serverId: topicSplit[2], playerId: topicSplit[5] });
    } else if (matchRuleShort(topic, 'game/server/*/events/player/*/connect')) {
      await savePlayerConnected({ ...parsedMessage, serverId: topicSplit[2], playerId: topicSplit[5] });
    } else if (matchRuleShort(topic, 'game/server/*/events/player/*/disconnect')) {
      await savePlayerDisconnected({ ...parsedMessage, serverId: topicSplit[2], playerId: topicSplit[5] });
    } else if (matchRuleShort(topic, 'game/server/*/events/player/*/hit')) {
      await savePlayerHit({ ...parsedMessage, serverId: topicSplit[2], playerId: topicSplit[5] });
    } else if (matchRuleShort(topic, 'game/server/*/events/player/*/item/*/pickup')) {
      await savePlayerItemPickup({ ...parsedMessage, serverId: topicSplit[2], playerId: topicSplit[5], itemId: topicSplit[7] });
    }
  })
}
start().then(async () => {
  //For testing purposes lets publish on the subscribed channels
  // const client = await mqtt.connectAsync(Config.mqttHost)
  // const getIsoTimestamp = () => {
  //   return new Date().toISOString();
  // };
  // await client.publish(
  //   "game/server/serverId1/events/player/playerId1/chat",
  //   JSON.stringify(
  //     {
  //       chatTimestamp: getIsoTimestamp(),
  //       message: 'test message 1',
  //     }
  //   )
  // );
  // await client.publish(
  //   "game/server/serverId1/events/player/playerId1/connect",
  //   JSON.stringify(
  //     {
  //       connectTimestamp: getIsoTimestamp(),
  //     }
  //   )
  // );
  // await client.publish(
  //   "game/server/serverId1/events/player/playerId1/disconnect",
  //   JSON.stringify(
  //     {
  //       disconnectTimestamp: getIsoTimestamp(),
  //     }
  //   )
  // );
  // await client.publish(
  //   "game/server/serverId1/events/player/playerId1/hit",
  //   JSON.stringify(
  //     {
  //       hitTimestamp: getIsoTimestamp(),
  //       damage: 100,
  //       target: "player0",
  //     }
  //   )
  // );
  // await client.publish(
  //   "game/server/serverId1/events/player/playerId1/item/item1/pickup",
  //   JSON.stringify(
  //     {
  //       hitTimestamp: getIsoTimestamp(),
  //       damage: 100,
  //       target: "player0",
  //     }
  //   )
  // );
}).catch(e => { console.error(e) });

