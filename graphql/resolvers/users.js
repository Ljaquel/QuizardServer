const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    getUser: async (_, { userId }, context) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User does not exist");
        return user;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      console.log("Logging in...");
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        _id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      console.log("Signing in...");
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        _id: res._id,
        token,
      };
    },
    changePassword: async (
      _,
      { currentPassword, newPassword, confirmPassword },
      context
    ) => {
      const user = checkAuth(context);
      const dbUser = await User.findById(user._id);
      if (!dbUser) throw new AuthenticationError("You are not a valid user");
      try {
        if (!user) return false;
        const match = await bcrypt.compare(currentPassword, dbUser.password);
        if (match && newPassword === confirmPassword) {
          const password = await bcrypt.hash(newPassword, 10);
          await User.findByIdAndUpdate(user._id, { password });
          return true;
        }
      } catch (err) {
        return false;
      }
    },
    updateUserFields: async (_, { updateFields }, context) => {
      const user = checkAuth(context);
      const { _id } = user;
      try {
        if (!user) throw new AuthenticationError("You are not authenticated");
        const updatedUser = await User.findOneAndUpdate(
          { _id },
          {
            ...updateFields,
          },
          { new: true, returnOriginal: false }
        );
        console.log(updatedUser);
        const token = generateToken(updatedUser);
        return {
          ...updatedUser._doc,
          _id: updatedUser._id,
          token,
        };
      } catch (error) {
        console.log(error);
        throw new Error("There was an error updating the fields");
      }
    },
  },
};
