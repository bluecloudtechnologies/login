const debug = require('debug');
const rp = require('request-promise');

const authenticate = require('./oauth/authenticate');
const oAuth = require('./oauth');
const service = require('./oauth/oauth.service');

const log = debug('login/index');
// console.log('callback', process.env.LOGIN_URL);

exports.oAuth = oAuth;
exports.authenticate = authenticate;

exports.callback = ({ client_id, client_secret, redirect_uri }) => async (req, res, next) => {
  try {
    const response = await rp({
      method: 'POST',
      uri: `${process.env.LOGIN_URL}/oauth/token`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: {
        grant_type: 'authorization_code',
        redirect_uri,
        client_id,
        client_secret,
        code: req.query.code,
      },
      json: true,
    });

    const user = await service.getUserFromToken(response.access_token)

    return { tokens: response, user };
  } catch (err) {
    return res.status(500).json(err)
  }
};

