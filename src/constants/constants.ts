export enum BaseEndpoints {
  MOVIES = "/api/movies",
  COLLECTIONS = "/api/collections",
  GENRES = "/api/genres",
}

export enum MoviesEndpoints {
  BASE = "/",
  BY_ID = "/:id",
  SEARCH = "/search",
}

export enum CollectionsEndpoints {
  BASE = "/",
}

export enum GenresEndpoints {
  BASE = "/",
  PREVIEW = "/preview",
}

export enum MoviesQueryParams {
  GENRE = "Genre",
  TYPE = "Type",
  RATING = "Rating",
  COUNTRY = "Country",
  STATUS = "Status",
  LANGUAGE = "Language",
  PAGE = "Page",
  SEARCH = "Search",
}

export enum CountryQueryValues {
  USA = "USA",
  USA_FULL = "United States",
  UK = "UK",
  UK_FULL = "United Kingdom",
}

export enum DB_MODELS {
  SHOW = "Show",
  COLLECTION = "Collection",
}

export enum DB_NAMES {
  TRENDING_SHOWS = "trendingShows",
  COLLECTIONS_INFO = "collectionsInfo",
}

export const moviesPerPage = 20;

export const mongoDbURI = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@ac-riz9jhg-shard-00-00.2daclnk.mongodb.net:27017,ac-riz9jhg-shard-00-01.2daclnk.mongodb.net:27017,ac-riz9jhg-shard-00-02.2daclnk.mongodb.net:27017/${process.env.MONGO_DB_DB_NAME}?ssl=true&replicaSet=atlas-nx5y6d-shard-0&authSource=admin&appName=Cluster0`;
export const PORT = process.env.PORT || 3000;

export const redisConfig = {
  username: "default",
  password: process.env.REDIS_DB_PASSWORD,
  socket: {
    host: "test-smoothed-aware-76147.db.redis.io",
    port: 11099,
  },
};
