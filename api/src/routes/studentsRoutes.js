const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema(
    {
      name: String,
      age: String,
      parents: String,
      phone_number: String,
      special_needs: String,
      status: { type: String, default: "on" },
    },
    { collection: 'students' }
  );

  const Student = mongoose.model('Student', studentSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Estudante:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - parents
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         name:
 *           type: string
 *           description: Nome do estudante
 *         age:
 *           type: string
 *           description: Idade do estudante
 *         parents:
 *           type: string
 *           description: Pais ou responsáveis pelo estudante
 *         phone_number:
 *           type: string
 *           description: Número de telefone do responsável
 *         special_needs:
 *           type: string
 *           description: Necessidades especiais (opcional)
 *         status:
 *           type: string
 *           description: Status do estudante (ativo/inativo)
 *       example:
 *         name: "Bingo Heeler"
 *         age: "6"
 *         parents: "Bandit Heeler e Chilli Heeler"
 *         phone_number: "48 9696 5858"
 *         special_needs: "Síndrome de Down"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Estudantes
 *   description: API para gerenciamento de estudantes
 */

// Rotas CRUD

/**
 * @swagger
 * /students/search:
 *   get:
 *     summary: Busca estudantes por nome
 *     tags: [Estudantes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome ou parte do nome do estudante
 *     responses:
 *       200:
 *         description: Lista de estudantes encontrados
 *       400:
 *         description: Parâmetro "name" ausente ou inválido
 *       404:
 *         description: Nenhum estudante encontrado
 */
router.get('/search', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Parâmetro "name" é obrigatório.' });
  }

  try {
    const students = await Student.find({
      name: { $regex: name, $options: 'i' },
    });

    if (students.length === 0) {
      return res.status(404).json({ error: 'Nenhum estudante encontrado.' });
    }

    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna todos os estudantes
 *     tags: [Estudantes]
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estudante'
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Estudantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Dados do estudante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudante'
 *       404:
 *         description: Estudante não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Estudante não encontrado!' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Estudantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudante'
 *     responses:
 *       201:
 *         description: Estudante criado
 */
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante
 *     tags: [Estudantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudante'
 *     responses:
 *       200:
 *         description: Estudante atualizado
 *       404:
 *         description: Estudante não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Estudante não encontrado!' });
    }
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante
 *     tags: [Estudantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       204:
 *         description: Estudante removido
 *       404:
 *         description: Estudante não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Estudante não encontrado!' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
