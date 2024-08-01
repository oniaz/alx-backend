import { createClient } from 'redis';

const client = createClient({
  url: 'redis://127.0.0.1:6379'
});

(async () => {
  try {
    await client.connect();
    console.log('Redis client connected to the server');

  } catch (err) {
    console.error(`Redis client not connected to the server: ${err}`);
  } finally {
    await client.quit();
  }
})();
