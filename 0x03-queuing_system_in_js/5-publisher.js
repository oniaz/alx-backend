// import { createClient } from 'redis';

// const client = createClient({
//     url: 'redis://127.0.0.1:6379'
// });

// function publishMessage(message, time) {
//     setTimeout(async () => {
//         console.log(`About to send ${message}`);
//         await client.publish('holberton school channel', message);
//         console.log(`Message sent: ${message}`);
//     }, time);
// }

// publishMessage("Holberton Student #1 starts course", 100);
// publishMessage("Holberton Student #2 starts course", 200);
// publishMessage("KILL_SERVER", 300);
// publishMessage("Holberton Student #3 starts course", 400);

import { createClient } from 'redis';

const client = createClient({
    url: 'redis://127.0.0.1:6379'
});

// Handle errors
client.on('error', (err) => {
    console.error(`Redis client not connected to the server: ${err}`);
});

// Handle successful connection
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

// Function to publish messages
async function publishMessage(message, time) {
    try {
        await client.connect(); // Ensure the client is connected
        
        // Wait for the specified time (in milliseconds)
        setTimeout(async () => {
            console.log(`About to send ${message}`);
            await client.publish('holberton school channel', message);
            console.log(`Message sent: ${message}`);
        }, time);

    } catch (err) {
        console.error(`Error publishing message: ${err}`);
    } finally {
        // Ensure the client quits properly after publishing
        await client.quit();
    }
}

// Example usage of publishMessage function
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
