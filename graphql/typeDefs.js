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
    avatar: Image
    createdAt: String!
    following: [String]
    followers: [String]
  }
  type Platform {
    _id: ID!
    name: String!
    description: String!
    creator: User
    rating: Float!
    ratingCount: Int!
    image: Image
    banner: Image
    bannerColor: String
    followers: [String]
    following: [String]
    createdAt: String!
  }
  type Quiz {
    _id: ID!
    name: String!
    description: String!
    publishedDate: String
    published: Boolean!
    creator: User
    platform: Platform
    timesPlayed: Int!
    usersThatPlayed: Int
    time: String
    rating: Float!
    ratingCount: Int!
    comments: [Comment]!
    difficulty: String!
    style: Style
    tags: [String]
    category: String
    stats: Stats
    content: [Question]!
    backgroundImage: Image
    thumbnail: Image
    createdAt: String!
  }
  type Result {
    _id: ID!
    userId: String!
    quizId: String!
    score: Int!
    time: String!
    timesTaken: Int
    badges: [String]
    record: [Int]
    last: Int
    lastTime: String
    lastRecord: [Int]
    rating: Float
    bestAttemptAt: String!
    modifiedAt: String!
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
    getPlatform(platformId: ID!): Platform!
    getPlatforms(filters: PlatformInput): [Platform]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    changePassword(newPassword: String!, confirmPassword: String!): Boolean!
    updateUser(userId: ID!, update: UserInput): Boolean!

    createQuiz(name: String!, creatorId: String!, platformId: String!): Boolean!
    deleteQuiz(quizId: ID!): Boolean!
    updateQuiz(quizId: ID!, update: QuizInput): Boolean!

    createPlatform(name: String!, creatorId: String!): Boolean!
    deletePlatform(platformId: ID!): Boolean!
    updatePlatform(platformId: ID!, update: PlatformInput): Boolean!

    createResult(input: ResultInput): Result!
    updateResult(resultId: ID!, update: ResultInput): Result!
    deleteResult(resultId: ID!): Result!
    deleteResults(filter: ResultInput): Boolean!

    createComment(quizId: ID!, user: ID!, body: String!): Boolean!
    deleteComment(quizId: ID!, commentId: ID!): Boolean!

    updateImage(type: String, _id: ID!, field: String, publicId: String, url: String): Boolean!
  }

  union SearchResult = User | Quiz | Platform

  type Question {
    question: String!
    answer: Int!
    choices: [String!]!
  }
  type Comment {
    _id: ID
    body: String
    user: User
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
  type Image {
    publicId: String
    url: String
  }


  input ImageInput {
    publicId: String
    url: String
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
    avatar: ImageInput
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
    platform: ID
    timesPlayed: Int
    time: String
    rating: Float
    usersThatPlayed: Int
    category: String
    ratingCount: Int
    comments: [CommentInput]
    difficulty: String
    style: StyleInput
    tags: [String]
    stats: StatsInput
    content: [QuestionInput]
    backgroundImage: ImageInput
    thumbnail: ImageInput
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
    timesTaken: Int
    last: Int
    lastTime: String
    lastRecord: [Int]
    rating: Float
    bestAttemptAt: String
    modifiedAt: String
    createdAt: String
  }
  input QuestionInput {
    question: String
    answer: Int
    choices: [String]
  }
  input CommentInput {
    body: String
    user: String
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
  input PlatformInput {
    _id: ID
    name: String
    description: String
    creator: ID
    rating: Float
    ratingCount: Int
    image: ImageInput
    banner: ImageInput
    bannerColor: String
    followers: [String]
    following: [String]
    createdAt: String
  }
`;
