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
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	deadline: {
		type: Date,
		default: 'empty',
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
