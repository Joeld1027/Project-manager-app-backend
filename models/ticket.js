const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	ticketName: String,
	description: String,
	createdBy: String,
	createdDate: {
		type: Date,
		default: Date.now,
	},
	ticketCategory: String,
	ticketPriority: String,
	ticketStatus: String,
	ticketComments: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comments',
	},
	updateHistory: {
		updatedBy: String,
		updateInfo: String,
	},
	attachments: [],
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
