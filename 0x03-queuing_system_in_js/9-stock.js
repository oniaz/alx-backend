const express = require('express');
const { createClient, print } = require('redis');
const { promisify } = require('util');

const app = express();
const client = createClient();
const port = 1245;

const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

// Initialize Redis
client.on('connect', function () {
  console.log('Redis client connected to the server');
  listProducts.forEach(product => {
    client.set(product.id, product.stock, print);
  });
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Utility functions
function getItemById(id) {
  return listProducts.find(product => product.id === id);
}

function reserveStockById(itemId, stock) {
  client.set(itemId, stock, (err, reply) => {
    if (err) {
      console.error('Error setting stock:', err);
    }
  });
}

const asyncGet = promisify(client.get).bind(client);
async function getCurrentReservedStockById(itemId) {
  const stock = await asyncGet(itemId);
  return stock ? parseInt(stock, 10) : 0;
}

// Route handlers
app.get('/list_products/', (req, res) => {
  const transformedProducts = listProducts.map(product => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock
  }));
  res.json(transformedProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const id = parseInt(req.params.itemId, 10);
  const product = getItemById(id);
  if (product) {
    product.stock = await getCurrentReservedStockById(id);
    res.json(product);
  } else {
    res.json({ "status": "Product not found" });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const id = parseInt(req.params.itemId);
  const product = getItemById(id);
  if (product) {
    const stock = await getCurrentReservedStockById(id);
    if (stock) {
      reserveStockById(id, stock - 1)
      res.json({ "status": "Reservation confirmed", "itemId": 1 });
    } else {
      res.json({ "status": "Not enough stock available", "itemId": id });
    }
  } else {
    res.json({ "status": "Product not found" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
