const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require('../../util/cloudinary');

const { validateRegisterInput, validateLoginInput } = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");

function generateToken(user) {
  return jwt.sign( { _id: user._id }, SECRET_KEY, { expiresIn: "2h" } );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  Query: {

    async getUsers(_, { name }) {
      try {
        // const users = await User.find({'name': name});
        const users = await User.find({'name': { $regex: escapeRegExp(name), $options: 'i' }});
        return users
      } catch(err){
        throw new Error(err);
      }
    },

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
      let result = {
        ...user._doc,
        ...user,
        token,
      }
      return result
    },
    async register(
      _,
      { registerInput: {name, username, email, password, confirmPassword } }
    ) {
      console.log("Signing in...");
      const { valid, errors } = validateRegisterInput(
        name,
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
        name,
        level: 1,
        points: 0,
        color: "black",
        avatar: "",
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      let result = {
        ...res._doc,
        ...res,
        token,
      }
      return result
    },
    changePassword: async (_, { newPassword, confirmPassword }, context) => {
      const user = checkAuth(context);
      try {
        if (!user) return false;
        if (newPassword === confirmPassword) {
          const password = await bcrypt.hash(newPassword, 10);
          await User.findByIdAndUpdate(user._id, { password });
          return true;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    updateUser: async (_, { fields }, context) => {
      const user = checkAuth(context);
      const _id = new ObjectId(user._id);
      try {
        if (!user) throw new AuthenticationError("You are not authenticated");
        const updatedUser = await User.findOneAndUpdate( { _id }, {$set: fields}, { new: true, returnOriginal: false });
        const token = generateToken(updatedUser);
        return { ...updatedUser._doc, _id: updatedUser._id, token };
      } catch (error) {
        console.log(error);
        throw new Error("There was an error updating the fields");
      }
    },
    async updateAvatar(_, { userId, value }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(userId) }
        const user = await User.findById(filter._id);
        if(user.avatar && user.avatar !== "") {
          const res = await cloudinary.v2.uploader.destroy(user.avatar)
          if(res.result !== 'ok') throw new Error
        }
        await User.findOneAndUpdate(filter, {$set: {avatar: value}}, { new: true });
        return true;
      }
      catch(err) {
        throw new Error(err);
      }
    },
  },
};
