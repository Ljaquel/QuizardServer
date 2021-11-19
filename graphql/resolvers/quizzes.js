const ObjectId = require('mongoose').Types.ObjectId;
const Quiz = require('../../models/Quiz');
const checkAuth = require('../../util/check-auth');
const cloudinary = require('../../util/cloudinary');

module.exports = {
  Query: {
    async getQuizzes(_, { filters }) {
      try {
        const quizzes = await Quiz.find(filters).sort({ createdAt: -1 });
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
          description: "Provide description here",
          creator,
          publishedDate: "",
          published: false,
          timesPlayed: 0,
          time: "00:10:00",
          rating: 0,
          comments: [],
          difficulty: "easy",
          style: {
            color: "#FFFFFF",
            questionColor: "#475047",
            backgroundColor: "#abafbb",
            choiceColor: "#475047",
          },
          tags: [],
          stats: {
            averageScore: null,
            lowestScore: null,
            highestScore: null,
            averageTime: null
          },
          content: [
            {
              question: "Question?",
              answer: 1,
              choices: ["Answer A", "Answer B", "Answer C", "Answer D"]
            }
          ],
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
      const quiz = await Quiz.findById(filter._id);
      if(quiz.thumbnail && quiz.thumbnail !== "") {
        const res = await cloudinary.v2.uploader.destroy(quiz.thumbnail)
        if(res.result !== 'ok') throw new Error
      }
      if(quiz.backgroundImage && quiz.backgroundImage !== "") {
        const res = await cloudinary.v2.uploader.destroy(quiz.backgroundImage)
        if(res.result !== 'ok') throw new Error
      }
      const modified = await Quiz.findOneAndDelete(filter);
      return modified;
    },
    async updateQuiz(_, { quizId, update }, context) {
      checkAuth(context);
      const filter = { _id: new ObjectId(quizId) }
      const modified = await Quiz.findOneAndUpdate(filter, {$set: update}, { new: true });
      return modified;
    },
    async updateThumbnail(_, { quizId, value }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(quizId) }
        const quiz = await Quiz.findById(filter._id);
        if(quiz.thumbnail && quiz.thumbnail !== "") {
          const res = await cloudinary.v2.uploader.destroy(quiz.thumbnail)
          if(res.result !== 'ok') throw new Error
        }
        await Quiz.findOneAndUpdate(filter, {$set: {thumbnail: value}}, { new: true });
        return true;
      }
      catch(err) {
        throw new Error(err);
      }
    },
    async updateBackground(_, { quizId, value }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(quizId) }
        const quiz = await Quiz.findById(filter._id);
        if(quiz.backgroundImage && quiz.backgroundImage !== "") {
          const res = await cloudinary.v2.uploader.destroy(quiz.backgroundImage)
          if(res.result !== 'ok') throw new Error
        }
        await Quiz.findOneAndUpdate(filter, {$set: {backgroundImage: value}}, { new: true });
        return true;
      }
      catch(err) {
        throw new Error(err);
      }
    },
  },
};
