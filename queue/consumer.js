'use strict';
const amqplib = require('amqplib');
require('dotenv').config();
const url = process.env.URL_CLOUD;

async function receiveQueue() {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const queueName = process.env.QUEUE_NAME;
        await channel.assertQueue(queueName, {
            durable: false,
        });
        await channel.consume(
            queueName,
            (msg) => {
                console.log('Message:', msg.content.toString());
            },
            {
                noAck: true,
            },
        );
    } catch (error) {
        console.error('Error:', error.message);
    }
}

receiveQueue();
