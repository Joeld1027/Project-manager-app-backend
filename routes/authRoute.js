const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models');
const {
	createAccessToken,
	createRefreshToken,
} = require('../services/jwtLogic');

router.post('/signup', async function (req, res, next) {
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const user = new db.User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});
		const savedUser = await user.save();
		let accessToken = createAccessToken(savedUser);
		const { password, ...userInfo } = user._doc;
		return res
			.cookie('sid', createRefreshToken(user), { httpOnly: true })
			.status(200)
			.json({
				accessToken,
				userInfo,
			});
	} catch (err) {
		if (err.code === 11000) {
			err.message = 'Sorry, that username or email are already taken';
		}
		return next({
			status: 400,
			message: err.message,
		});
	}
});

router.post('/signin', async (req, res, next) => {
	try {
		let user = await db.User.findOne({
			email: req.body.email,
		});
		let isMatch = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (isMatch) {
			let accessToken = createAccessToken(user);

			const { password, ...userInfo } = user._doc;
			return res
				.cookie('sid', createRefreshToken(user), { httpOnly: true })
				.status(200)
				.json({
					userInfo,
					accessToken,
				});
		} else {
			return next({
				status: 400,
				message: 'Invalid Email/Password',
			});
		}
	} catch (err) {
		return next({
			status: 400,
			message: 'Invalid Email/Password',
		});
	}
});

//Get all users
router.get('/users', async (req, res, next) => {
	try {
		const allUsers = await db.User.find({});
		if (allUsers) {
			return res.status(200).json(allUsers);
		}
		next();
	} catch (err) {
		return next({
			message: err.message,
		});
	}
});

//Edit user
router.put('/edit/:userId', async (req, res, next) => {
	try {
		const editedUser = await db.User.findOneAndUpdate(
			{ _id: req.params.userId },
			req.body,
			{ new: true }
		);
		if (editedUser) {
			return res.status(200).json({
				message: 'User updated',
				editedUser,
			});
		}
		next();
	} catch (err) {
		next({
			message: err.message,
		});
	}
});

//Delete user
router.delete('/delete/:userId', async (req, res, next) => {
	try {
		const deletedUser = await db.User.findOneAndRemove({
			_id: req.params.userId,
		});
		if (deletedUser) {
			return res.status(200).json({ message: 'User deleted' });
		}
	} catch (err) {
		return next({
			message: err.message,
		});
	}
});

module.exports = router;
