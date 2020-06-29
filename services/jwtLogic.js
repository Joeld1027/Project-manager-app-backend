const { sign } = require('jsonwebtoken');

const createAccessToken = (userInfo) => {
	return sign(userInfo, process.env.SECRET_KEY, {
		expiresIn: '30m',
	});
};

const createRefreshToken = ({ id, email }) => {
	return sign({ id, email }, process.env.REFRESH_TOKEN, {
		expiresIn: '1d',
	});
};

module.exports.createAccessToken = createAccessToken;
module.exports.createRefreshToken = createRefreshToken;
