export enum BaseEndpoints {
  MOVIES = "/movies",
  COLLECTIONS = "/collections",
  GENRES = "/genres",
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
