const express = require('express');
const router = express.Router();
const { Project } = require('../models');

// find all projects
router.get('/', async (req, res, next) => {
	try {
		const foundProjects = await Project.find({});
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
		const newProject = new Project({
			projectName: req.body.projectName,
			description: req.body.description,
		});
		await newProject.save();
		if (newProject) {
			return res.status(200).json(newProject);
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
		});
	}
});

// read - update - delete individual projects
router.get('/:projectId', async (req, res, next) => {
	try {
		const foundProject = await Project.findById(req.params.projectId);
		if (foundProject) {
			return res.status(200).json(foundProject);
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
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
		if (updatedProject) {
			return res.status(200).json(updatedProject);
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
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
				ok: true,
			});
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
		});
	}
});

module.exports = router;
