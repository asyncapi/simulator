module.exports = {
    mongodbHost: process.env.mongodbHost || "0.0.0.0:27017",
    mongodbDatabase: "processor",
    mongodbUsername: "root",
    mongodbPassword: "example",
    mongodbConnectionCollection: "connections",
    mongodbItemPickupCollection: "itemPickup",
    mongodbPlayerHitCollection: "playerHit",
    mongodbDisconnectsCollection: "disconnects",
    mongodbChatCollection: "chat",
    mqttHost: process.env.mqttHost || "tcp://0.0.0.0:1883"
};