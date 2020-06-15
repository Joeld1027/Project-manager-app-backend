require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const { loginRequired } = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/ticketRoute');
const commetRoutes = require('./routes/commentRoute');
const projectRoutes = require('./routes/projectRoute');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', loginRequired, userRoutes);
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
