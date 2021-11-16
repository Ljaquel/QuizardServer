const usersResolvers = require("./users");
const quizzesResolvers = require("./quizzes");
const globalResolvers = require("./global");
const resultsResolvers = require("./results");
const badgesResolvers = require("./badges");
const User = require("../../models/User");
const Quiz = require('../../models/Quiz');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...quizzesResolvers.Query,
    ...globalResolvers.Query,
    ...resultsResolvers.Query,
    ...badgesResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...quizzesResolvers.Mutation,
    ...globalResolvers.Mutation,
    ...resultsResolvers.Mutation,
    ...badgesResolvers.Mutation,
  },
  SearchResult: globalResolvers.SearchResult,
};
