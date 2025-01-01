'use strict';
const amqplib = require('amqplib');
require('dotenv').config();
const url = process.env.URL_CLOUD;

async function sendQueue({ msg }) {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const queueName = process.env.QUEUE_NAME;
        await channel.assertQueue(queueName, {
            durable: false,
        });
        await channel.sendToQueue(queueName, Buffer.from(msg));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello';
console.log(process.argv);

sendQueue({ msg });
