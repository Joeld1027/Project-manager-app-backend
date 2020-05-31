const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	name: String,
	description: String,
	asignedDevs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	priority: String,
	createdBy: String,
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
			ref: 'Ticket',
		},
	],
});

const Projects = mongoose.model('Projects', projectSchema);

module.exports = Projects;
