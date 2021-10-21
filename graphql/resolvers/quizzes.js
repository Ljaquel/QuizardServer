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
  
  }
}