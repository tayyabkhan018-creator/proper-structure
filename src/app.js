const express = require('express');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

/**
 *  app.js
 * ------------------------------------------------------------
 *  Builds and configures the Express app. Kept separate from
 *  server.js so the app can be imported and tested (e.g. with
 *  supertest) without actually binding to a port
 */

const app = express();

app.use(express.json());
app.use(express.static('public'));

// All API routes live under /api
app.use('/api', routes);

// Unknown route -> 404
app.use(notFoundHandler);

// Central error handler - must be registered last
app.use(errorHandler);

module.exports = app;
