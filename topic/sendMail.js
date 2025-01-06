'use strict';
const amqplib = require('amqplib');
require('dotenv').config();

const url = process.env.URL_LOCAL;
const exchangeType = process.env.EXCHANGE_TYPE;

async function sendEmail() {
    try {
        const connection = await amqplib.connect(url);
        const channel = await connection.createChannel();
        const exchangeName = process.env.EXCHANGE_NAME;
        await channel.assertExchange(exchangeName, exchangeType, {
            durable: false,
        });
        const agrs = process.argv.slice(2);
        const msg = agrs[1] || 'Fixed';
        const routingKey = agrs[0];
        console.log(`process.argv: ${process.argv}`);
        console.log(`msg: ${msg}`);
        console.log(`routing key: ${routingKey}`);

        await channel.publish(exchangeName, routingKey, Buffer.from(msg));
        console.log(`Send email: ${msg}`);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error(error.message);
    }
}

sendEmail();

// node sendMail.js "dev.test" "Hello dev test"
// node sendMail.js "dev.test.leader" "Hello dev test leader"
