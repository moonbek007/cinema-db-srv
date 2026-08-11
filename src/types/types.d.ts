declare type Show = {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average: number | null;
  };
  weight: number;
  network: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    };
    officialSite: string | null;
  } | null;
  webChannel: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    } | null;
    officialSite: string | null;
  } | null;
  dvdCountry: {
    name: string;
    code: string;
    timezone: string;
  } | null;
  externals: {
    tvrage: number | null;
    thetvdb: number | null;
    imdb: string | null;
  };
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  updated: number;
  _links: {
    self: {
      href: string;
    };
    previousepisode?: {
      href: string;
      name: string;
    };
    nextepisode?: {
      href: string;
      name: string;
    };
  };
};

declare type Err = { error: string };

declare type MoviesRequestQuery = {
  Genre?: string;
  Type?: string;
  Raing?: string;
  Country?: string;
  Status?: string;
  Language?: string;
};

declare type MoviesQueryObject = {
  "rating.average"?: { $gt: number };
  genres?: { $in: string[] };
  type?: { $in: string[] };
  "network.country.name"?: { $in: string[] };
  status?: { $in: string[] };
  language?: { $in: string[] };
};

declare type MoviesResponseBody = Show[] | Err;

declare type MoviesByIdRequestQueryParams = {
  id: string;
};

declare type MoviesByIdResponseBody = Show | Err;

declare type MoviesByNameRequestQuery = {
  name: string;
};

declare type MoviesByNameResponseBody = Show[] | Err;

declare type CollectionsResponseBody = { count: number; name: string }[] | Err;

declare type GenresPreviewResponseBody =
  | { count: number; shows: Show[]; name: string }[]
  | Err;
