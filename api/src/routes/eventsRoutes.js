const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



// Definição do esquema de eventos
const eventSchema = new mongoose.Schema(
    {
      description: String,
      comment: String,
      date: Date,
    },
    { collection: 'events' }
  );
  const Event = mongoose.model('Event', eventSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Eventos:
 *       type: object
 *       required:
 *         - description
 *         - comment
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         description:
 *           type: string
 *           description: Descrição do evento
 *         comment:
 *           type: string
 *           description: Comentário adicional sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *       example:
 *         description: "Evento Exemplo"
 *         comment: "Comentários sobre o evento"
 *         date: "2023-11-05T14:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: API para gerenciamento de eventos
 */

// Rotas CRUD

/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: Busca eventos por data
 *     tags: [Eventos]
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
 *         description: Lista de eventos encontrados
 *       400:
 *         description: Parâmetro "date" ausente ou inválido
 *       404:
 *         description: Nenhum evento encontrado
 */
router.get('/search', async (req, res) => {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({
        error: 'Parâmetro "date" é obrigatório no formato YYYY-MM-DD.',
      });
    }
  
    try {
      const events = await Event.find({
        date: {
          $gte: new Date(`${date}T00:00:00Z`),
          $lt: new Date(`${date}T23:59:59Z`),
        },
      });
  
      if (events.length === 0) {
        return res.status(404).json({ error: 'Nenhum evento encontrado' });
      }
  
      res.status(200).json(events);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Eventos'
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Eventos'
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Eventos'
 *     responses:
 *       201:
 *         description: Evento criado
 */
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Eventos'
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       404:
 *         description: Evento não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       204:
 *         description: Evento removido
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
