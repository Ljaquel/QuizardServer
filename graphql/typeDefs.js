const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    name: String
    points: Int
    color: String
    history: [Result]
    rewards: Rewards
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
    comments: [Comment]!
    difficulty: String!
    style: Style
    tags: [String]
    stats: Stats
    content: [Question]!
    backgroundImage: String
    thumbnail: String
    createdAt: String!
  }
  union SearchResult = User | Quiz
  input RegisterInput {
    name:String!
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input UserInput {
    _id: ID
    email: String
    token: String
    username: String
    createdAt: String
    name: String
    points: Int
    color: String
    history: [ResultInput]
    rewards: RewardsInput
  }
  type Query {
    getUser(userId: ID!): User
    getUsers(name:String!): [User]
    getQuizzes(filters: QuizInput): [Quiz]
    getQuiz(quizId: ID!): Quiz!
    getSearchResults(query: String!, searchFilter: String): [SearchResult]!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    changePassword(newPassword: String!, confirmPassword: String!): Boolean!
    updateUser(fields: UserInput): User!
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
    comments: [CommentInput]
    difficulty: String
    style: StyleInput
    tags: [String]
    stats: StatsInput
    content: [QuestionInput]
    backgroundImage: String
    thumbnail: String
    createdAt: String
  }
  type Question {
    question: String!
    answer: Int!
    choices: [String!]!
  }
  input QuestionInput {
    question: String
    answer: Int
    choices: [String]
  }
  type Comment {
    comment: String
    name: String
    createdAt: String
  }
  input CommentInput {
    comment: String
    name: String
    createdAt: String
  }
  type Stats {
    averageScore: Int
    lowestScore: Int
    highestScore: Int
    averageTime: String
  }
  input StatsInput {
    averageScore: Int
    lowestScore: Int
    highestScore: Int
    averageTime: String
  }
  type Style {
    color: String
    backgroundColor: String
    questionColor: String
    choiceColor: String
  }
  input StyleInput {
    color: String
    backgroundColor: String
    questionColor: String
    choiceColor: String
  }
  type Result {
    quizId: String
    score: Int
    time: String
  }
  type Rewards {
    level: Int
    points: Int
    badges: [String]
  }
  input ResultInput {
    quizId: String
    score: Int
    time: String
  }
  input RewardsInput {
    level: Int
    points: Int
    badges: [String]
  }
`;
