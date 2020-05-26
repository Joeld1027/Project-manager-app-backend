const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	name: String,
	description: String,
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	asignedDevs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	createdDate: {
		type: Date,
		default: Date.now,
	},
	category: String,
	priority: String,
	status: {
		type: String,
		default: 'New',
	},

	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comments',
		},
	],
	history: {
		updatedBy: String,
		updateInfo: String,
	},
	attachments: [],
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
