const debug = require('debug');

const oAuth = require('./');

const log = debug('omnilogin/oauth/authenticate');

// - next will get argument only if error occurs
// - https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
const _next = (req, res, next) => {
  return (err) => {
    log('Intercepting next', req.oauth.bearerToken.code);
    if (req.oauth.bearerToken.code) {
      return res
          .status(req.oauth.bearerToken.code)
          .json(req.oauth.bearerToken)
    }
    log('Intercepting next', { err, u: req.user });
    next();
  }
};

module.exports = () => (req, res, next) => {
  if (req.user) return next();
  return oAuth.authorise()(req, res, _next(req, res, next));
};
