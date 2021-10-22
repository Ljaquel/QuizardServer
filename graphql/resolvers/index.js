
const usersResolvers = require('./users')
const quizzesResolvers = require('./quizzes')

module.exports = {
    Query: {
  
        ...usersResolvers.Query,
        ...quizzesResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...quizzesResolvers.Mutation
    }
}