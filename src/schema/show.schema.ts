import mongoose from "mongoose";

const { Schema } = mongoose;

export const showSchema = new Schema({
  id: Number,
  url: String,
  name: String,
  type: String,
  language: String,
  genres: [String],
  status: String,
  runtime: { type: Number, allowNull: true },
  averageRuntime: { type: Number, allowNull: true },
  premiered: { type: String, allowNull: true },
  ended: { type: String, allowNull: true },
  officialSite: { type: String, allowNull: true },
  schedule: {
    time: String,
    days: [String],
  },
  rating: {
    average: { type: Number, allowNull: true },
  },
  weight: Number,
  network: {
    type: {
      id: Number,
      name: String,
      country: {
        name: String,
        code: String,
        timezone: String,
      },
      officialSite: { type: String, allowNull: true },
    },
    allowNull: true,
  },
  webChannel: {
    type: {
      id: Number,
      name: String,
      country: {
        name: String,
        code: String,
        timezone: { type: String, allowNull: true },
        officialSite: { type: String, allowNull: true },
      },
    },
    allowNull: true,
  },
  dvdCountry: {
    type: {
      name: String,
      code: String,
      timezone: String,
    },
    allowNull: true,
  },
  externals: {
    tvrage: { type: Number, allowNull: true },
    thetvdb: { type: Number, allowNull: true },
    imdb: { type: String, allowNull: true },
  },
  image: {
    medium: String,
    original: String,
  },
  summary: String,
  updated: Number,
  _links: {
    self: {
      href: String,
    },
    previousepisode: {
      type: {
        href: String,
        name: String,
      },
      allowNull: true,
    },
    nextepisode: {
      type: {
        href: String,
        name: String,
      },
      allowNull: true,
    },
  },
});
