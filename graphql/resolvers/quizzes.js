const { AuthenticationError } = require('apollo-server');

const ObjectId = require('mongoose').Types.ObjectId;
const Quiz = require('../../models/Quiz');
const checkAuth = require('../../util/check-auth');


module.exports = {
  Query: {
    async getQuizzesbyUserid(_, { creatorID }) {
      try { 
           
            const quizzes = await Quiz.find({creator : creatorID});
            console.log("Found")
            return quizzes;
      } catch (err) {
            console.log("SOMEERROR BIG")
        throw new Error(err);
      }
    },
    async getQuizzes() {
      try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        return quizzes
      } catch(err){
        throw new Error(err);
      }
    },
    async getQuiz(_, { quizId }) {
      try {
        const quiz = await Quiz.findById(quizId);
        if (quiz) {
          return quiz;
        } else {
          throw new Error("Quiz not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createQuiz(_, { name, creator }, context) {
      try {
        checkAuth(context);
        const newQuiz = new Quiz({
          name,
          description: "",
          creator,
          publishedDate: "",
          published: false,
          timesPlayed: 0,
          time: "",
          rating: 0,
          comments: [],
          difficulty: "easy",
          color: "black",
          stats: {},
          content: [],
          backgroundImage: "",
          thumbnail: "",
          createdAt: new Date().toISOString(),
        });
        const quiz = await newQuiz.save();
        return quiz;
      } catch (err) {
        console.log(err);
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
    async deleteQuiz(_, { quizId }, context) {
      checkAuth(context);
      const filter = { _id: new ObjectId(quizId) }
      const modified = await Quiz.findOneAndDelete(filter);
      return modified;
    },
    async updateQuiz(_, { quizId, update }, context) {
      checkAuth(context);
      const filter = { _id: new ObjectId(quizId) }
      const modified = await Quiz.findOneAndUpdate(filter, {$set: update}, { new: true });
      return modified;
    },
  },
};
