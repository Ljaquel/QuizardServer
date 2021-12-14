const ObjectId = require("mongoose").Types.ObjectId;
const Platform = require("../../models/Platform");
const checkAuth = require("../../util/check-auth");
const cloudinary = require("../../util/cloudinary");

const userFieldsToPopulate = '_id name username'

module.exports = {
  Query: {
    async getPlatforms(_, { filters }) {
      try {
        const platforms = await Platform.find(filters)
          .populate({ path: 'creator', select: userFieldsToPopulate })
          .sort({ createdAt: -1 });
        return platforms;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlatformsAdvanced(_, { filters, sorting, limit }) {
      try {
        const platforms = await Platform.find(filters).sort({ [sorting.platform]: sorting.dir}).limit(limit)
        .populate({ path: 'creator', select: userFieldsToPopulate });
        return platforms
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPlatform(_, { platformId }) {
      try {
        const platform = await Platform.findById(platformId)
          .populate({ path: 'creator', select: userFieldsToPopulate });
        if (platform) return platform 
        else { throw new Error("Platform not found") }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPlatform(_, { name, creatorId }, context) {
      try {
        checkAuth(context);
        const newPlatform = new Platform({
          name,
          description: "Provide platform description here",
          creator: creatorId,
          image: {
            publicId: "",
            url: ""
          },
          banner: {
            publicId: "",
            url: ""
          },
          bannerColor: "#7f8ab5",
          followers: [],
          following: [],
          rating: 0.0,
          ratingCount: 0,
          createdAt: new Date().toISOString(),
        });
        await newPlatform.save();
        return true;
      } catch (err) {
        console.log(err);
        console.log(JSON.stringify(err, null, 2));
        throw new Error(err);
      }
    },
    async deletePlatform(_, { platformId }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(platformId) };
        const platform = await Platform.findById(filter._id);
        if (platform.image?.publicId && platform.image.publicId !== "") {
          const res = await cloudinary.v2.uploader.destroy(platform.image.publicId);
          if (res.result !== "ok") throw new Error();
        }
        if (platform.banner?.publicId && platform.banner.publicId !== "") {
          const res = await cloudinary.v2.uploader.destroy(platform.banner.publicId);
          if (res.result !== "ok") throw new Error();
        }
        await Platform.findOneAndDelete(filter);
        return true;
      }
      catch(err) {
        throw new Error(err)
      }
    },
    async updatePlatform(_, { platformId, update }, context) {
      checkAuth(context);
      try {
        const filter = { _id: new ObjectId(platformId) };
        await Platform.findOneAndUpdate( filter, { $set: update }, { new: true });
        return true;
      }
      catch(err) {
        throw new Error(err) 
      }
    },
  },
};
