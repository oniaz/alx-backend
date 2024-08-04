const express = require('express');
const { createClient, print } = require('redis');
const { promisify } = require('util');

const app = express();
const client = createClient();
const port = 1245;

/**
 * @typedef {Object} Product
 * @property {number} id - The product ID.
 * @property {string} name - The name of the product.
 * @property {number} price - The price of the product.
 * @property {number} stock - The stock quantity of the product.
 */

/**
 * List of products available.
 * @type {Product[]}
 */
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
/**
 * Get a product by ID.
 * @param {number} id - The ID of the product.
 * @returns {Product|undefined} The product object or undefined if not found.
 */
function getItemById(id) {
  return listProducts.find(product => product.id === id);
}

/**
 * Reserve stock by product ID.
 * @param {number} itemId - The ID of the product.
 * @param {number} stock - The new stock quantity.
 */
function reserveStockById(itemId, stock) {
  client.set(itemId, stock, (err, reply) => {
    if (err) {
      console.error('Error setting stock:', err);
    }
  });
}

const asyncGet = promisify(client.get).bind(client);
/**
 * Get the current reserved stock by product ID.
 * @param {number} itemId - The ID of the product.
 * @returns {Promise<number>} The reserved stock quantity.
 */
async function getCurrentReservedStockById(itemId) {
  const stock = await asyncGet(itemId);
  return stock ? parseInt(stock, 10) : 0;
}

// Route handlers
/**
 * List all products.
 * @route GET /list_products/
 * @returns {Product[]} The list of products.
 */
app.get('/list_products/', (req, res) => {
  const transformedProducts = listProducts.map(product => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock
  }));
  res.json(transformedProducts);
});

/**
 * Get a product by ID.
 * @route GET /list_products/:itemId
 * @param {number} itemId - The ID of the product.
 * @returns {Product|{status: string}} The product or a status message if not found.
 */
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

/**
 * Reserve a product by ID.
 * @route GET /reserve_product/:itemId
 * @param {number} itemId - The ID of the product.
 * @returns {{status: string, itemId: number}} The reservation status and item ID.
 */
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
