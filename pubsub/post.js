'use strict';
const amqplib = require('amqplib');
require('dotenv').config();
const url = process.env.URL_LOCAL;
const exchangeType = process.env.EXCHANGE_TYPE;

async function postVideo({ msg }) {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const exchangeName = process.env.EXCHANGE_NAME;
        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true,
        });
        await channel.publish(exchangeName, '', Buffer.from(msg));
        console.log(`Send video OK: ${msg}`);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error(error.message);
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello exchange';
postVideo({ msg });
