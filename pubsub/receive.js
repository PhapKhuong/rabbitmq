'use strict';
const amqplib = require('amqplib');
require('dotenv').config();
const url = process.env.URL_LOCAL;
const exchangeType = process.env.EXCHANGE_TYPE;

async function receiveVideo() {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const exchangeName = process.env.EXCHANGE_NAME;
        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true,
        });
        const { queue } = await channel.assertQueue('', { exclusive: true });
        //exclusive: true => Queue auto is deleted if it doesn't follow
        console.log('Queue name:', queue);
        await channel.bindQueue(queue, exchangeName, '');
        await channel.consume(
            queue,
            (msg) => {
                console.log(`Receive video: ${msg.content.toString()}`);
            },
            { noAck: true },
        );
    } catch (error) {
        console.error(error);
    }
}

receiveVideo();
