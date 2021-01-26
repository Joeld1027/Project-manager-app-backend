require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const {
	loginRequired
} = require('./middleware/auth');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/ticketRoute');
const commetRoutes = require('./routes/commentRoute');
const projectRoutes = require('./routes/projectRoute');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
};

app.use(allowCrossDomain);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', loginRequired, taskRoutes);
app.use('/api/comments', loginRequired, commetRoutes);
app.use('/api/projects', projectRoutes);

app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));