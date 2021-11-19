const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    token: String!
    name: String!
    level: Int
    points: Int
    color: String
    avatar: String
    createdAt: String!
    following: [String]
    followers: [String]
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
  type Result {
    _id: ID!
    userId: String!
    quizId: String!
    score: Int!
    time: String!
    badges: [String]
    record: [Int]
    createdAt: String!
  }
  type Badge {
    image: String
    title: String!
    points: Int!
    description: String
  }

  type Query {
    getUser(userId: ID!): User
    getUsers(name: String!): [User]
    getQuiz(quizId: ID!): Quiz!
    getQuizzes(filters: QuizInput): [Quiz]
    getSearchResults(query: String!, searchFilter: String): [SearchResult]
    getResults(filters: ResultInput): [Result]
    getBadge(badgeId: ID!): Badge
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    changePassword(newPassword: String!, confirmPassword: String!): Boolean!
    setFollower(creatorId: String, newFollowers: [String]): Boolean!
    updateUser(fields: UserInput): User!
    updateAvatar(userId: ID!, value: String!): Boolean!

    createQuiz(name: String!, creator: String!): Quiz!
    deleteQuiz(quizId: ID!): Quiz!
    updateQuiz(quizId: ID!, update: QuizInput): Quiz!
    updateThumbnail(quizId: ID!, value: String!): Boolean!
    updateBackground(quizId: ID!, value: String!): Boolean!

    createResult(input: ResultInput): Result!
    updateResult(resultId: ID!, update: ResultInput): Result!
    deleteResult(resultId: ID!): Result!
    deleteResults(filter: ResultInput): Boolean!

    createComment(quizId: ID!, user: ID!, body: String!): Quiz!
    deleteComment(quizId: ID!, commentId: ID!): Quiz!
  }

  union SearchResult = User | Quiz

  type Question {
    question: String!
    answer: Int!
    choices: [String!]!
  }
  type Comment {
    _id: ID
    body: String
    user: ID
    createdAt: String
  }
  type Stats {
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

  input RegisterInput {
    name: String!
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input UserInput {
    _id: ID
    email: String
    username: String
    token: String
    name: String
    level: Int
    points: Int
    color: String
    avatar: String
    createdAt: String
    following: [String]
    followers: [String]
  }
  input QuizInput {
    _id: ID
    name: String
    description: String
    publishedDate: String
    published: Boolean
    creator: ID
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
  input ResultInput {
    _id: ID
    userId: String
    quizId: String
    score: Int
    time: String
    badges: [String]
    record: [Int]
    createdAt: String
  }
  input QuestionInput {
    question: String
    answer: Int
    choices: [String]
  }
  input CommentInput {
    comment: String
    name: String
    createdAt: String
  }
  input StatsInput {
    averageScore: Int
    lowestScore: Int
    highestScore: Int
    averageTime: String
  }
  input StyleInput {
    color: String
    backgroundColor: String
    questionColor: String
    choiceColor: String
  }
`;
