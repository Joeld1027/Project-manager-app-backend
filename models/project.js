const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	projectName: String,
	description: String,
	asignedDevs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	priority: String,
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	deadline: {
		type: Date,
	},
	created: {
		type: Date,
		default: Date.now,
	},
	projectTickets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tickets',
		},
	],
});

const Projects = mongoose.model('Projects', projectSchema);

module.exports = Projects;
