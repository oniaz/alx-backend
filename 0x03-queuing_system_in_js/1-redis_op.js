import { createClient } from 'redis';

const client = createClient({
  url: 'redis://127.0.0.1:6379'
});

async function setNewSchool(schoolName, value) {
  try {
    const reply = await client.set(schoolName, value);
    console.log('Reply:', reply);
  } catch (err) {
    console.error('Error setting value:', err);
  }
}

async function displaySchoolValue(schoolName) {
  try {
    const reply = await client.get(schoolName);
    console.log(reply);
  } catch (err) {
    console.error('Error getting value:', err);
  }
}

(async () => {
  try {
    await client.connect();
    console.log('Redis client connected to the server');

    await displaySchoolValue('Holberton');
    await setNewSchool('HolbertonSanFrancisco', '100');
    await displaySchoolValue('HolbertonSanFrancisco');
  } catch (err) {
    console.error(`Redis client not connected to the server: ${err}`);
  } finally {
    await client.quit();
  }
})();
