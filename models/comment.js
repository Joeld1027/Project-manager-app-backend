const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	comment: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	createdDate: {
		type: Date,
		default: Date.now,
	},
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
