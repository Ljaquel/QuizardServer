const ObjectId = require("mongoose").Types.ObjectId;
const Quiz = require("../../models/Quiz");
const checkAuth = require("../../util/check-auth");
const cloudinary = require("../../util/cloudinary");

const userFieldsToPopulate = '_id name username'
const platformFieldsToPopulate = '_id name'

module.exports = {
  Query: {
    async getQuizzes(_, { filters }) {
      try {
        const quizzes = await Quiz.find(filters)
          .populate({ path: 'creator', select: userFieldsToPopulate })
          .populate({ path: 'platform', select: platformFieldsToPopulate })
          .populate({ path: 'comments', populate: { path: 'user', select: userFieldsToPopulate }})
          .sort({ createdAt: -1 });
        return quizzes;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getQuiz(_, { quizId }) {
      try {
        const quiz = await Quiz.findById(quizId)
          .populate({ path: 'creator', select: userFieldsToPopulate })
          .populate({ path: 'platform', select: platformFieldsToPopulate })
          .populate({ path: 'comments', populate: { path: 'user', select: userFieldsToPopulate }});
        if (quiz) { return quiz } 
        else { throw new Error("Quiz not found") }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createQuiz(_, { name, creatorId, platformId }, context) {
      try {
        checkAuth(context);
        const newQuiz = new Quiz({
          name,
          description: "Provide description here",
          creator: creatorId,
          platform: platformId,
          publishedDate: "",
          published: false,
          timesPlayed: 0,
          usersThatPlayed: 0,
          time: "00:10:00",
          rating: 0.0,
          ratingCount: 0,
          comments: [],
          difficulty: "Easy",
          style: {
            color: "#FFFFFF",
            questionColor: "#475047",
            backgroundColor: "#abafbb",
            choiceColor: "#475047",
          },
          tags: [],
          category: 'Other',
          stats: {
            averageScore: null,
            lowestScore: null,
            highestScore: null,
            averageTime: null,
          },
          content: [
            {
              question: "Question?",
              answer: 1,
              choices: ["Answer A", "Answer B", "Answer C", "Answer D"],
            },
          ],
          backgroundImage: {
            publicId: "",
            url: ""
          },
          thumbnail: {
            publicId: "",
            url: ""
          },
          createdAt: new Date().toISOString(),
        });
        await newQuiz.save();
        return true;
      } catch (err) {
        console.log(err);
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
    async createComment(_, { quizId, user, body }, context) {
      try {
        const quiz = await Quiz.findById(quizId);
        console.log(quiz);
        const comment = { user, body, createdAt: new Date().toISOString() };
        await quiz.comments.unshift(comment);
        await quiz.save();
        return true;
      }
      catch(err) {
        throw new Error(err)
      }
    },
    async deleteComment(_, { quizId, commentId }, context) {
      try {
        const quiz = await Quiz.findById(quizId);
        await quiz.comments.id(commentId).remove();
        await quiz.save();
        return true;
      }
      catch(err) {
        throw new Error(err)
      }
    },
    async deleteQuiz(_, { quizId }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(quizId) };
        const quiz = await Quiz.findById(filter._id);
        if (quiz.thumbnail?.publicId && quiz.thumbnail.publicId !== "") {
          const res = await cloudinary.v2.uploader.destroy(quiz.thumbnail.publicId);
          if (res.result !== "ok") throw new Error();
        }
        if (quiz.backgroundImage?.publicId && quiz.backgroundImage.publicId !== "") {
          const res = await cloudinary.v2.uploader.destroy(quiz.backgroundImage.publicId);
          if (res.result !== "ok") throw new Error();
        }
        await Quiz.findOneAndDelete(filter);
        return true;
      }
      catch(err) {
        throw new Error(err)
      }
    },
    async updateQuiz(_, { quizId, update }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(quizId) };
        await Quiz.findOneAndUpdate( filter, { $set: update }, { new: true });
        return true;
      }
      catch(err) {
        throw new Error(err) 
      }
    },
  },
};
