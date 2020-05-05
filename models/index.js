const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect(
	'mongodb://localhost/Project-Manager-App',
	{
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	() => console.log('DB connected')
);

module.exports.User = require('./user');
