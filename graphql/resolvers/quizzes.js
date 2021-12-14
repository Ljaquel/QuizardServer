const ObjectId = require("mongoose").Types.ObjectId;
const Quiz = require("../../models/Quiz");
const Result = require("../../models/Result");
const Notification = require("../../models/Notification");
const Platform = require("../../models/Platform");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");
const cloudinary = require("../../util/cloudinary");

const userFieldsToPopulate = '_id name username'
const platformFieldsToPopulate = '_id name'

function getAverageTime(array) {
  var times = [3600, 60, 1],
  parts = array.map(s => s.split(':').reduce((s, v, i) => s + times[i] * v, 0)),
  avg = Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);

  return times
    .map(t => [Math.floor(avg / t), avg %= t][0])
    .map(v => v.toString().padStart(2, 0))
    .join(':');
}

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
    async getQuizStats(_, { quizId }) {
      try {
        let stats = {lowestScore: 100, highestScore:0, averageScore: 0, averageTime: ''}
        let id =  new ObjectId(quizId)

        const results = await Result.find({quizId: id});
        if(results.length ===0) return {lowestScore: 0, highestScore:0, averageScore: 0, averageTime: '0'}

        let scoreSum = 0
        let times = []
        for(let i=0; i < results.length; i++) {
          scoreSum += results[i].score
          times.push(results[i].time)
          if(results[i].score < stats.lowestScore) stats.lowestScore = results[i].score
          if(results[i].score > stats.highestScore) stats.highestScore = results[i].score
        }
        stats.averageScore = scoreSum/results.length
        
        stats.averageTime = getAverageTime(times)

        if(stats) return stats
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

        if(update.published === true) {
          const quiz = await Quiz.findById(filter._id)
          const user = await User.findById(quiz.creator)
          const platform = await Platform.findById(quiz.platform)

          let uFollowers = user.followers
          let pFollowers = platform.followers

          for (let i=0; i<pFollowers.length; i++) {
            if(uFollowers.includes(pFollowers[i])) pFollowers.splice(i, 1)
          }

          for(let i=0; i< uFollowers.length; i++) {
            let newNoti = new Notification({
              type:"User",
              fromU: user._id,
              fromP: platform._id,
              subject: quiz._id,
              seen: false,
              to: uFollowers[i],
              message: `${user.name} has published ${quiz.name}`,
              createdAt: new Date(),
            })
            await newNoti.save();
          }

          for(let i=0; i< pFollowers.length; i++) {
            let newNoti = new Notification({
              type:"Platform",
              fromU: user._id,
              fromP: platform._id,
              subject: quiz._id,
              seen: false,
              to: pFollowers[i],
              message: `${quiz.name} has been published under ${platform.name}`,
              createdAt: new Date(),
            })
            await newNoti.save();
          }
        }
        return true;
      }
      catch(err) {
        throw new Error(err) 
      }
    },
  },
};
