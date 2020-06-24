const oauth2Server = require('@blue-cloud/oauth2-server');

const model = require('./model');

module.exports = oauth2Server({
  model,
  refreshTokenLifetime: 60 * 24 * 3600, // 60 days
  grants: [],
  debug: process.env.NODE_ENV !== 'production',
});
