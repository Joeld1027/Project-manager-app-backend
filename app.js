require('dotenv').config();
const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');

// Routes
const authRoutes = require('./routes/authRoute');

const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
// router.use(function timeLog(req, res, next) {
// 	console.log('Time: ', Date.now());
// 	next();
// });

app.use('/api/auth', authRoutes);

app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
