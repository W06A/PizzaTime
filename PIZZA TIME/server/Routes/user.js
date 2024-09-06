const Controllers = require('../Controllers/user');

module.exports = (app) => {
  app.post('/api/user/register',Controllers.register);
  app.post('/api/user/login',Controllers.login);
  app.get('/api/user/:userId', Controllers.getUserById);
  app.put('/api/user/:userId/update', Controllers.updateUserByID);
  };
