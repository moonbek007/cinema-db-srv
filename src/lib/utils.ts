import { type Request } from "express";

export function getRandomShows(shows: Show[], count: number) {
  const showsAdded: Record<string, boolean> = {};
  const randomShows: Show[] = [];
  while (randomShows.length <= count) {
    const show = shows[Math.floor(Math.random() * (shows.length - count))];
    if (showsAdded[show.id]) continue;
    showsAdded[show.id] = true;
    randomShows.push(show);
  }
  return randomShows;
}

export function generateMoviesCacheKey(req: Request, prefix: string): string {
  const queryKeys = Object.keys(req.query);
  // If no query keys provided, Page query should be set to 1
  if (!queryKeys.length) return `${prefix}:{"Page":"1"}`;

  // Sort the query object keys alphabetically to ensure consistent keys
  const sortedQuery = queryKeys
    .sort()
    .reduce((obj: Record<string, any>, key) => {
      // Lowercase values to prevent case-sensitive duplication if needed
      obj[key] = String(req.query[key]).trim();
      return obj;
    }, {});

  // Stringify the sorted query object
  const queryString = JSON.stringify(sortedQuery);

  // Output "movies:{"genre":"Drama","status":"Running","country":"Canada"}"
  return `${prefix}:${queryString}`;
}
