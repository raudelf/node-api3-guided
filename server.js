const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const app = express();

// Built-in Middleware
app.use(express.json());

// 3rd-Party
app.use(helmet());
// app.use(morgan('dev'));

// Custom Middleware
app.use(methodLogger);
app.use(addName);
// app.use(lockout);
// app.use(oddLockout);

app.use('/api/hubs', hubsRouter);

app.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
};

function addName(req, res, next) {
  req.name = req.name || 'Raudel';
  next();
};

function lockout(req, res, next) {
  res.status(403).json({ message: 'API Lockout in Force.'});
};

function oddLockout(req, res, next) {
  const d = new Date().getSeconds();
  console.log(d);
  if (d % 2 !== 0) {
    res
    .status(403)
    .json({ message: 'Even Stevens only'});
  } else {
    next();
  };
};

// Error Handler must always be last!
// But MUST BE FIRST IN PARAMS
// 4 Params Tells Express its an error/middleware handler
app.use((error, req, res, next) => {
  res.status(400).json({ message: 'ERROR!', error});
});

module.exports = app;