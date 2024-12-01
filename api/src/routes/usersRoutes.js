const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Definição do esquema do Mongoose para usuários
const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    user: String,
    pwd: String,
    level: String,
    status: String,
  }, { collection: 'users' }); // Corrigido: Opções do esquema
  const User = mongoose.model('Users', userSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Usuários:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: E-mail do usuário
 *         user:
 *           type: string
 *           description: Nome de identificação
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Perfil de acesso
 *         status:
 *           type: string
 *           description: Status atual
 *       example:
 *         nome: "Caio Hobold"
 *         email: "caio.hobold@nextfit.com.br"
 *         user: "caio.hobold"
 *         pwd: "password123"
 *         level: "admin"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: API para gerenciamento de usuários
 */

// Rotas CRUD

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Busca usuários pelo nome
 *     tags: [Usuários]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome ou parte do nome do usuário
 *     responses:
 *       200:
 *         description: Lista de usuários encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuários'
 *       400:
 *         description: Parâmetro "nome" ausente ou inválido
 *       404:
 *         description: Nenhum usuário encontrado
 */
router.get('/search', async (req, res) => {
    const { nome } = req.query;
  
    if (!nome) {
      return res.status(400).json({ error: 'Parâmetro "nome" é obrigatório.' });
    }
  
    try {
      const users = await User.find({
        nome: { $regex: nome, $options: 'i' }, // Busca case-insensitive
      });
  
      if (users.length === 0) {
        return res.status(404).json({ error: 'Nenhum usuário encontrado.' });
      }
  
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retorna todos os usuários
   *     tags: [Usuários]
   *     responses:
   *       200:
   *         description: Lista de usuários
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Usuários'
   */
  router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Retorna um usuário pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Dados do usuário
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Usuários'
   *       404:
   *         description: Usuário não encontrado
   */
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuários'
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuários'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
