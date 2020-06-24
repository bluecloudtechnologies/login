const rp = require('request-promise');

exports.getUserFromToken = (accessToken) => rp({
    uri: `${process.env.LOGIN_URL}/api/users/me?access_token=${accessToken}`,
    json: true,
});

exports.getToken = (accessToken) => rp({
    uri: `${process.env.LOGIN_URL}/api/users/token?access_token=${accessToken}`,
    json: true,
});
