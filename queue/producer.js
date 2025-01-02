'use strict';
const amqplib = require('amqplib');
require('dotenv').config();
const url = process.env.URL_LOCAL;

async function sendQueue({ msg }) {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const queueName = process.env.QUEUE_NAME;
        await channel.assertQueue(queueName, {
            durable: true,
            //durable: true => Server rabbitMQ restart or crash, message in queue is still exist
        });
        await channel.sendToQueue(queueName, Buffer.from(msg), { expiration: '100000', persistent: true });
        // persistent: true => Save message in disk, server rabbitMQ restart or crash, it will get message from disk
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello';
console.log(process.argv);

sendQueue({ msg });
