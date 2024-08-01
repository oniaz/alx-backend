import { createClient } from 'redis';

const client = createClient({
    url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Redis client connected to the server');

        const hashValues = {
            Portland: 50,
            Seattle: 80,
            'New York': 20,
            Bogota: 20,
            Cali: 40,
            Paris: 2
        };

        for (const key in hashValues) {
            client.hSet('HolbertonSchools', key, hashValues[key])
                .then(() => console.log('Reply: 1'));

        }

        client.hGetAll('HolbertonSchools').then((reply) => console.log(reply));

    } catch (err) {
        console.error(`Redis client not connected to the server: ${err}`);
    } finally {
        await client.quit();
    }
})();