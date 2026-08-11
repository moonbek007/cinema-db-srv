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
