import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const buildAuthResponse = (user) => {
  const token = generateToken({
    id: user._id,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      department: user.department,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt
    }
  };
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    const userExists = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (userExists) {
      res.status(400);
      return next(new Error("User with this email or mobile already exists"));
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: "user",
      department: ""
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      ...buildAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error("Email and password are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }

    if (user.isBlocked) {
      res.status(403);
      return next(new Error("Your account is blocked. Please contact support."));
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...buildAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

export const logoutUser = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};
