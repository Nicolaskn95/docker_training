require('dotenv').config();
const express = require('express');
const { Pool } = require("pg");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;

const initializeDatabase = async () => {
  const adminClient = new Pool({
    host: process.env.POSTGRES_HOST,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  });

  try {
    await adminClient.query(`CREATE DATABASE "${process.env.POSTGRES_DB}"`);
    console.log(`Banco ${process.env.POSTGRES_DB} criado!`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`Banco ${process.env.POSTGRES_DB} já existe`);
    } else {
      console.error('Erro ao criar banco:', err);
      throw err;
    }
  } finally {
    await adminClient.end();
  }

  db = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )`);
  console.log('Tabela users verificada/criada!');
};

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'CRUD de usuários com PostgreSQL'
    }
  },
  apis: ['server.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results.rows);
  });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 */
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
    [name, email], 
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(result.rows[0]);
    }
  );
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3', 
    [name, email, req.params.id], 
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ id: req.params.id, name, email });
    }
  );
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário removido
 */
app.delete('/users/:id', (req, res) => {
  db.query(
    'DELETE FROM users WHERE id = $1', 
    [req.params.id], 
    (err) => {
      if (err) return res.status(500).send(err);
      res.status(204).send();
    }
  );
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:5200`);
      console.log(`Swagger em http://localhost:5200/swagger`);
    });
  } catch (err) {
    console.error('Falha na inicialização:', err);
    process.exit(1);
  }
};

startServer();