const LoginRouterComposer = require('../composers/login-router-composer');
const { adapt } = require('../adapters/express-router-adapter');

module.exports = async (router) => {
  router.post('/login', adapt(LoginRouterComposer.compose()));
};
