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
    creator: ID!
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
  input UserUpdateInput {
    username: String!
    firstName: String!
    lastName: String!
    email: String!
  }
  type Query {
    getQuizzes: [Quiz]
    getQuiz(quizId: ID!): Quiz!
    getQuizzesByCreator(creatorId: ID!): [Quiz]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    changePassword(newPassword: String!, confirmPassword: String!): String!
    updateUserFields(updateFields: UserUpdateInput): User
    createQuiz(name: String!, creator: String!): Quiz!
    deleteQuiz(quizId: ID!): Quiz!
    updateQuiz(quizId: ID!, update: QuizInput): Quiz!
  }
  input QuizInput {
    _id: ID
    name: String
    description: String
    publishedDate: String
    published: Boolean
    creator: String
    timesPlayed: Int
    time: String
    rating: Int
    comments: [String]
    difficulty: String
    color: String
    stats: String
    content: [QuestionInput]
    backgroundImage: String
    thumbnail: String
    createdAt: String
  }
  input QuestionInput {
    question: String
    answer: Int
    choices: [String]
  }
`;
