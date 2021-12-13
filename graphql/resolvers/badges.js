const ObjectId = require("mongoose").Types.ObjectId;
const Badge = require("../../models/Badge");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getBadge(_, { badgeId }) {
      try {
        let _id = new ObjectId(badgeId);
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
    }
  },
  Mutation: {
    async createBadge(_, { badgeInput }) {
      try {
        const badge = new Badge({ ...badgeInput });
        await badge.save();
        return badge;
      } catch (error) {
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
    async updateBadge(_, { badgeId, badgeInput }) {
      try {
        const badge = await Badge.findOneAndUpdate(
          {
            _id: badgeId
          },
          { $set: { ...badgeInput, modifiedAt: new Date().toISOString() } },
          { new: true }
        );
        return badge;
      } catch (error) {
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
    async deleteBadge(_, { badgeId }) {
      try {
        await Badge.findByIdAndDelete(badgeId);
        return true;
      } catch (error) {
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
        return false;
      }
    }
  }
};
