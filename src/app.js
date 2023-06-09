const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');

const errorHandler = require('./middleware/errorHandler');
const { default: listEndpoints } = require('list_end_points');

const app = express();

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);
listEndpoints(app);
module.exports = app;
