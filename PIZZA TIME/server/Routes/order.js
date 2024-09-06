const Controllers = require('../Controllers/order');

module.exports = (app) => {
  app.post('/api/order/create', Controllers.createOrder);
  app.get('/api/order/count', Controllers.getOrderCount);
  app.get('/api/order/all', Controllers.getAllOrders);
  app.post('/api/order/favorite/:userId', Controllers.favoriteOrder);
  app.get('/api/order/:id/favoriteOrders', Controllers.getFavoriteOrders);
  app.get('/api/order/:id', Controllers.getOrderById);
  app.put('/api/order/updateFavoriteStatus', Controllers.updateFavoriteStatus);
  
};
