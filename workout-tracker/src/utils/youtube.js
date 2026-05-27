export function buildYouTubeSearchURL(exerciseName) {
  const query = `como fazer ${exerciseName} execução`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
