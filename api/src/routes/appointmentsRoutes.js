const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');


// Definição do esquema de agendamentos
const appointmentSchema = new mongoose.Schema(
    {
      specialty: String,
      comments: String,
      date: Date,
      student: String,
      professional: String,
    },
    { collection: 'appointments' }
  );
  const Appointment = mongoose.model('Appointment', appointmentSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento em saúde:
 *       type: object
 *       required:
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         specialty:
 *           type: string
 *           description: Especialidade
 *         comments:
 *           type: string
 *           description: Comentários
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do agendamento
 *         student:
 *           type: string
 *           description: Nome do estudante
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         specialty: "Fisioterapeuta"
 *         comments: "Realizar sessão"
 *         date: "2023-08-15T16:00:00Z"
 *         student: "Bingo Heeler"
 *         professional: "Winton Blake"
 */

/**
 * @swagger
 * tags:
 *   name: Agendamento em saúde
 *   description: API para gerenciamento de agendamentos
 */

// Rotas CRUD

/**
 * @swagger
 * /appointments/search:
 *   get:
 *     summary: Busca agendamentos por data
 *     tags: [Agendamento em saúde]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de agendamentos encontrados para a data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agendamento em saúde'
 *       400:
 *         description: Parâmetro "date" ausente ou inválido
 *       404:
 *         description: Nenhum agendamento encontrado
 */
router.get('/search', async (req, res) => {
    const { date } = req.query;
  
    if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res
        .status(400)
        .json({ error: 'Parâmetro "date" é obrigatório no formato YYYY-MM-DD.' });
    }
  
    try {
      const appointments = await Appointment.find({
        date: {
          $gte: moment(date).startOf('day').toDate(),
          $lt: moment(date).endOf('day').toDate(),
        },
      });
  
      if (appointments.length === 0) {
        return res.status(404).json({ error: 'Nenhum agendamento encontrado' });
      }
  
      res.status(200).json(appointments);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna todos os agendamentos
 *     tags: [Agendamento em saúde]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agendamento em saúde'
 */
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Agendamento em saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento em saúde'
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamento em saúde]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agendamento em saúde'
 *     responses:
 *       201:
 *         description: Agendamento criado
 */
router.post('/', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Agendamento em saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agendamento em saúde'
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendamento em saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       204:
 *         description: Agendamento removido
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
