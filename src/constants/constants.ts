export enum BaseEndpoints {
  MOVIES = "/movies",
  COLLECTIONS = "/collections",
}

export enum MoviesEndpoints {
  BASE = "/",
  BY_ID = "/:id",
}

export enum CollectionsEndpoints {
  BASE = "/",
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
