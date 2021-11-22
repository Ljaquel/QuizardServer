const ObjectId = require('mongoose').Types.ObjectId;
const User = require("../../models/User");
const Quiz = require('../../models/Quiz');
//const Result = require('../../models/Result');
//const Badge = require('../../models/Badge');
const checkAuth = require('../../util/check-auth');
const cloudinary = require("../../util/cloudinary");

const userFieldsToPopulate = '_id name username'

module.exports = {
  SearchResult: {
    __resolveType(obj) {
      if (obj.username) return "User"
      if (obj.name) return "Quiz"
      return null
    },
  },
  Query: {
    getSearchResults: async (_, { query, searchFilter }, context) => {
      if(searchFilter === "") return []
      let results = [];
      let users = [];
      let quizzes = [];
      const $regex = new RegExp(query, "i");
      switch (searchFilter) {
        case "User":
          users = await User.find({
            $or: [{ username: $regex }, { name: $regex }],
          });
          results = users;
          break;
        case "Quiz":
          quizzes = await Quiz.find({ name: { $regex }, published: true })
            .populate({ path: 'creator', select: userFieldsToPopulate })
            .populate({ path: 'comments', populate: { path: 'user', select: userFieldsToPopulate }});
          results = quizzes;
          break;
        case "Tag":
          quizzes = await Quiz.find({
            tags: { $elemMatch: { $regex } }, published: true });
          results = quizzes;
          break;
        default:
          users = await User.find({
            $or: [{ username: $regex }, { name: $regex }],
          });
          quizzes = await Quiz.find({ name: { $regex } });
          results = [...users, ...quizzes];
          break;
      }
      return results;
    },
  },
  Mutation: {
    async updateImage(_, { type, _id, field, publicId, url }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(_id) }
        const value = { publicId, url }

        switch(type) {
          case "Quiz":
            const quiz = await Quiz.findById(filter._id);
            switch(field) {
              case "thumbnail":
                if (quiz.thumbnail && quiz.thumbnail.publicId !== "") {
                  const res = await cloudinary.v2.uploader.destroy(quiz.thumbnail.publicId);
                  if (res.result !== "ok") throw new Error();
                }
                await Quiz.findOneAndUpdate(filter, { $set: { thumbnail: value } }, { new: true });
                return true
              case "backgroundImage":
                if (quiz.backgroundImage && quiz.backgroundImage.publicId !== "") {
                  const res = await cloudinary.v2.uploader.destroy(quiz.backgroundImage.publicId);
                  if (res.result !== "ok") throw new Error();
                }
                await Quiz.findOneAndUpdate(filter, { $set: { backgroundImage: value } }, { new: true });
                return true
                default:
                  return false
            }
          case "User":
            const user = await User.findById(filter._id);
            switch(field) {
              case "avatar":
                if (user.avatar && user.avatar.publicId !== "") {
                  const res = await cloudinary.v2.uploader.destroy(user.avatar.publicId);
                  if (res.result !== "ok") throw new Error();
                }
                await User.findOneAndUpdate(filter, { $set: { avatar: value } }, { new: true });
                return true
                default:
                  return false
            }
          default:
            return false
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
