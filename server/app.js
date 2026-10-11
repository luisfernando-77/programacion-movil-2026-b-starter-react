/**
 * API de productos (Express).
 *
 * `createApp()` construye y devuelve la aplicación SIN ponerla a escuchar:
 *  - `server/index.js` la pone a escuchar en el puerto 3000 (`npm run server`);
 *  - las pruebas la levantan con `app.listen(0)` (puerto libre).
 *
 * Contrato:
 *   GET    /api/products?search=&category=   200 + arreglo
 *   GET    /api/products/:id                 200 | 400 | 404
 *   POST   /api/products                     201 | 400
 *   PUT    /api/products/:id                 200 | 400 | 404
 *   DELETE /api/products/:id                 204 | 400 | 404
 *
 * Formato de error uniforme:
 * { "error": "mensaje", "details": ["..."] }
 */

const express = require('express');
const cors = require('cors');
const seedProducts = require('./data/products.json');

const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'];

function parseId(rawId) {
  return /^\d+$/.test(rawId) ? Number(rawId) : null;
}

function validateProduct(input) {
  const details = [];

  const { name, price, category, stock } = input ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    details.push('name es obligatorio');
  } else if (name.trim().length > 60) {
    details.push('name debe tener máximo 60 caracteres');
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    details.push('price debe ser un número mayor que 0');
  }

  if (typeof category !== 'string' || !CATEGORIES.includes(category)) {
    details.push('category debe ser una categoría válida');
  }

  if (!Number.isInteger(stock) || stock < 0) {
    details.push('stock debe ser un entero mayor o igual que 0');
  }

  return details;
}

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    }),
  );

  app.use(express.json());

  const products = seedProducts.map((item) => ({ ...item }));

  let nextId =
    products.length > 0
      ? Math.max(...products.map((product) => product.id)) + 1
      : 1;

  app.get('/api/products', (req, res) => {
    const { search, category } = req.query;

    let result = [...products];

    if (typeof search === 'string' && search.trim() !== '') {
      const text = search.trim().toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(text),
      );
    }

    if (typeof category === 'string' && category !== '') {
      result = result.filter((product) => product.category === category);
    }

    return res.status(200).json(result);
  });

  app.get('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Id inválido',
        details: ['El id debe ser numérico'],
      });
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    return res.status(200).json(product);
  });

  app.post('/api/products', (req, res) => {
    const details = validateProduct(req.body);

    if (details.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details,
      });
    }

    const product = {
      id: nextId,
      name: req.body.name.trim(),
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    };

    nextId += 1;
    products.push(product);

    return res.status(201).json(product);
  });

  app.put('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Id inválido',
        details: ['El id debe ser numérico'],
      });
    }

    const index = products.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    const details = validateProduct(req.body);

    if (details.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details,
      });
    }

    const updatedProduct = {
      id,
      name: req.body.name.trim(),
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    };

    products[index] = updatedProduct;

    return res.status(200).json(updatedProduct);
  });

  app.delete('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Id inválido',
        details: ['El id debe ser numérico'],
      });
    }

    const index = products.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    products.splice(index, 1);

    return res.status(204).end();
  });

  app.use((req, res) => {
    res.status(404).json({
      error: 'Ruta no encontrada',
      details: [`${req.method} ${req.originalUrl}`],
    });
  });

  // eslint-disable-next-line no-unused-vars -- Express exige los 4 parámetros para reconocerlo.
  app.use((err, _req, res, _next) => {
    if (err && err.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: 'El cuerpo no es un JSON válido',
        details: [],
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Error interno del servidor',
      details: [],
    });
  });

  return app;
}

module.exports = {
  createApp,
  CATEGORIES,
  parseId,
};