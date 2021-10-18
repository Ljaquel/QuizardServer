const notesResolvers = require('./notes')
const usersResolvers = require('./users')

module.exports = {
    Query: {
        ...notesResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...notesResolvers.Mutation
    }
}