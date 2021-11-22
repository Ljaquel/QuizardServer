const usersResolvers = require("./users");
const platformsResolvers = require("./platforms");
const quizzesResolvers = require("./quizzes");
const globalResolvers = require("./global");
const resultsResolvers = require("./results");
const badgesResolvers = require("./badges");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...platformsResolvers.Query,
    ...quizzesResolvers.Query,
    ...globalResolvers.Query,
    ...resultsResolvers.Query,
    ...badgesResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...platformsResolvers.Mutation,
    ...quizzesResolvers.Mutation,
    ...globalResolvers.Mutation,
    ...resultsResolvers.Mutation,
    ...badgesResolvers.Mutation,
  },
  SearchResult: globalResolvers.SearchResult,
};
