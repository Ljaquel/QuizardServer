const usersResolvers = require("./users");
const quizzesResolvers = require("./quizzes");
const globalResolvers = require("./global");
const resultsResolvers = require("./results");
const badgesResolvers = require("./badges");
const User = require("../../models/User");
const Quiz = require('../../models/Quiz');

module.exports = {
  SearchResult: {
    __resolveType(obj) {
      if (obj.username) return "User"
      if (obj.name) return "Quiz"
      return null
    },
  },
  Query: {
    ...usersResolvers.Query,
    ...quizzesResolvers.Query,
    ...globalResolvers.Query,
    ...resultsResolvers.Query,
    ...badgesResolvers.Query,
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
          break;
      }
      return results;
    },
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...quizzesResolvers.Mutation,
    ...globalResolvers.Mutation,
    ...resultsResolvers.Mutation,
    ...badgesResolvers.Mutation,
  },
  ...globalResolvers.SearchResult,
};
