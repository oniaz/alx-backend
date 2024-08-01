// import { createClient } from 'redis';

// const client = createClient({
//     url: 'redis://127.0.0.1:6379'
// });

// client.on('error', (err) => {
//     console.error(`Redis client not connected to the server: ${err}`);
// });

// client.on('connect', () => {
//     console.log('Redis client connected to the server');
//     client.subscribe('holberton school channel', (err) => {
//     });
// });

// client.on('message', (channel, message) => {
//     if (channel === 'holberton school channel') {
//         console.log(`Received message: ${message}`);
//         if (message === 'KILL_SERVER') {
//             client.unsubscribe('holberton school channel');
//             client.quit();
//         }
//     }
// });


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
    client.subscribe('holberton school channel', (err) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        }
    });
});

// Handle messages received on the subscribed channel
client.on('message', (channel, message) => {
    if (channel === 'holberton school channel') {
        console.log(`Received message: ${message}`);
        if (message === 'KILL_SERVER') {
            client.unsubscribe('holberton school channel', (err) => {
                if (err) {
                    console.error('Failed to unsubscribe:', err);
                } else {
                    console.log('Unsubscribed from the channel');
                }
            });
            client.quit();
        }
    }
});
