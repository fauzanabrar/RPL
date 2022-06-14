import express from "express";
import cors from "cors";
import * as mqtt from "mqtt";
import bodyParser from "body-parser"

import db from "./config/Database.js";
import router from "./routes/index.js";
import mosuhaSensor from "./models/sensorData.js";

const options = {
    host: "test.mosquitto.org",
    port: 1883,
};

const topicMosuha = "mosuha";
const client = mqtt.connect(options);

const app = express();

// Mqtt Subscribe (terima data)
client.on("message", async (topic, message) => {
    if (topic == topicMosuha) {
        message = message.toString();
        const ob  = JSON.parse(message);
        const temp = ob.temp;

        try {
            await mosuhaSensor.create({
                temp: temp,
            })
        } catch (error) {
            console.log(error)
        }
    }
})

client.on("connect", () => {
    console.log("Mqtt Connected .......");
    client.subscribe(topicMosuha)
})

client.on("error", () => {
    console.log("error")
})

try {
    await db.authenticate();
    console.log("Database Connected .......")
    await db.sync();
} catch (error) {
    console.log(error)
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(router);

app.listen(5000, () => console.log("Server running on port 5000"))