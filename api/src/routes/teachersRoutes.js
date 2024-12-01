const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Definição do esquema de professores
const teacherSchema = new mongoose.Schema(
    {
      name: String,
      subject: String,
      phone_number: String,
      email: String,
      status: String,
    },
    { collection: 'teachers' } // Especifica a coleção
  );
  const Teacher = mongoose.model('Teacher', teacherSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Professores:
 *       type: object
 *       required:
 *         - name
 *         - subject
 *         - phone_number
 *         - email
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         name:
 *           type: string
 *           description: Nome do professor
 *         subject:
 *           type: string
 *           description: Matéria lecionada
 *         phone_number:
 *           type: string
 *           description: Telefone para contato
 *         email:
 *           type: string
 *           description: E-mail do professor
 *         status:
 *           type: string
 *           description: Status do professor (ativo/inativo)
 *       example:
 *         name: "Professor Xavier"
 *         subject: "Ciências"
 *         phone_number: "48 9999 1234"
 *         email: "xavier@escola.com"
 *         status: "ativo"
 */

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: API para gerenciamento de professores
 */

// Rotas CRUD

/**
 * @swagger
 * /teachers/search:
 *   get:
 *     summary: Busca professores por nome
 *     tags: [Professores]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome ou parte do nome do professor
 *     responses:
 *       200:
 *         description: Lista de professores encontrados
 *       400:
 *         description: Parâmetro "name" ausente ou inválido
 *       404:
 *         description: Nenhum professor encontrado
 */
router.get('/search', async (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ error: 'Parâmetro "name" é obrigatório.' });
    }
  
    try {
      const teachers = await Teacher.find({
        name: { $regex: name, $options: 'i' },
      });
  
      if (teachers.length === 0) {
        return res.status(404).json({ error: 'Nenhum professor encontrado.' });
      }
  
      res.status(200).json(teachers);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });



/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professores'
 */
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       404:
 *         description: Professor não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Professor não encontrado!' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       201:
 *         description: Professor criado
 */
router.post('/', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza os dados de um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       200:
 *         description: Professor atualizado
 *       404:
 *         description: Professor não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ error: 'Professor não encontrado!' });
    }
    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Remove um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ error: 'Professor não encontrado!' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
