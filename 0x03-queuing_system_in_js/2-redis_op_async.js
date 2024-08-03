import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

client.on('connect', function () {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
});

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, print);
}

const asyncGet = promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
    console.log(await asyncGet(schoolName));
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
