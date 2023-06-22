const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const sanitizer = require('perfect-express-sanitizer');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

//routes
const repairsRouter = require('./routes/repairs.routes');
const usersRouter = require('./routes/users.routes');

const app = express();
const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour',
});

// middlewares
app.use(helmet());
app.use(express.json()); //este middleware de aca me sirve para que mi servidor entienda formatos json que le estan llegando
app.use(cors());
app.use(hpp());
app.use(
  sanitizer.clean({
    xss: true,
    noSql: true,
    sql: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', limiter);

// rutas
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/repairs', repairsRouter);

// errores
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Cant find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);


module.exports = app;
