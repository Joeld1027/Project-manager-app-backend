const { sign } = require('jsonwebtoken');

const createAccessToken = (userInfo) => {
	return sign(userInfo, process.env.SECRET_KEY, {
		expiresIn: '30m',
	});
};

module.exports.createAccessToken = createAccessToken;
