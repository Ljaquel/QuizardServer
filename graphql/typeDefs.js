const { gql } = require("apollo-server");

module.exports = gql`
    type User {
        _id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    type Question {
      question: String!
      answer: Int!
      choices: [String!]!
    }
    type Quiz {
      _id: ID!
      name: String!
      description: String!
      publishedDate: String
      published: Boolean!
      creator: String!
      timesPlayed: Int!
      time: String
      rating: Int!
      comments: [String!]!
      difficulty: String!
      color: String!
      stats: String
      content: [Question]!
      backgroundImage: String
      thumbnail: String
      createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getQuizzes: [Quiz]


        getQuizzesbyUserid(creatorID: String!): [Quiz]
      


        getQuiz(quizId: ID!): Quiz!
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createQuiz( name: String!, creator: String! ): Quiz!
        deleteQuiz(quizId: ID!): String!
    }
`;
