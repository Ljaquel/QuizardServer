const usersResolvers = require("./users");
const quizzesResolvers = require("./quizzes");
const User = require("../../models/User");
const Quiz = require("../../models/Quiz");

module.exports = {
  SearchResult: {
    __resolveType(obj, context, info) {
      // Only User has a name field
      if (obj.username) {
        return "User";
      }
      // Only Quiz has a name field
      if (obj.name) {
        return "Quiz";
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    ...usersResolvers.Query,
    ...quizzesResolvers.Query,
    getSearchResults: async (_, { query, searchFilter }, context) => {
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
          quizzes = await Quiz.find({ name: { $regex }, published: true });
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
      } 
      return results;
    },
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...quizzesResolvers.Mutation,
  },
};
