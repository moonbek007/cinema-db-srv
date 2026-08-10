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
  runtime: Number,
  averageRuntime: Number,
  premiered: String,
  ended: String,
  officialSite: String,
  schedule: {
    time: String,
    days: [String],
  },
  rating: {
    average: Number,
  },
  weight: Number,
  network: {
    id: Number,
    name: String,
    country: {
      name: String,
      code: String,
      timezone: String,
    },
    officialSite: String,
  },
  webChannel: {
    id: Number,
    name: String,
    country: {
      name: String,
      code: String,
      timezone: String,
      officialSite: String,
    },
  },
  dvdCountry: {
    name: String,
    code: String,
    timezone: String,
  },
  externals: {
    tvrage: Number,
    thetvdb: Number,
    imdb: String,
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
      href: String,
      name: String,
    },
    nextepisode: {
      href: String,
      name: String,
    },
  },
});
