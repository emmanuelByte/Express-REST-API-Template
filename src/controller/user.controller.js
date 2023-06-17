const bcrypt = require('bcryptjs');
const User = require('../model/User.model');
const jwt = require('jsonwebtoken');
async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email)
      return res.status(400).json({
        success: false,
        message: 'Email field is missing ',
        statusCode: 400,
      });
    if (!password)
      return res.status(400).json({
        success: false,
        message: 'Password field is missing',
        statusCode: 400,
      });
    if (!name)
      return res.status(400).json({
        success: false,
        message: 'name field is missing',
        statusCode: 400,
      });
    const oldUser = await User.findOne(
      { email }
      // { name: 0, email: 0 } // projection field
    ); // {email:"ema.com"} || null

    const hashPassword = bcrypt.hashSync(password);
    if (oldUser)
      return res.status(400).json({
        success: false,
        message: 'User already exist',
        statusCode: 400,
      });
    const user = await User.create({
      name,
      password: hashPassword,
      email,
      role: 'user',
      isVerified: false,
    });
    return res.status(201).json({
      status: true,
      message: 'User created successfully',
      statusCode: 201,
      data: user,
    });
  } catch (error) {
    throw error;
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)
      return res.status(400).json({
        success: false,
        message: 'Email field is missing ',
        statusCode: 400,
      });
    if (!password)
      return res.status(400).json({
        success: false,
        message: 'Password field is missing',
        statusCode: 400,
      });
    const registeredUser = await User.findOne({ email }); // {email,password,name} || null

    if (!registeredUser)
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
        statusCode: 400,
      });

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      registeredUser.password
    ); //true if it is the same or false
    // console.log({ password, passwordFromDb: registeredUser.password });
    if (!isPasswordCorrect)
      return res.status(400).json({
        success: false,
        message: 'incorrect password',
        statusCode: 400,
      });
    const token = generateToken(registeredUser);
    return res.status(201).json({
      status: true,
      message: 'User login successfully',
      statusCode: 200,
      data: {
        token,
      },
    });
  } catch (error) {
    throw error;
  }
};

const profile = async (req, res) => {
  try {
    const user = req.user;

    return res.status(201).json({
      status: true,
      message: 'User Profile fetched successfully',
      statusCode: 200,
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw error;
  }
};

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user._id.toString(),
    },
    'sjskjsksjkj',
    {
      expiresIn: '1h',
    }
  );
  return token;
}

function verifyToken(token) {
  const payload = jwt.verify(token, 'sjskjsksjkj');
  return payload;
}

module.exports = {
  register,
  login,
  profile,
  verifyToken,
};
