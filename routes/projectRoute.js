const express = require('express');
const router = express.Router();
const { Project, User, Ticket } = require('../models');

// find all projects
router.get('/', async (req, res, next) => {
	try {
		const foundProjects = await Project.find()
			.populate('projectTickets')
			.populate('assignedDevs')
			.exec();
		if (foundProjects) {
			return res.status(200).json(foundProjects);
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
		});
	}
});

//create new project
router.post('/', async (req, res, next) => {
	try {
		const devId = req.body.developers;
		const taskId = req.body.tasks;
		const newProject = new Project({
			name: req.body.name,
			description: req.body.description,
			priority: req.body.priority,
			deadline: req.body.deadline,
			createdBy: req.body.createdBy,
		});

		if (req.body.developers) {
			for (i = 0; i < devId.length; i++) {
				let user = await User.findById(devId[i]);
				await newProject.assignedDevs.push(user._id);
				await user.assignedProjects.push(newProject._id);
				await user.save();
				await newProject.save();
			}

			if (req.body.tasks) {
				for (i = 0; i < taskId.length; i++) {
					const task = await Ticket.findById(taskId[i]);
					await newProject.projectTickets.push(task._id);
					await task.assignedProject.push(newProject._id);
					task.set({ status: 'In Progress' });
					await task.save();
					await newProject.save();
				}
			}
			await newProject.save();

			if (newProject) {
				return res.status(201).json(newProject);
			}
		}
		next();
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

// read - update - delete individual projects
router.get('/:projectId', async (req, res, next) => {
	try {
		const foundProject = await Project.findById(req.params.projectId);
		if (foundProject) {
			let foundWithUsers = await foundProject
				.populate('asignedDevs', ['firstName', 'lastName', 'role'])
				.populate('projectTickets')
				.execPopulate();

			return res.status(200).json(foundProject);
		}
		next();
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

router.patch('/:projectId', async (req, res, next) => {
	try {
		const updatedProject = await Project.findByIdAndUpdate(
			req.params.projectId,
			req.body,
			{ new: true, omitUndefined: true }
		);
		await updatedProject.save();
		updatedProject ? res.status(201).json(updatedProject) : next();
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

router.delete('/:projectId', async (req, res, next) => {
	try {
		const deletedProject = await Project.findById(
			req.params.projectId
		);

		if (deletedProject.projectTickets > 0) {
			const tasks = deletedProject.projectTickets;
			for (i = 0; i < tasks.length; i++) {
				const task = await Ticket.findById(tasks[i]);
				await task.remove();
			}
		}
		if (deletedProject.assignedDevs) {
			const users = deletedProject.assignedDevs;
			for (i = 0; i < users.length; i++) {
				const user = await User.findById(users[i]);
				await user.update({
					$pull: { assignedProjects: deletedProject._id },
				});
				await user.save();
			}
		}
		if (deletedProject) {
			await deletedProject.remove();
			return res.status(200);
		}

		next();
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

module.exports = router;
