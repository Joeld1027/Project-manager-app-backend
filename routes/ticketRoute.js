const express = require('express');
const router = express.Router();
const { Ticket, Project, User } = require('../models');

// get all the tickets
router.get('/', async (req, res, next) => {
	try {
		const foundTickets = await Ticket.find()
			.populate('assignedProject')
			.exec();

		if (foundTickets) {
			// const tickets = {
			// 	tickets: foundTickets.map((ticket) => {
			// 		return {
			// 			id: ticket._id,
			// 			name: ticket.name,
			// 			description: ticket.description,
			// 			createdDate: ticket.createdDate,
			// 			assignedProject: ticket.assignedProject,
			// 			assignedDevs: ticket.assignedDevs,
			// 			category: ticket.category,
			// 			status: ticket.status,
			// 			priority: ticket.priority,
			// 		};
			// 	}),
			// };
			return res.status(200).json(foundTickets);
		}
		next();
	} catch (err) {
		return next({ message: err.message });
	}
});

router.post('/', async (req, res, next) => {
	try {
		const newTask = new Ticket({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			priority: req.body.priority,
			createdBy: req.body.createdBy,
			assignedProject: req.body.project,
		});
		await newTask.save();
		if (newTask) {
			projectToAdd = await Project.findById(req.body.project);
			if (projectToAdd) {
				await projectToAdd.projectTickets.push(newTicket._id);
				await projectToAdd.save();

				newTask.status = 'In Progress';
				await newTask.save();
			}
			return res.status(200).json(newTask);
		}
		return next();
	} catch (err) {
		return next(err);
	}
});

router.get('/:taskId', async (req, res, next) => {
	try {
		const foundTicket = await (
			await Ticket.findById(req.params.taskId).populate(
				'assignedProject'
			)
		).execPopulate();
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

router.put('/:taskId', async (req, res, next) => {
	try {
		const updatedTicket = await Ticket.findOneAndUpdate(
			{ _id: req.params.taskId },
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

router.delete('/:taskId', async (req, res, next) => {
	try {
		const deletedTicket = await Ticket.findByIdAndDelete({
			_id: req.params.taskId,
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
