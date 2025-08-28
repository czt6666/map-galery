const redis = require("redis");

const client = redis.createClient();

client.on("error", (err) => {
    console.error("Redis error:", err);
});

client.connect().then(() => {
    console.log("Connected to Redis");
});

module.exports = client;
