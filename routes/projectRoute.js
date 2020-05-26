const express = require('express');
const router = express.Router();
const { Project } = require('../models');

// find all projects
router.get('/', async (req, res, next) => {
	try {
		const foundProjects = await Project.find();
		if (foundProjects) {
			const projects = {
				count: foundProjects.length,
				projects: foundProjects.map((project) => {
					return {
						id: project._id,
						name: project.projectName,
						description: project.description,
						assignedDev: project.asignedDevs,
						createdBy: project.createdBy,
						deadline: project.deadline,
						createdDate: new Date(project.created).toDateString(),
						priority: project.priority,
						tickets: project.projectTickets,
						request: {
							type: 'GET',
							url: `http://localhost:5000/api/projects/${project._id}`,
						},
					};
				}),
			};
			return res.status(200).json(projects);
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
			projectName: req.body.name,
			description: req.body.description,
			priority: req.body.priority,
			asignedDevs: req.body.developers,
		});
		await newProject.save();
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
