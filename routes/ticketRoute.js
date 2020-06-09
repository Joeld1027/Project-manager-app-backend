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
		});
		if (req.body.projectId) {
			await newTask.assignedProject.push(req.body.projectId);
			let projectToAdd = await Project.findById(req.body.projectId);
			if (projectToAdd) {
				await projectToAdd.projectTickets.push(newTask._id);
				await projectToAdd.save();
				newTask.status = 'In Progress';
			}
		}
		await newTask.save();
		if (newTask) {
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

router.patch('/:taskId', async (req, res, next) => {
	try {
		const updatedTicket = await Ticket.findOneAndUpdate(
			{ _id: req.params.taskId },
			req.body,
			{ new: true, omitUndefined: true }
		);
		if (req.body.projectId) {
			const project = await Project.findById(req.body.projectId);
			await project.projectTickets.push(updatedTicket._id);
			await updatedTicket.assignedProject.push(req.body.projectId);
			updatedTicket.status = 'In Progress';
			await project.save();
		}
		if (updatedTicket) {
			await updatedTicket.save();
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
		const deletedTicket = await Ticket.findByIdAndDelete(
			req.params.taskId
		);
		if (deletedTicket) {
			return res.status(200).json(deletedTicket);
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
			ok: false,
		});
	}
});

module.exports = router;
