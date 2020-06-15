const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect(
	process.env.MONGODB_URI ||
		'mongodb://localhost/Project-Manager-App',
	{
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	() => console.log('DB connected')
);

module.exports.User = require('./user');
module.exports.Project = require('./project');
module.exports.Task = require('./ticket');
module.exports.Comment = require('./comment');
