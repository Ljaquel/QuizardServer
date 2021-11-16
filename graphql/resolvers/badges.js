const ObjectId = require('mongoose').Types.ObjectId;
const Badge = require('../../models/Badge');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getBadge(_, { badgeId }) {
      try {
        let _id = new ObjectId(badgeId)
        const badge = await Badge.findById(_id);
        if (badge) {
          return badge;
        } else {
          throw new Error("Quiz not found");
        }
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
  },
  Mutation: {

  },
};
