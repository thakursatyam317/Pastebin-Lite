import mongoose from "mongoose";

const pastebinLiteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    ttl_seconds: {
      type: Number,
      default: 1,
    },
    max_views: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PastebinLite = mongoose.model("PastebinLite", pastebinLiteSchema);
export default PastebinLite;


//6957efb5d16416330aea3ab9