const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	projectName: String,
	description: String,
	asignedDevs: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	createdBy: String,
	projectTickets: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tickets',
	},
});

const Projects = mongoose.model('Projects', projectSchema);

module.exports = Projects;
