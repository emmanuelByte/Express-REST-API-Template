const express = require('express');
const userRouter = require('./user.routes');

const router = express.Router();

router.use('/user', userRouter);
router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

module.exports = router;

// ROUTES > CONTROLLERS > MODELS > SCHEMA;
