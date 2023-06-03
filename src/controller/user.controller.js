const User = require('../model/User.model');
const bcrypt = require('bcryptjs');
const register = async (req, res) => {
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
    const oldUser = await User.findOne({ email });
    const hashPassword = bcrypt.hashSync(password);
    if (oldUser?.email)
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
};

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
    const registeredUser = await User.findOne({ email });
    if (!registeredUser?.email)
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
        statusCode: 400,
      });

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      registeredUser.password
    );
    // console.log({ password, passwordFromDb: registeredUser.password });
    if (!isPasswordCorrect)
      return res.status(400).json({
        success: false,
        message: 'incorrect password',
        statusCode: 400,
      });
    return res.status(201).json({
      status: true,
      message: 'User login successfully',
      statusCode: 200,
      data: registeredUser,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
};
