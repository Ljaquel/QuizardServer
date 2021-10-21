const { AuthenticationError, UserInputError } = require('apollo-server');
const Quiz = require('../../models/Quiz');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getQuizzes() {
      try {
        const quizzes = await Quiz.find();
        return quizzes
      } catch(err){
        throw new Error(err);
      }
    },
    async getQuiz(_, { quizId }) {
      try {
        const quiz = await Quiz.findById(quizId);
        if(quiz) { return quiz; } 
        else { throw new Error('Quiz not found'); }
      } catch(err){
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createQuiz(_, { name, creator }, context) {
      const user = checkAuth(context);
      console.log(user)
      const newQuiz = new Quiz({
        name,
        creator: user._id,
        createdAt: new Date().toISOString()
      });
      const quiz = await newQuiz.save();
      return quiz;
    },
    async deleteQuiz(_, { quizId }, context) {
      const user = checkAuth(context);
      try {
        const quiz = await Quiz.findById(quizId);
        if (user._id === quiz.creator) {
          await quiz.delete();
          return 'Quiz deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  }
}