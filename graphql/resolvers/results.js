const ObjectId = require('mongoose').Types.ObjectId;
const Result = require('../../models/Result');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getResults(_, { filters }) {
      try {

        let prepFilters = { ...filters }

        if(filters?.userId) prepFilters.userId = new ObjectId(filters.userId)

        if(filters?.quizId) prepFilters.quizId = new ObjectId(filters.quizId)

        const results = await Result.find(prepFilters).sort({ createdAt: -1 });
        return results

      } catch(err){
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createResult(_, { input }, context) {
      try {
        checkAuth(context);

        const newResult = new Result({
          ...input,
          rating: -1,
          bestAttemptAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        const result = await newResult.save();
        return result;

      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
    async deleteResult(_, { resultId }, context) {
      checkAuth(context);
      const filter = { _id: new ObjectId(resultId) }
      const modified = await Result.findOneAndDelete(filter);
      return modified;
    },
    async updateResult(_, { resultId, update }, context) {
      checkAuth(context);
      const filter = { _id: new ObjectId(resultId) }
      let updates = {...update, modifiedAt: new Date().toISOString()}
      if(update?.score) updates = {...updates, bestAttemptAt: updates.modifiedAt}
      const modified = await Result.findOneAndUpdate(filter, {$set: updates}, { new: true });
      return modified;
    },
    async deleteResults(_, { filter }, context) {
      checkAuth(context);
      let prepFilter = { ...filter }
      if(prepFilter?.quizId) prepFilter.quizId = new ObjectId(prepFilter.quizId)
      if(prepFilter?.userId) prepFilter.userId = new ObjectId(prepFilter.userId)
      const bool = await Result.deleteMany(prepFilter);
      return bool;
    },
  },
};
