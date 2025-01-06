'use strict';
const amqplib = require('amqplib');
require('dotenv').config();
const url = process.env.URL_LOCAL;
const exchangeType = process.env.EXCHANGE_TYPE;

async function receiveEmail() {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const exchangeName = process.env.EXCHANGE_NAME;
        await channel.assertExchange(exchangeName, exchangeType, { durable: false });
        const { queue } = await channel.assertQueue('', { exclusive: true });

        const agrs = process.argv.slice(2);
        if (!agrs.length) {
            process.exit(0);
        }

        console.log(`Queue name: ${queue}`);
        console.log(`Routing pattern: ${agrs}`);

        agrs.forEach(async (key) => {
            await channel.bindQueue(queue, exchangeName, key);
        });
        await channel.consume(
            queue,
            (msg) => {
                console.log(`Routing pattern: ${msg.fields.routingKey} - Receive email: ${msg.content.toString()}`);
            },
            { noAck: true },
        );
    } catch (error) {}
}

receiveEmail();

// node receiveMail.js "dev.test.*"
