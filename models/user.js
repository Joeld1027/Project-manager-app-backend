const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'User',
	},
	userSince: {
		type: Date,
		default: Date.now,
	},
	ticketsCreated: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'Tickets' },
	],
	assignedTickets: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'Tickets' },
	],
	assignedProjects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Projects',
		},
	],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
