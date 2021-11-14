const express = require('express');

const api = express.Router();

const usersRouter = require('./users');
const defectsRouter = require('./defects');

api.use('/users', usersRouter);
api.use('/defects', defectsRouter);

module.exports = api;
