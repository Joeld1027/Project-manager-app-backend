const express = require('express');
const router = express.Router();
const { Project, User, Ticket } = require('../models');

// find all projects
router.get('/', async (req, res, next) => {
	try {
		const foundProjects = await Project.find();
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
		await newProject.save();
		for (i = 0; i < devId.length; i++) {
			let user = await User.findById(devId[i]);
			let assigned = await newProject.asignedDevs.push(user._id);
			let projectassigned = await user.assignedProjects.push(
				newProject._id
			);
			let saved = await user.save();
			let savedproject = await newProject.save();
			let allDone = Promise.all([
				assigned,
				projectassigned,
				saved,
				savedproject,
			]).then((values) => console.log(values));
		}
		for (i = 0; i < taskId.length; i++) {
			const task = await Ticket.findById(taskId[i]);
			await newProject.projectTickets.push(task._id);
			await task.assignedProject.push(newProject._id);
			task.set({ status: 'In Progress' });
			await task.save();
			await newProject.save();
		}
		if (newProject) {
			return res.status(201).json(newProject);
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

router.put('/:projectId', async (req, res, next) => {
	try {
		const updatedProject = await Project.findByIdAndUpdate(
			{ _id: req.params.projectId },
			req.body,
			{ new: true }
		);
		updatedProject ? res.status(201).json(updatedProject) : next();
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

router.delete('/:projectId', async (req, res, next) => {
	try {
		const deletedProject = await Project.findByIdAndDelete({
			_id: req.params.projectId,
		});
		if (deletedProject) {
			return res.json({
				message: 'Project deleted',
			});
		}
		next();
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

module.exports = router;
