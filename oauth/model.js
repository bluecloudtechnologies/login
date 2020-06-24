const debug = require('debug');
const jwt = require('jsonwebtoken');

const log = debug('login/oauth/model');
const service = require('./oauth.service');

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
};

const oAuthModel = {
  getAccessToken(bearerToken, callback) {
    log('getAccessToken', JSON.stringify(bearerToken));

    try {
      const userPromise = (new Promise((resolve, reject) =>{
        if (process.env.LOGIN_JWT === 'true') {
          resolve(jwt.verify(bearerToken, process.env.LOGIN_SECRET));
        } else {
          service
              .getToken(bearerToken, true)
              .then(resolve)
              .catch(reject);
        }
      }));

      return userPromise
          .then((user) => {
            return callback(null, user)
          })
          .catch(err => {
            // hack due to node-oauth2-server need expiry time to bypass
            // check oauth/authenticate.js
            // Todo: Danger
            return (err && err.response && err.response.body)
                ?  callback(null, Object.assign(err.response.body, { expires:  (new Date()).addHours(1)  }))
                : callback(err)
          });
    } catch (err) {
      return callback(err, { access_token: bearerToken });
    }
  },
};

module.exports = oAuthModel;
