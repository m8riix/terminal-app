const Termino = window.Termino;
const ansi_up = new window.ansi_up();
const chalk = window.nightmarebotChalk;

let term = Termino(document.getElementById("terminal"));

async function getData(input) {
  const apiKey = 'bf99b4e624a319715068fad2ea7e4886';
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(input)}&page=1`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (searchData.total_results === 0) {
    throw { message: "Nothing Found" };
  }

  const movieId = searchData.results[0].id;
  const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  const detailsResponse = await fetch(detailsUrl);
  const result = await detailsResponse.json();

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins}min`;
  };

  const movieRes = `
${chalk.black.bgYellow.bold(result.original_title)} (${result.release_date ? result.release_date.slice(0, 4) : 'N/A'}) on TMDb:
${chalk.yellow(`☆ ${result.vote_average.toFixed(1)}`)} (based on ${result.vote_count} votes)

Overview: ${result.overview || 'N/A'}
Runtime: ${formatRuntime(result.runtime)}
Genres: ${result.genres ? result.genres.map(g => g.name).join(', ') : 'N/A'}
Popularity: ${result.popularity.toFixed(1)}
`;

  return ansi_up.ansi_to_html(movieRes);
}

const inputField = document.getElementById('input-field');
inputField.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const cmd = inputField.value.trim();
    if (cmd) {
      term.print(`> ${cmd}`);
      try {
        const output = await getData(cmd);
        term.print(output);
      } catch (error) {
        term.print(error.message);
      }
      inputField.value = '';
    }
  }
});

term.print('Welcome to Movie Terminal! Type a movie title and press Enter.');
