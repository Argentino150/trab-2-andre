const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Definição do esquema de profissionais da saúde
const profissionalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    contact: { type: String, required: true },
    phone_number: { type: String, required: true },
    status: { type: String, required: true },
  },
  { collection: 'prof-saude' } // Certifique-se de que esta coleção realmente existe no MongoDB
);

// Modelo do Mongoose
const Profissional = mongoose.model('Profissional', profissionalSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Profissionais da Saúde:
 *       type: object
 *       required:
 *         - name
 *         - specialty
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         name:
 *           type: string
 *           description: Nome do profissional
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         contact:
 *           type: string
 *           description: Email de contato do profissional
 *         phone_number:
 *           type: string
 *           description: Telefone do profissional
 *         status:
 *           type: string
 *           description: Status (on/off)
 *       example:
 *         name: "Larissa Mendes"
 *         specialty: "Nutricionista"
 *         contact: "lm.nutri@gmail.com"
 *         phone_number: "48 9999 1234"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Profissionais da Saúde
 *   description: API para gerenciamento de profissionais da saúde
 */

// Rotas CRUD

/**
 * @swagger
 * /prof-saude/search:
 *   get:
 *     summary: Busca profissionais pelo nome
 *     tags: [Profissionais da Saúde]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome ou parte do nome do profissional
 *     responses:
 *       200:
 *         description: Lista de profissionais encontrados
 *       400:
 *         description: Parâmetro "name" ausente ou inválido
 *       404:
 *         description: Nenhum profissional encontrado
 */
router.get('/search', async (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res
        .status(400)
        .json({ error: 'Parâmetro "name" é obrigatório.' });
    }
  
    try {
      const profissionais = await Profissional.find({
        name: { $regex: name, $options: 'i' }, // Busca case-insensitive
      });
  
      if (profissionais.length === 0) {
        return res.status(404).json({ error: 'Nenhum profissional encontrado' });
      }
  
      res.status(200).json(profissionais);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

/**
 * @swagger
 * /prof-saude:
 *   get:
 *     summary: Retorna todos os profissionais de saúde
 *     tags: [Profissionais da Saúde]
 *     responses:
 *       200:
 *         description: Lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profissionais da Saúde'
 */
router.get('/', async (req, res) => {
    try {
      const profissionais = await Profissional.find();
      res.status(200).json(profissionais);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /prof-saude/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Profissionais da Saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Profissional encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissionais da Saúde'
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const profissional = await Profissional.findById(req.params.id);
    if (!profissional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }
    res.status(200).json(profissional);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * @swagger
 * /prof-saude:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Profissionais da Saúde]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissionais da Saúde'
 *     responses:
 *       201:
 *         description: Profissional criado
 */
router.post('/', async (req, res) => {
    try {
      console.log('Recebendo requisição:', req.body); // Log para verificar o corpo da requisição
      const newProfissional = new Profissional(req.body);
      await newProfissional.save();
      console.log('Profissional salvo:', newProfissional); // Log após salvar
      res.status(201).json(newProfissional);
    } catch (err) {
      console.error('Erro ao salvar profissional:', err.message);
      res.status(400).json({ error: err.message });
    }
  });
      

/**
 * @swagger
 * /prof-saude/{id}:
 *   put:
 *     summary: Atualiza um profissional pelo ID
 *     tags: [Profissionais da Saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissionais da Saúde'
 *     responses:
 *       200:
 *         description: Profissional atualizado
 *       404:
 *         description: Profissional não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedProfissional = await Profissional.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfissional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }
    res.status(200).json(updatedProfissional);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /prof-saude/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Profissionais da Saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       204:
 *         description: Profissional removido
 *       404:
 *         description: Profissional não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfissional = await Profissional.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProfissional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
