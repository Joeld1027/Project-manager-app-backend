const express = require('express');
const router = express.Router();
const db = require('../models');

// get all the tickets
router.get('/', async (req, res, next) => {
	try {
		const foundTickets = await db.Ticket.find({});
		if (foundTickets) {
			return res.status(200).json(foundTickets);
		}
		return res.status(404).send('No Tickets found');
	} catch (err) {
		return next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const newTicket = new db.Ticket({
			ticketName: req.body.ticketName,
			description: req.body.description,
		});
		await newTicket.save();
		return res.status(200).json(newTicket);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
