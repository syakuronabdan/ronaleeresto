const express = require('express');

const routes = express.Router();

routes.get('/status', (req, res) => res.status(200).json({ status: 'ok' }));

module.exports = routes;
