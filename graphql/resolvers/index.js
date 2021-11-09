const usersResolvers = require("./users");
const quizzesResolvers = require("./quizzes");

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
    getSearchResults: async (_, { query }, context) => {
      console.log(query);
      const $regex = new RegExp(query, "i");
      const users = await User.find({ username: { $regex } });
      console.log("users", users);
      const quizzes = await Quiz.find({ name: { $regex } });
      console.log("quizzes", quizzes);
      return [...users, ...quizzes];
    },
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...quizzesResolvers.Mutation,
  },
};
