const ObjectId = require('mongoose').Types.ObjectId;
const Notification = require('../../models/Notification');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getNotifications(_, { filters }) {
      try {
        let prepFilters = { ...filters }
        if(filters?.to) prepFilters.to = new ObjectId(filters.to)
        if(filters?.fromU) prepFilters.fromU = new ObjectId(filters.fromU)
        if(filters?.fromP) prepFilters.fromP = new ObjectId(filters.fromP)
        if(filters?.subject) prepFilters.subject = new ObjectId(filters.subject)

        const notifications = await Notification.find(prepFilters).sort({ createdAt: -1 })
          .populate({ path: 'to', select: '_id name' })
          .populate({ path: 'fromU', select: '_id name' })
          .populate({ path: 'fromP', select: '_id name' })
          .populate({ path: 'subject', select: '_id name' });

        let res = [...notifications]
        return res.slice(0, 8)
      } catch(err){
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async updateNotification(_, { notificationId, seen }, context) {
      checkAuth(context);
      const filter = { _id: new ObjectId(notificationId) }
      let updates = { seen }
      await Notification.findOneAndUpdate(filter, {$set: updates}, { new: true });
      return true;
    },
  },
};
