import mongoose from "mongoose";

const { Schema } = mongoose;

export const collectionSchema = new Schema({
  count: Number,
  name: String,
});
