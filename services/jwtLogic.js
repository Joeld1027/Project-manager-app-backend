const { sign } = require('jsonwebtoken');

const createAccessToken = ({ id, email }) => {
	return sign({ id, email }, process.env.SECRET_KEY, {
		expiresIn: '15m',
	});
};

const createRefreshToken = ({ id, email }) => {
	return sign({ id, email }, process.env.REFRESH_TOKEN, {
		expiresIn: '1d',
	});
};

module.exports.createAccessToken = createAccessToken;
module.exports.createRefreshToken = createRefreshToken;
