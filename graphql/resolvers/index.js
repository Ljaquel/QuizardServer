const notesResolvers = require('./notes')
const usersResolvers = require('./users')
const quizzesResolvers = require('./quizzes')

module.exports = {
    Query: {
        ...notesResolvers.Query,
        ...usersResolvers.Query,
        ...quizzesResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...notesResolvers.Mutation,
        ...quizzesResolvers.Mutation
    }
}