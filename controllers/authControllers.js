const { BadRequestError } = require("../errors");
const User = require("../models/User");

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Enter valid email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }

  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new BadRequestError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(200).json({ token, userID: user._id });
};

const registerController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Enter valid email and password");
    // return res.status(400).json({ msg: "Enter valid email and password" });
  }
  try {
    const user = await User.create({ email, password });
    const token = user.createJWT();
    res.status(200).json({ token, userID: user._id });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { loginController, registerController };
