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
		return res.status(404).json({ message: 'No Tickets found' });
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

router.get('/:ticketId', async (req, res, next) => {
	try {
		const foundTicket = await db.Ticket.findById(req.params.ticketId);
		if (foundTicket) {
			return res.status(200).json(foundTicket);
		}
		return res.status(404).json({
			message: 'No ticket found',
		});
	} catch (err) {
		return next(err);
	}
});

router.put('/:ticketId', async (req, res, next) => {
	try {
		const updatedTicket = await db.Ticket.findOneAndUpdate(
			{ _id: req.params.ticketId },
			req.body,
			{ new: true }
		);
		if (updatedTicket) {
			return res.status(200).json(updatedTicket);
		}
		return res.status(404).json({
			message: 'Ticket not found',
		});
	} catch (err) {
		return next(err);
	}
});

router.delete('/:ticketId', async (req, res, next) => {
	try {
		const deletedTicket = await db.Ticket.findByIdAndDelete({
			_id: req.params.ticketId,
		});
		if (deletedTicket) {
			return res.json({
				message: 'Ticket deleted',
				ok: true,
			});
		}
		return next();
	} catch (err) {
		return next({
			message: err.message,
			ok: false,
		});
	}
});

module.exports = router;
