const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	profileImageUrl: {
		type: String,
	},
	department: {
		type: String,
	},
	position: {
		type: String,
	},
	role: [
		{
			roles: {
				user: {},
				developer: {},
				manager: {},
				admin: {},
			},
		},
	],
	address: {
		type: String,
	},
	phoneNumber: {
		type: Number,
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
